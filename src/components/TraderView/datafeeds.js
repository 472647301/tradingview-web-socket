class datafeeds {

  constructor(vue) {
    this.self = vue  // vue实例
    this.subscribers = {}
    this.requestsPending = 0
  }

  /**
   * @param {*Function} callback  回调函数
   * `onReady` should return result asynchronously.
   */
  onReady(callback) {
    return new Promise((resolve, reject) => {

      let configuration = this.defaultConfiguration()
      if (this.self.getConfig) {
        configuration = Object.assign(this.defaultConfiguration(), this.self.getConfig())
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
      if (this.self.getSymbol) {
        symbolInfo = Object.assign(this.defaultSymbol(), this.self.getSymbol())
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
    return new Promise((resolve, reject) => {
      this.self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate).then(result => {
        onDataCallback(result.bars, result.meta)
        resolve(result)
      })
    })
  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object} symbolInfo 商品信息
   * @param {*String} resolution 分辨率
   * @param {*Function} onRealtimeCallback 回调函数 
   * @param {*String} subscriberUID 监听的唯一标识符
   * @param {*Function} onResetCacheNeededCallback (从1.7开始): onResetCacheNeededCallback将在bars数据发生变化时执行
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
    console.log(subscriberUID)
    this.subscribers[subscriberUID] = {
      lastBarTime: null,
      listener: onRealtimeCallback,
      resolution: resolution,
      symbolInfo: symbolInfo,
    }
  }

  /**
   * 取消订阅K线数据
   * @param {*String} subscriberUID 监听的唯一标识符
   */
  unsubscribeBars(subscriberUID) {
    delete this.subscribers[subscriberUID]
  }

  /**
   * 
   */
  onUpdateData() {
    if (this.requestsPending > 0) return
    this.requestsPending = 0
    const loop = uid => {
      this.requestsPending += 1
      this.updateDataForSubscriber(uid).then(() => this.requestsPending -= 1).catch(() => this.requestsPending -= 1)
    }
    for (let uid in this.subscribers) {
      loop(uid)
    }
  }

  /**
   * 
   * @param {*String} subscriberUID 监听的唯一标识符
   */
  updateDataForSubscriber(subscriberUID) {
    const subscriptionRecord = this.subscribers[subscriberUID]
    const rangeEndTime = parseInt((Date.now() / 1000).toString())
    const rangeStartTime = rangeEndTime - periodLengthSeconds(subscriptionRecord.resolution, 10)
    return this.getBars(subscriptionRecord.symbolInfo, subscriptionRecord.resolution, rangeStartTime, rangeEndTime).then(result => {
      this.onSubscriberDataReceived(subscriberUID, result)
    })
  }

  onSubscriberDataReceived() {
    
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
      'name': 'BTCUSDT',
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
      'description': 'BTCUSDT',
      'pricescale': 1,
      'ticker': 'BTCUSDT',
      'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '2D', '3D', '1W', '1M']
    }
  }

}

export default datafeeds

function periodLengthSeconds(resolution, requiredPeriodsCount) {
  let daysCount = 0
  if (resolution === 'D' || resolution === '1D') {
    daysCount = requiredPeriodsCount
  } else if (resolution === 'M' || resolution === '1M') {
    daysCount = 31 * requiredPeriodsCount
  } else if (resolution === 'W' || resolution === '1W') {
    daysCount = 7 * requiredPeriodsCount
  } else {
    daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60)
  }
  return daysCount * 24 * 60 * 60
}
