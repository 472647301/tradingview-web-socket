class datafeeds {

  constructor(self) {
    this.core = self
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    this.socket = new BrowserWebSocket(this.core.url || 'wss://api.fcoin.com/v2/ws')
  }

  /**
   * @param {*Function} callback  回调函数
   * `onReady` should return result asynchronously.
   */
  onReady(callback) {
    return new Promise((resolve, reject) => {

      let configuration = this.defaultConfiguration()
      if (this.core.getConfig) {
        configuration = Object.assign({}, this.defaultConfiguration(), this.core.getConfig())
      }
      resolve(configuration)

    }).then(data => callback(data)).catch(err => console.log(err))

  }

  /**
   * @param {*String} symbolName  商品名称或ticker
   * @param {*Function} onSymbolResolvedCallback 成功回调 
   * @param {*Function} onResolveErrorCallback   失败回调
   * `resolveSymbol` should return result asynchronously.
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

    return new Promise((resolve, reject) => {

      let symbolInfo = this.defaultSymbol()
      if (this.core.getSymbol) {
        symbolInfo = Object.assign({}, this.defaultSymbol(), this.core.getSymbol())
      }
      resolve(symbolInfo)

    }).then(data => onSymbolResolvedCallback(data)).catch(err => onResolveErrorCallback(err))
  }

  /**
   * @param {*Object} symbolInfo  商品信息对象
   * @param {*String} resolution  分辨率
   * @param {*Number} rangeStartDate  时间戳、最左边请求的K线时间
   * @param {*Number} rangeEndDate  时间戳、最右边请求的K线时间
   * @param {*Function} onDataCallback  回调函数
   * @param {*Function} onErrorCallback  回调函数
   */
  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    console.log(symbolInfo, resolution, rangeStartDate, rangeEndDate)
  }

  /**
   * @param {*Object} params 请求参数
   */
  subscribeKline(params) {

    if (!this.socket.readyState) {
      this.socket.onopen(event => {
        this.socket.send(JSON.stringify(params))
      })
    }

    this.socket.send(JSON.stringify(params))

    this.socket.onmessage = event => {
      this.onUpdateData(JSON.parse(event.data))
    }
  }

  /**
   * @param {*Object} data 服务端返回数据
   */
  onUpdateData(data) {
    
  }

  /**
   * 默认配置
   */
  defaultConfiguration() {
    return {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '2D', '3D', '1W', '1M'],
      supports_marks: true,
      supports_timescale_marks: true,
      supports_time: true,
      exchanges: [{
        value: '',
        name: 'All Exchanges',
        desc: ''
      }],
      symbols_types: [{
        name: 'All types',
        value: ''
      }]
    }
  }

  /**
   * 默认商品信息
   */
  defaultSymbol() {
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
  }

}

export default datafeeds