import axios from '@/plugins/axios'
import qs from '@/plugins/qs'

/** 取得幣種 */
export const getSymbols = async () => {
  const { data } = await axios.get('/v1/common/symbols')
  if (!data.data) return new Error('empty data')
  const symbolList = []
  data.data.forEach((item) => {
    if (item['quote-currency'] === 'usdt') {
      symbolList.push({
        ...item,
        pair:
          item['base-currency'].toLocaleUpperCase() +
          '/' +
          item['quote-currency'].toLocaleUpperCase(),
      })
    }
  })
  const symbolData = symbolList.length ? symbolList[0].symbol : ''
  return [symbolList, symbolData]
}
/** 取得kline歷史紀錄 */
export const getKlineHistory = async (obj) => {
  const { data } = await axios.get(`/market/history/kline?${qs.stringify(obj)}`)
  if (data.status !== 'ok' && !data.data.length) return [null]
  const list = data.data
    .map((item) => {
      return {
        time: item.id * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.vol,
      }
    })
    .sort((a, b) => (a.time > b.time ? 1 : -1))
  return [list]
}
