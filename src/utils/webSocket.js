export default {
  timer: null,
  socket: null,
  init: function (url) {
    
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    this.socket = new BrowserWebSocket(url)
    this.binaryType = 'arraybuffer'
    
    this.timer = setInterval(() => {
      this.socket.send(JSON.stringify({ 'cmd': 'ping', 'args': [Date.parse(new Date())] }))
    }, 20000)

  }
}