// @ts-ignore

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "https://api.huobi.pro",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
