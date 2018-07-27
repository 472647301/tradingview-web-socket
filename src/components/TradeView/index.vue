<template>
  <div id="trade-view">
  </div>
</template>

<script>
import { widget as TvWidget } from '../../../static/tradeview/charting_library/charting_library.min.js'
import socket from './datafeeds/socket.js'
import datafeeds from './datafeeds/datafees.js'
export default {
  data() {
    return {
      widget: null,
      socket: new socket(),
      datafeeds: new datafeeds(this),
      symbol: null,
      interval: null,
      cacheData: {},
      lastTime: null,
      getBarTimer: null,
      isLoading: true
    }
  },
  created() {
    this.socket.doOpen()
    this.socket.on('open', () => {
      this.socket.send({ cmd: 'req', args: [`candle.M5.btcusdt}`, 1440, parseInt(Date.now() / 1000)] })
    })
    this.socket.on('message', this.onMessage)
  },
  methods: {
    init(symbol = 'BTCUSDT', interval = 5) {
      if (!this.widget) {
        this.widget = new TvWidget({
          symbol: symbol,
          interval: interval,
          // fullscreen: true,
          container_id: 'trade-view',
          datafeed: this.datafeeds,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: ['header_symbol_search'],
          enabled_features: [],
          timezone: 'Asia/Shanghai',
          locale: 'zh',
          debug: false
        })
        this.symbol = symbol
        this.interval = interval
      }
    },
    unSubscribe(interval) {
      const params = {
        cmd: 'unsub',
        args: [`candle.M${interval}.${this.symbol.toLowerCase()}`]
      }
      this.socket.send(params)
      // if (this.socket.checkOpen()) {
      //   this.socket.send(params)
      // } else {
      //   this.socket.on('open', () => {
      //     this.socket.send(params)
      //   })
      // }
    },
    onMessage(data) {
      // console.log(data)
      if (data.data && data.data.length) {
        const list = []
        const ticker = `${this.symbol}-${this.interval}`
        const subTicker = `candle.M${this.interval}.${this.symbol.toLowerCase()}`
        data.data.forEach(function(element) {
          list.push({
            time: element.id * 1000,
            open: element.open,
            high: element.high,
            low: element.low,
            close: element.close,
            volume: element.quote_vol
          })
        }, this)
        this.cacheData[ticker] = list
        this.lastTime = list[list.length - 1].time
        this.socket.send({ cmd: 'sub', args: [subTicker] })
      }
      if (this.symbol && data.type === `candle.M${this.interval}.${this.symbol.toLowerCase()}`) {
        this.datafeeds.barsUpdater.updateData()
        const ticker = `${this.symbol}-${this.interval}`
        const barsData = {
          time: data.id * 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.quote_vol
        }
        if (barsData.time >= this.lastTime) {
          this.cacheData[ticker][this.cacheData[ticker].length - 1] = barsData
        }
      }
    },
    getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      // console.log(' >> :', rangeStartDate, rangeEndDate)
      if (this.interval !== resolution) {
        this.unSubscribe(this.interval)
        this.interval = resolution
        this.socket.send({ cmd: 'req', args: [`candle.M${this.interval}.${this.symbol.toLowerCase()}`, 1440, parseInt(Date.now() / 1000)] })
      }
      const ticker = `${this.symbol}-${this.interval}`
      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false
        const newBars = []
        this.cacheData[ticker].forEach(item => {
          if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
            newBars.push(item)
          }
        })
        onLoadedCallback(newBars)
      } else {
        const self = this
        this.getBarTimer = setTimeout(function() {
          self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 10)
      }
    }
  }
}
</script>

