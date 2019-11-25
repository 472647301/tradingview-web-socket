import React from 'react';
import { TradingView, Datafeed } from 'trader-view'
import { PERIOD_SERVER, PERIOD_CLINENT, PERIODS } from './utils/const'
import { IChartingLibraryWidget, IDatafeed, Bar } from 'trader-view'
import moment from 'moment'
import axios from 'axios'

type IProps = {}
class App extends React.Component<IProps> {
  public widget?: IChartingLibraryWidget
  public datafeed?: IDatafeed
  public socket?: WebSocket
  public period = 'D'

  /**
   * 初始化WebSocket
   */
  public initWebSocket() {
    const url = 'wss://realtime1.tdex.com/realtime'
    this.socket = new WebSocket(url)
    this.socket.onmessage = e => {
      this.onSocketMessage(e.data)
    }
  }

  /**
   * 监听WebSocket响应
   * @param msg string
   */
  public onSocketMessage(msg: string) {
    try {
      const _msg = JSON.parse(msg)
      console.log(_msg, PERIOD_SERVER)
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
        supported_resolutions: PERIODS,
        supports_marks: true,
        supports_timescale_marks: true,
        supports_time: true
      })),
      symbols: () => new Promise(resolve => resolve({
        name: 'BTCUSD',
        full_name: 'BTCUSD',
        description: 'BTCUSD',
        type: 'BTCUSD',
        session: '24x7',
        exchange: 'BTCUSD',
        listed_exchange: 'BTCUSD',
        timezone: 'Asia/Shanghai',
        format: 'price',
        pricescale: 100,
        minmov: 1,
        fractional: false,
        has_intraday: true,
        has_no_volume: false,
        supported_resolutions: PERIODS,
        intraday_multipliers: ['1', '5', '60']
      }))
    })
  }

  /**
   * 获取历史数据
   */
  public fetchHistoryData(symbol: string, period: string, from: number, to: number) {
    const params = {
      "Symbol": symbol,
      "Key": PERIOD_CLINENT[period],
      "Count": 500,
      "Type": "LAST",
      "From": from,
      "To": to
    }
    return axios.post<IApi<DataT>>('/api/v0.1.1/futures/kline', JSON.stringify({
      Data: params,
      "Time": null
    }), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(res => {
      const list: Bar[] = []
      if (res.data && res.data.Data && res.data.Data.List) {
        const _list = res.data.Data.List
        for (let i = 0; i < _list.length; i++) {
          list.push(this.klineItemParse(_list[i]))
        }
      }
      return {
        bars: list,
        meta: { noData: !list.length }
      }
    })
  }

  /**
   * 解析K线数据
   */
  public klineItemParse(item: string): Bar {
    // 日期,时间,开盘价,最高价,最低价,收盘价,成交量
    const kline = item.split(',')
    const stringTime = kline[0] + ' ' + kline[1]
    const time = Number(moment(stringTime, 'YYYY-MM-DD HH:mm:ss').format('X')) * 1000
    return {
      time: time,
      open: Number(kline[2]),
      close: Number(kline[5]),
      low: Number(kline[4]),
      high: Number(kline[3]),
      volume: Number(kline[6])
    }
  }

  /**
   * 初始化图表
   */
  public initTradingView() {
    if (!this.datafeed) {
      return
    }
    this.widget = new TradingView({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: 'BTC/USDT',
      interval: this.period,
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
  Status: number
  Data: T
}

type DataT = {
  List: Array<string>
}
