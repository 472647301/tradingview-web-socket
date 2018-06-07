
import './chart'
import Io from './socket'
import Datafeeds from './datafeed'

export default {
  widget: null,
  dataFeed: null,
  dataCache: {}, // 缓存数据
  getBarTimer: null,
  init: function (options) {

    this.dataFeed = new Datafeeds(this)

    this.widget = new TradingView.widget({
      autosize: true,
      symbol: options.symbol,
      interval: options.interval,
      container_id: 'tv_chart_container',
      datafeed: this.dataFeed,
      library_path: '/static/charting_library/',
      drawings_access: {
        type: 'black',
        tools: [{ name: 'Regression Trend' }]
      },
      disabled_features: [],
      enabled_features: [],
      numeric_formatting: {
        decimal_sign: '.'
      },
      timezone: 'Asia/Shanghai',
      locale: 'zh',
      debug: true
    })

    this.widget.onChartReady(() => {
      this.widget.chart().createStudy('MA Cross', false, false, [30, 120])
    })

  },

  getBars: function (symbol, resolution, from, to, callback) {

    let data
    const symbolData = this.dataCache[symbol]
    if (symbolData) {
      data = symbolData[resolution]
    }
    if (resolution === 'D') {
      resolution = '1D'
    }

    if (this.getBarTimer) {
      clearTimeout(this.getBarTimer)
    }
    const fromMs = from * 1000
    const toMs = to * 1000
    // 取缓存数据
    const fetchCacheData = data => {
      const newBars = []
      let count = 0
      data.forEach(function (element) {
        const barTime = element.time
        if (barTime >= fromMs && barTime <= toMs) {
          newBars.push(element)
          count++
        }
      }, this)

      if (count > 0) {
        newBars.sort((l, r) => l.time > r.time ? 1 : -1)
        callback && callback({ s: 'ok', bars: newBars })
      } else {
        callback && callback({ s: 'no_data' })
      }
      const params = {
        resolution: resolution,
        symbol: symbol,
        type: 'updata',
        from: from,
        to: to
      }
      Io.subscribeKline(params, this.onUpdateData.bind(this))
    }
    // 请求数据
    const requestData = list => {
      const params = {
        resolution: resolution,
        symbol: symbol,
        type: 'kline',
        from: from,
        to: to
      }
      Io.subscribeKline(params, this.onUpdateData.bind(this))
      this.getBarTimer = setTimeout(() => {
        this.getBars(symbol, resolution, from, to, callback)
      }, 300)
    }
    data ? fetchCacheData(data) : requestData()

  },

  getConfig: function () {
    return {

    }
  },

  getServerTime: function () {
    return parseInt(Date.now() / 1000)
  },

  resolveTVSymbol: function (symbol) {
    return {
      'name': 'AA',
      'exchange-traded': '',
      'exchange-listed': '',
      'timezone': 'Asia/Shanghai',
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': 1,
      'fractional': false,
      'session': '24x7',
      'has_intraday': true,
      'has_no_volume': false,
      'description': 'AA',
      'pricescale': 1,
      'ticker': 'AA',
      'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '2D', '3D', '1W', '1M']
    }
  },

  onUpdateData: function (data) {
    if (!data.kline) {
      return false
    }
    if (!this.dataCache[data.symbol]) {
      this.dataCache[data.symbol] = {}
    }
    if (!this.dataCache[data.symbol][data.resolution]) {
      this.dataCache[data.symbol][data.resolution] = []
    }
    if (data.kline.length) {
      data.kline.forEach(elm => {
        this.dataCache[data.symbol][data.resolution].push(elm)
      })
    }
  }
}