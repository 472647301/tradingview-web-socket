// @ts-ignore

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://api.fcoin.pro/v2",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
