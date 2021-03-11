/**
 * @key Server 端定義字段
 * @value value 對應 supported_resolutions
 */
// 1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1mon, 1week, 1year
export const intervalMap = {
  '1min': '1',
  '5min': '5',
  '15min': '15',
  '30min': '30',
  '60min': '60',
  '4hour': '240',
  '1day': 'D',
  '1week': 'W',
  '1mon': 'M',
}
/** trading-view 的時間區間 */
export const supported_resolutions = [
  '1',
  '5',
  '15',
  '30',
  '60',
  '240',
  'D',
  'W',
  'M',
]
