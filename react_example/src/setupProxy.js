// @ts-ignore

const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    proxy('/v1', {
      target: 'https://wapi.bituan.cc',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // }
    })
  )
}