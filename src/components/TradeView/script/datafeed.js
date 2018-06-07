/*
	This class implements interaction with UDF-compatible datafeed.
	See UDF protocol reference at
	https://github.com/tradingview/charting_library/wiki/UDF
*/
class Datafeeds {
  constructor(mgr, updateFrequency) {
    this._mgr = mgr
    this._configuration = undefined

    this._barsPulseUpdater = new DataPulseUpdater(this, updateFrequency || 10 * 1000)

    this._enableLogging = false
    this._initializationFinished = false
    this._callbacks = {}

    this._initialize()
  }
  /**
   * 默认配置
   */
  defaultConfiguration() {
    return {
      supports_search: false,
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
   * 获取服务端时间
   * @param {*Function 回调函数} callback 
   */
  getServerTime(callback) {
    if (this._configuration.supports_time) {
      const self = this
      setTimeout(function () {
        callback(self._mgr.getServerTime())
      }, 10)
    }
  }
  /**
   * 绑定事件
   * @param {*String 事件名} event 
   * @param {*Function 回调函数} callback 
   */
  on(event, callback) {
    if (!this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = []
    }

    this._callbacks[event].push(callback)
    return this
  }
  /**
   * 运行事件
   * @param {*String 事件名} event 
   * @param {*Undefined 参数} argument 
   */
  _fireEvent(event, argument) {
    if (this._callbacks.hasOwnProperty(event)) {
      const callbacksChain = this._callbacks[event]
      for (let i = 0; i < callbacksChain.length; ++i) {
        callbacksChain[i](argument)
      }

      this._callbacks[event] = []
    }
  }
  /**
   * 初始化结束
   */
  onInitialized() {
    this._initializationFinished = true
    this._fireEvent('initialized')
  }
  /**
   * 打印信息
   * @param {*String 信息} message 
   */
  _logMessage(message) {
    if (this._enableLogging) {
      console.log(new Date().toLocaleTimeString() + ' >> ' , message)
    }
  }
  /**
   * 初始化
   */
  _initialize() {
    const configurationData = this._mgr.getConfig()
    const defaultConfig = this.defaultConfiguration()
    if (configurationData) {
      const conf = Object.assign({}, defaultConfig, configurationData)
      this._setupWithConfiguration(conf)
    } else {
      this._setupWithConfiguration(defaultConfig)
    }
  }
  /**
   * 填充配置数据
   * @param {*Function 回调函数} callback 
   */
  onReady(callback) {
    const that = this
    if (this._configuration) {
      setTimeout(function () {
        callback(that._configuration)
      }, 0)
    } else {
      this.on('configuration_ready', function () {
        callback(that._configuration)
      })
    }
  }
  /**
   * 安装配置数据
   * @param {*Object 配置数据} configurationData 
   */
  _setupWithConfiguration(configurationData) {
    this._configuration = configurationData

    if (!configurationData.exchanges) {
      configurationData.exchanges = []
    }

    //	@obsolete; remove in 1.5
    const supportedResolutions = configurationData.supported_resolutions || configurationData.supportedResolutions
    configurationData.supported_resolutions = supportedResolutions

    //	@obsolete; remove in 1.5
    const symbolsTypes = configurationData.symbols_types || configurationData.symbolsTypes
    configurationData.symbols_types = symbolsTypes

    // if (!configurationData.supports_search && !configurationData.supports_group_request) {
    //   throw new Error('Unsupported datafeed configuration. Must either support search, or support group request')
    // }

    if (!configurationData.supports_group_request) {
      this.onInitialized()
    }

    this._fireEvent('configuration_ready')
    this._logMessage('Initialized with ' + JSON.stringify(configurationData))
  }
  /**
   * 通过商品名称解析商品信息
   * @param {*String 商品名称或ticker} symbolName 
   * @param {*Function(SymbolInfo)} onSymbolResolvedCallback 
   * @param {*Function(reason)} onResolveErrorCallback 
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const that = this

    if (!this._initializationFinished) {
      this.on('initialized', function () {
        that.resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback)
      })

      return
    }

    var resolveRequestStartTime = Date.now()
    that._logMessage('Resolve requested')

    function onResultReady(data) {
      let postProcessedData = data
      if (that.postProcessSymbolInfo) {
        postProcessedData = that.postProcessSymbolInfo(postProcessedData)
      }

      that._logMessage('Symbol resolved: ' + (Date.now() - resolveRequestStartTime))

      onSymbolResolvedCallback(postProcessedData)
    }

    if (!this._configuration.supports_group_request) {
      setTimeout(function () {
        const data = that._mgr.resolveTVSymbol(symbolName ? symbolName.toUpperCase() : '')
        if (data) {
          onResultReady(data)
        } else {
          that._logMessage('Error resolving symbol: ' + symbolName)
          onResolveErrorCallback('unknown_symbol')
        }
      }, 10)
    }
  }
  /**
   * 
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Number 时间戳、最左边请求的K线时间} rangeStartDate 
   * @param {*Number 时间戳、最右边请求的K线时间} rangeEndDate 
   * @param {*Function 回调函数} onDataCallback 
   * @param {*Function 回调函数} onErrorCallback 
   */
  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback) {
    if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
      throw new Error(['Got a JS time instead of Unix one.', rangeStartDate, rangeEndDate])
    }

    const onLoadedCallback = function (data) {
      
      if (data) {
        const nodata = data.s === 'no_data'

        if (data.s !== 'ok' && !nodata) {
          if (!!onErrorCallback) {
            onErrorCallback(data.s)
          }

          return
        }

        const bars = data.bars || []
        onDataCallback(bars, { noData: nodata, nextTime: data.nextTime })
      } else {
        console.warn(['getBars(): error'])

        if (!!onErrorCallback) {
          onErrorCallback(' error: ')
        }
      }
    }

    this._mgr.getBars(symbolInfo.ticker.toUpperCase(), resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
  }
  /**
   * 订阅K线数据
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Function 回调函数} onRealtimeCallback 
   * @param {*String 监听的唯一标识符} listenerGUID 
   * @param {*Function 回调函数} onResetCacheNeededCallback 
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback) {
    console.log("subscribeBars: " + symbolInfo + ", " + resolution + ", " + listenerGUID);
    this._barsPulseUpdater.subscribeDataListener(symbolInfo, resolution, onRealtimeCallback, listenerGUID, onResetCacheNeededCallback)
  }
  /**
   * 取消订阅K线数据
   * @param {*String 监听的唯一标识符} listenerGUID 
   */
  unsubscribeBars(listenerGUID) {
    this._barsPulseUpdater.unsubscribeDataListener(listenerGUID)
  }
}
/*
  This is a pulse updating components for ExternalDatafeed. 
  They emulates realtime updates with periodic requests.
*/
class DataPulseUpdater {
  constructor(datafeed, updateFrequency) {
    this._datafeed = datafeed
    this._datafeed._logMessage('DataPulseUpdater init ' + updateFrequency)

    this._subscribers = {}

    this._requestsPending = 0
    const that = this

    const update = function () {
      if (that._requestsPending > 0) {
        return
      }

      for (let listenerGUID in that._subscribers) {
        const subscriptionRecord = that._subscribers[listenerGUID]
        const resolution = subscriptionRecord.resolution

        const datesRangeRight = that._datafeed._mgr.getServerTime()

        //	BEWARE: please note we really need 2 bars, not the only last one
        //	see the explanation below. `10` is the `large enough` value to work around holidays
        const datesRangeLeft = datesRangeRight - that.periodLengthSeconds(resolution, 10)

        that._requestsPending++

        (function (_subscriptionRecord) {
          that._datafeed.getBars(_subscriptionRecord.symbolInfo, resolution, datesRangeLeft, datesRangeRight, function (bars) {
            that._requestsPending--

            //	means the subscription was cancelled while waiting for data
            if (!that._subscribers.hasOwnProperty(listenerGUID)) {
              return
            }

            if (bars.length === 0) {
              return
            }

            const lastBar = bars[bars.length - 1]
            if (!isNaN(_subscriptionRecord.lastBarTime) && lastBar.time < _subscriptionRecord.lastBarTime) {
              return
            }

            const subscribers = _subscriptionRecord.listeners

            //	BEWARE: this one isn't working when first update comes and this update makes a new bar. In this case
            //	_subscriptionRecord.lastBarTime = NaN
            const isNewBar = !isNaN(_subscriptionRecord.lastBarTime) && lastBar.time > _subscriptionRecord.lastBarTime

            //	Pulse updating may miss some trades data (ie, if pulse period = 10 secods and new bar is started 5 seconds later after the last update, the
            //	old bar's last 5 seconds trades will be lost). Thus, at fist we should broadcast old bar updates when it's ready.
            if (isNewBar) {
              if (bars.length < 2) {
                throw new Error('Not enough bars in history for proper pulse update. Need at least 2.')
              }

              const previousBar = bars[bars.length - 2]
              for (let i = 0; i < subscribers.length; ++i) {
                subscribers[i](previousBar)
              }
            }

            _subscriptionRecord.lastBarTime = lastBar.time

            for (let j = 0; j < subscribers.length; ++j) {
              subscribers[j](lastBar)
            }
          },

            //	on error
            function () {
              that._requestsPending--
            })
        })(subscriptionRecord)
      }
    }

    if (typeof updateFrequency != 'undefined' && updateFrequency > 0) {
      setInterval(update, updateFrequency)
    }
  }
  /**
   * 取消订阅数据
   * @param {*String 监听的唯一标识符} listenerGUID 
   */
  unsubscribeDataListener(listenerGUID) {
    this._datafeed._logMessage('Unsubscribing ' + listenerGUID)
    delete this._subscribers[listenerGUID]
  }
  /**
   * 订阅数据
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Object 回调数据} newDataCallback 
   * @param {*String 监听的唯一标识符} listenerGUID 
   */
  subscribeDataListener(symbolInfo, resolution, newDataCallback, listenerGUID) {
    this._datafeed._logMessage('Subscribing ' + listenerGUID)

    if (!this._subscribers.hasOwnProperty(listenerGUID)) {
      this._subscribers[listenerGUID] = {
        symbolInfo: symbolInfo,
        resolution: resolution,
        lastBarTime: NaN,
        listeners: []
      }
    }

    this._subscribers[listenerGUID].listeners.push(newDataCallback)
  }
  /**
   * 
   * @param {*String 分辨率} resolution 
   * @param {*Number 周期范围} requiredPeriodsCount 
   */
  periodLengthSeconds(resolution, requiredPeriodsCount) {
    let daysCount = 0

    if (resolution === 'D') {
      daysCount = requiredPeriodsCount
    } else if (resolution === 'M') {
      daysCount = 31 * requiredPeriodsCount
    } else if (resolution === 'W') {
      daysCount = 7 * requiredPeriodsCount
    } else {
      daysCount = requiredPeriodsCount * resolution / (24 * 60)
    }

    return daysCount * 24 * 60 * 60
  }
}

export default Datafeeds