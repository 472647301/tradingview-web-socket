import axios from 'axios'

const req = axios.create({
  baseURL: 'https://api.huobi.pro',
  timeout: 20000,
  validateStatus: (status) => status >= 200 && status < 500,
})
// 攔截器
req.interceptors.response.use(
  (response) => {
    const { config, status } = response
    console.log(
      `[RESPONSE] ${config.url}:`,
      response.data ? response.data : response
    )
    if (status !== 200) return new Error(status)
    return response
  },
  (error) => {
    console.error('[RESPONSE]:', error?.config.url, error?.message)
    return error
  }
)
export default req
