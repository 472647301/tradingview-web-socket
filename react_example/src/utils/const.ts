export const PERIOD: KeyStr = {
  '1': 'MIN_1',
  '5': 'MIN_5',
  '15': 'MIN_15',
  '30': 'MIN_30',
  '60': 'HOUR_1',
  '1440': 'DAY_1',
  '10080': 'WEEK_1',
  '302400': 'MONTH_1',

  MIN_1: '1',
  MIN_5: '5',
  MIN_15: '15',
  MIN_30: '30',
  HOUR_1: '60',
  DAY_1: '1400',
  WEEK_1: '10080',
  MONTH_1: '302400'
}

interface KeyStr {
  [key: string]: string
}