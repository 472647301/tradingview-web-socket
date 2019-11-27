import React from 'react';
import { TradingView, Datafeed } from 'trader-view'
import { IChartingLibraryWidget, IDatafeed, Bar } from 'trader-view'
import { PERIOD } from './utils/const'
import axios from 'axios'

type IProps = {}
class App extends React.Component<IProps> {
  public widget?: IChartingLibraryWidget
  public datafeed?: IDatafeed
  public socket?: WebSocket

  public state = {
    interval: '15'
  }

  /**
   * 初始化WebSocket
   */
  public initWebSocket() {
    // const url = 'wss://realtime1.tdex.com/realtime'
    // this.socket = new WebSocket(url)
    // this.socket.onmessage = e => {
    //   this.onSocketMessage(e.data)
    // }
  }

  /**
   * 监听WebSocket响应
   * @param msg string
   */
  public onSocketMessage(msg: string) {
    try {
      const _msg = JSON.parse(msg)
      console.log(_msg)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * 初始化 JS API
   */
  public initDatafeed() {
    this.datafeed = new Datafeed({
      history: params => {
        return this.fetchHistoryData(
          params.symbol,
          params.resolution,
          params.from,
          params.to
        )
      },
      config: () => new Promise(resolve => resolve({
        supports_search: true,
        supports_group_request: false,
        supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M'],
        supports_marks: false,
        supports_timescale_marks: false,
        supports_time: false
      })),
      symbols: () => new Promise(resolve => resolve({
        name: 'BTC/USDT',
        full_name: 'BTC/USDT',
        description: 'BTC/USDT',
        type: 'btcusdt',
        session: '24x7',
        exchange: 'BTC',
        listed_exchange: 'BTC',
        timezone: 'Asia/Shanghai',
        format: 'price',
        pricescale: 100,
        minmov: 1,
        has_intraday: true,
        supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M']
      }))
    })
  }

  /**
   * 获取历史数据
   */
  public async fetchHistoryData(symbol: string, period: string, from: number, to: number) {
    const { interval } = this.state
    if (interval !== period) {
      // 退订
      // 订阅
      this.setState({ interval: period })
    }
    const res = await axios.post<IApi<DataT>>('/v1/exchange/ticker/getScaleByDate', {
      from: from,
      symbol: "btcusdt",
      to: to,
      type: PERIOD[period]
    })
    const list: Bar[] = []
    if (res.data && res.data.data) {
      const _list = res.data.data
      for (let i = 0; i < _list.length; i++) {
        list.push({
          time: _list[i].id * 1000,
          close: _list[i].close,
          high: _list[i].high,
          low: _list[i].low,
          open: _list[i].open,
          volume: _list[i].volume
        })
      }
    }
    return {
      bars: list,
      meta: { noData: !list.length }
    }
  }

  /**
   * 初始化图表
   */
  public initTradingView() {
    if (!this.datafeed) {
      return
    }
    const { interval } = this.state
    this.widget = new TradingView({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: 'BTC/USDT',
      interval: interval,
      container_id: 'tv_chart_container',

      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: this.datafeed,
      library_path: '/charting_library/',
      locale: 'zh',

      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: 'http://saveload.tradingview.com',
      charts_storage_api_version: '1.1',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      theme: 'Dark',
      timezone: 'Asia/Shanghai'
    })
  }

  public componentDidMount() {
    this.initDatafeed()
    this.initWebSocket()
    window.addEventListener(
      'DOMContentLoaded',
      this.initTradingView.bind(this),
      false
    )
  }

  public render() {
    return <div id="tv_chart_container"></div>
  }
}

export default App;

type IApi<T> = {
  data: T
  error: string
  message: string
  status: number
  success: boolean
  timestamp: string
  type: string
}

type DataT = Array<{
  amount: number
  close: number
  date: string
  high: number
  id: number
  low: number
  open: number
  symbol: string
  type: string
  volume: number
}>
