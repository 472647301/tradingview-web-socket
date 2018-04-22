<template>
  <div id="tradv-view"></div>
</template>

<script>
import io from 'socket.io-client'
export default {
  data() {
    return {
      socket: null
    }
  },
  created() {
    this.socket = io('//localhost:3010')
    this.socket.emit('kline', {
      'symbol': 'AAPL',
      'resolution': 'D',
      'to': parseInt(Date.now() / 1000),
      'from': parseInt(Date.now() / 1000) - 31104060
    })
    this.socket.on('kline', res => {
      console.log(res)
    })
  }
}
</script>
