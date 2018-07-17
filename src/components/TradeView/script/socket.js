const Io = {
  ws: null,
  init: function () {
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    this.ws = new BrowserWebSocket('ws://localhost:3010')
  },
  subscribeKline: function (params, callback) {

    if (this.ws === null) {
      this.init()
    }

    if (this.ws.readyState) {
      this.ws.send(JSON.stringify(params))
    } else {
      this.ws.onopen = evt => {
        this.ws.send(JSON.stringify(params))
      }
    }
    this.ws.onmessage = e => {
      callback(JSON.parse(e.data))
    }

  }
}
export default Io