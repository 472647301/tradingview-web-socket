module.exports = {
  devServer: {
    open: true,
    proxy: {
      "/v1": {
        target: "https://wapi.bituan.cc"
      }
    }
  }
};
