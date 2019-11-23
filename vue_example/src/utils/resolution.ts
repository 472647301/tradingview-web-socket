export const chartResolution: KeyStr = {
  '1': '1min',
  '5': '5min',
  '15': '15min',
  '30': '30min',
  '60': '60min',
  D: '1day',
  '1W': '1week',
  '1M': '1mon'
}
export const serverResolution: KeyStr = {
  '1min': '1',
  '5min': '5',
  '15min': '15',
  '30min': '30',
  '60min': '60',
  '1day': 'D',
  '1week': '1W',
  '1mon': '1M'
}

export interface KeyStr {
  [key: string]: string
}
