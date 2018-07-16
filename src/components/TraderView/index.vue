<template>
  <div id="tv_chart_container">
  </div>
</template>

<script>
import {
  widget as TvWidget // 嫌路径长可以移入src里面 
} from '../../../static/charting_library-master/charting_library/charting_library.min'
import datafeeds from './datafeeds'
import ws from '@/utils/webSocket'

export default {
  props: {
    url: {
      type: String,
      default: 'wss://api.fcoin.com/v2/ws'
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      widget: null,
      config: null,
      socket: null,
      cacheData: {},
      currentTicker: null,
      datafeed: new datafeeds(this)
    }
  },
  created() {
    if (!this.socket || !this.$store.state.socketState) {
      ws.init(this.url)
      this.socket = ws.socket
    }

    this.socket.onopen = event => {
      console.log(' >> webSocket 连接成功')
      this.$store.commit('changeSocketState', 1)
    }

    this.socket.onclose = event => {
      console.log(' >> webSocket 连接关闭')
      this.$store.commit('changeSocketState', 0)
    }

    this.socket.onerror = event => {
      console.log(' >> webSocket 连接异常：', event)
    }

  },
  methods: {
    // 初始化
    init() {
      const defaultOptions = {
        symbol: 'BTCUSDT',
        interval: 5,
        container_id: 'tv_chart_container',
        datafeed: this.datafeed,
        library_path: '/static/charting_library-master/charting_library/',
        drawings_access: {
          type: 'black',
          tools: [{ name: 'Regression Trend' }]
        },
        disabled_features: ['header_symbol_search'],
        enabled_features: [],
        numeric_formatting: {
          decimal_sign: '.'
        },
        timezone: 'Asia/Shanghai',
        locale: 'zh',
        debug: false
      }
      this.config = Object.assign(defaultOptions, this.options)
      this.widget = new TvWidget(this.config)
    },
    // 返回数据给图表
    getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate) {
      const currentTicker = symbolInfo.ticker.toUpperCase() + '_' + resolution
      // 取消订阅
      if (currentTicker !== this.currentTicker && this.currentTicker) {
        const period = this.currentTicker.split('_')
        this.sendData({ cmd: 'unsub', args: [`candle.M${period[1]}.${period[0].toLowerCase()}`] })
      }
      this.currentTicker = currentTicker
      // 获取历史数据
      this.sendData({ cmd: 'req', args: [`candle.M${resolution}.${symbolInfo.ticker.toLowerCase()}`, 1441, rangeEndDate] })
      // 订阅当前周期K线数据
      return this.sendData({ cmd: 'sub', args: [`candle.M${resolution}.${symbolInfo.ticker.toLowerCase()}`] }).then(data => data)
    },
    // 发送数据给服务端
    sendData(params) {
      return new Promise((resolve, reject) => {
        if (this.$store.state.socketState) {
          this.socket.send(JSON.stringify(params))
        } else {
          this.socket.onopen = event => {
            this.$store.commit('changeSocketState', 1)
            this.socket.send(JSON.stringify(params))
          }
        }
        this.socket.onmessage = event => {
          // console.log(' >> webSocket 返回数据：', JSON.parse(event.data))
          const data = JSON.parse(event.data)
          if (!data || !data.data) return
          if (!this.cacheData[this.currentTicker]) {
            data.data.map(val => val.time = val.id * 1000)
            this.cacheData[this.currentTicker] = data.data
          }
          resolve({ bars: this.cacheData[this.currentTicker], meta: { noData: true } })
        }
      })
    },
    // 处理服务端返回数据
    onUpdateData(data) {
      if (!data || !data.data) return
      if (!this.cacheData[this.currentTicker]) {
        data.data.map(val => val.time = val.id * 1000)
        this.cacheData[this.currentTicker] = data.data
      }
    }
  }
}
</script>
