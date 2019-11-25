// @ts-ignore

const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/api', {
      target: 'https://www.tdex.com',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    })
  )
}