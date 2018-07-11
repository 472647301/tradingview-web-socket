<template>
  <div id="tv_chart_container">
  </div>
</template>

<script>
import {
  widget as TvWidget // 嫌路径长可以移入src里面 
} from '../../../static/charting_library-master/charting_library/charting_library.min'
import datafeeds from './datafeeds'

export default {
  data() {
    return {
      widget: null,
      datafeed: new datafeeds(this)
    }
  },
  mounted() {
    // const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    // const io = new BrowserWebSocket('wss://api.fcoin.com/v2/ws')
    // io.onmessage = evt => {
    //   console.log(evt.data)
    //   io.send(JSON.stringify({cmd: "req", args: ["candle.M1.ethusdt", 1441, 1531300389], id: "23b0d724-c20b-42f4-8fef-cc00224c1c0d"}))
    // }
    this.widget = new TvWidget({
      symbol: 'AA',
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
    })
  }
}
</script>
