const Io = {
  ws: null,
  connState: false,
  isOpen: function () {
    return this.connState
  },
  init: function() {
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    this.ws = new BrowserWebSocket('ws://118.190.201.181:3009')
  },
  subscribeKline: function(params, callback) {
    if (this.ws === null) {
      this.init()
    }
    const data = Object.assign({}, params, {baseCurrencyId: 1,targetCurrencyId: 2, })
    this.ws.onopen = evt => {
      this.ws.send(JSON.stringify(data))
    }
    
    this.ws.onmessage = e => {
      callback(JSON.parse(e.data))
    }
  }
}
export default Io