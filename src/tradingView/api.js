/**
 * TradingView JS API
 */
import io from 'socket.io-client'

class TvApi {
  /**
   * 初始化对象数据
   * @param {*Object 配置信息} config 
   */
  constructor(config) {
    this.socket = io('//localhost:3010')
    this.configurationData = config.defaultConfiguration
  }

  /**
   * 此方法旨在提供填充配置数据的对象。这些数据会影响图表的行为表现
   * @param {*Function(configurationData)} callback 
   */
  onReady(callback) {
    return new Promise((resolve, reject) =>{
      if (!this.configurationData.supports_search && !this.configurationData.supports_group_request) {
        throw new Error('Unsupported datafeed configuration. Must either support search, or support group request')
      }
      if (configurationData.supports_group_request || !configurationData.supports_search) {
        this._symbolsStorage = new SymbolsStorage(this._datafeedURL, configurationData.supported_resolutions || [], this._requester);
      }
      resolve(this.configurationData)
    })
    .then(data => callback(data))
  }

  /**
   * 提供一个匹配用户搜索的商品列表
   * @param {*String 用户在商品搜索框中输入的文字} userInput 
   * @param {*String 请求的交易所} exchange 
   * @param {*String 请求的商品类型：指数、股票、外汇等} symbolType 
   * @param {*Function(result)} onResultReadyCallback 
   */
  searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log(' >> searchSymbols')
  }

  /**
   * 通过商品名称解析商品信息
   * @param {*String 商品名称或ticker} symbolName 
   * @param {*Function(SymbolInfo)} onSymbolResolvedCallback 
   * @param {*Function(reason)} onResolveErrorCallback 
   */
  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {

  }

  /**
   * 
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Number 时间戳、最左边请求的K线时间} from 
   * @param {*Number 时间戳、最右边请求的K线时间} to 
   * @param {*Function(数组bars,meta={ noData = false })} onHistoryCallback 
   * @param {*Function(reason：错误原因)} onErrorCallback 
   * @param {*Boolean 以标识是否第一次调用此商品/分辨率的历史记录} firstDataRequest 
   */
  getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {

  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*String 分辨率} resolution 
   * @param {*Function(bar) bar: object{time, close, open, high, low, volume}} onRealtimeCallback 
   * @param {*Object} subscriberUID 
   * @param {*Function()将在bars数据发生变化时执行} onResetCacheNeededCallback 
   */
  subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {

  }

  /**
   * 取消订阅K线数据
   * @param {*Object} subscriberUID 
   */
  unsubscribeBars(subscriberUID) {

  }

  /**
   * 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度
   * @param {*String 请求商品的分辨率} resolution 
   * @param {*String 期望历史周期刻度。支持的值:D|M} resolutionBack 
   * @param {*Number 数量} intervalBack 
   */
  calculateHistoryDepth(resolution, resolutionBack, intervalBack) {

  }

  /**
   * 图书馆调用这个函数来获得可见的K线范围的标记
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*Number 时间戳、最左边请求的K线时间} startDate 
   * @param {*Number 时间戳、最右边请求的K线时间} endDate 
   * @param {*Function(标记数字marks)} onDataCallback 
   * @param {*String} resolution 
   */
  getMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {

  }

  /**
   * 图表库调用此函数获取可见K线范围的时间刻度标记
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*Number 时间戳、最左边请求的K线时间} startDate 
   * @param {*Number 时间戳、最右边请求的K线时间} endDate 
   * @param {*Function(array of marks)} onDataCallback 
   * @param {*String} resolution 
   */
  getTimescaleMarks(symbolInfo, startDate, endDate, onDataCallback, resolution) {

  }

  /**
   * 当图表需要知道服务器时间时则调用此函数
   * @param {*Function(unixTime)} callback 
   */
  getServerTime(callback) {

  }

  /**
   * 当图表需要报价数据时将调用此函数
   * @param {*Array 商品名称数组} symbols 
   * @param {*Function(array of data)} onDataCallback 
   * @param {*Function(reason)} onErrorCallback 
   */
  getQuotes(symbols, onDataCallback, onErrorCallback) {

  }

  /**
   * 交易终端当需要接收商品的实时报价时调用此功能
   * @param {*Array 很少更新的商品数组（建议频率为每分钟一次）} symbols 
   * @param {*Array 频繁更新的商品数组（一次在10秒或更快）} fastSymbols 
   * @param {*Function(array of data)} onRealtimeCallback 
   * @param {*Number 监听的唯一标识符} listenerGUID 
   */
  subscribeQuotes(symbols, fastSymbols, onRealtimeCallback, listenerGUID) {

  }

  /**
   * 交易终端当不需要再接收商品的实时报价时调用此函数
   * @param {*Number 监听的唯一标识符} listenerGUID 
   */
  unsubscribeQuotes(listenerGUID) {

  }

  /**
   * 交易终端当要接收商品的实时level 2 信息（DOM）时，调用此函数
   * @param {*Object 商品信息对象} symbolInfo 
   * @param {*Function(depth)} callback 
   */
  subscribeDepth(symbolInfo, callback) {

  }

  /**
   * 交易终端当不希望接收此监听时调用此函数
   * @param {*Number 监听的唯一标识符} listenerGUID 
   */
  unsubscribeDepth(subscriberUID) {

  }

  /**
   * 显示标准订单对话框以创建或修改订单，并执行处理程序
   * @param {*被放置或修改} order 
   * @param {*是一个处理买/卖/修改的功能} handler 
   * @param {*} focus 
   */
  showOrderDialog(order, handler, focus) {

  }

  /**
   * 显示一个确认对话框，并按下YES/OK，执行处理程序
   * @param {*待取消订单的编号} orderId 
   * @param {*处理取消的功能} handler 
   */
  showCancelOrderDialog(orderId, handler) {

  }

  /**
   * 显示一个确认对话框，并按下YES/OK，执行处理程序
   * @param {*取消订单商品} symbol 
   * @param {*取消订单方向} side 
   * @param {*取消订单数量} qty 
   * @param {*处理取消的功能} handler 
   */
  showCancelMultipleOrdersDialog(symbol, side, qty, handler) {

  }

  /**
   * 显示一个确认对话框，并按下YES/OK，执行处理程序
   * @param {*要平仓的头寸id} positionId 
   * @param {*处理平仓的功能} handler 
   */
  showClosePositionDialog(positionId, handler) {

  }

  /**
   * 显示默认的编辑括号对话框，并在按下修改时执行处理程序
   * @param {*} position 
   * @param {*} brackets 
   * @param {*} focus 
   * @param {*} handler 
   */
  showPositionBracketsDialog(position, brackets, focus, handler) {

  }

  /**
   * 打开底部面板和开关选项卡到交易
   */
  activateBottomWidget() {

  }

  /**
   * 显示属性对话框，切换当前标签到交易
   */
  showTradingProperties() {

  }

  /**
   * 显示通知。类型可以是 1 - 成功 或 0 - 错误
   * @param {*} title 
   * @param {*} text 
   * @param {*} type 
   */
  showNotification(title, text, type) {

  }

  /**
   * 触发器显示活动订单
   */
  triggerShowActiveOrders() {

  }

  /**
   * 以指定的小数位数返回一个[[Formatter|Trading-Objects-and-Constants#focusoptions]]
   * @param {*} decimalPlaces 
   */
  numericFormatter(decimalPlaces) {

  }

  /**
   * 返回指定仪器的默认值
   * @param {*} symbol 
   */
  defaultFormatter(symbol) {

  }

  /**
   * 在添加或更改订单时调用此方法
   * @param {*} order 
   */
  orderUpdate(order) {

  }

  /**
   * 当订单未更改时调用此方法
   * @param {*} order 
   */
  orderPartialUpdate(order) {

  }

  /**
   * 在添加或更改头寸时调用此方法
   * @param {*} position 
   */
  positionUpdate(position) {

  }

  /**
   * 当头寸未更改时调用此方法
   * @param {*} position 
   */
  positionPartialUpdate(position) {

  }

  /**
   * 添加执行时调用此方法
   * @param {*} execution 
   */
  executionUpdate(execution) {

  }

  /**
   * 当数据无效时调用此方法
   */
  fullUpdate() {

  }

  /**
   * 当代理商连接收到PL更新时调用此方法
   * @param {*} positionId 
   * @param {*} pl 
   */
  plUpdate(positionId, pl) {

  }

  /**
   * 当经纪商连接收到资产净值时调用此方法
   * @param {*} equity 
   */
  equityUpdate(equity) {

  }
}