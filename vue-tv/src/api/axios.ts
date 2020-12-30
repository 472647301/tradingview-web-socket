import axios from "axios";

export const https = axios.create({
  timeout: 100000,
});

// 添加自定义实例请求拦截器
https.interceptors.request.use(
  async (config) => {
    const url = `${config.baseURL || ""}${config.url}`;
    console.log(` >> [REQUEST] ${url}: ${JSON.stringify(config.data)}`);
    return config;
  },
  async (error) => {
    const { code, message } = error;
    console.log(` >> [REQUEST] error [${code}]: ${message}`);
    return error;
  }
);

// 添加自定义实例响应拦截器
https.interceptors.response.use(
  async (response) => {
    const { config } = response;
    console.log(
      ` >> [RESPONSE] ${config.url}:`,
      response.data ? response.data : response
    );
    return response;
  },
  async (error) => {
    console.log(` >> [RESPONSE]:`, error?.config.url, error?.message);
    return error;
  }
);
