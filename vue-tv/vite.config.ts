export default {
  proxy: {
    "/api": {
      target: "https://api.fcoin.pro/v2",
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api/, ""),
    },
  },
  base: "./",
};
