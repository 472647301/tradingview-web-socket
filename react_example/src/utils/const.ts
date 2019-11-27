export const PERIOD: KeyStr = {
  '1': 'MIN_1',
  '5': 'MIN_5',
  '15': 'MIN_15',
  '30': 'MIN_30',
  '60': 'HOUR_1',
  D: 'DAY_1',
  W: 'WEEK_1',
  M: 'MONTH_1',

  MIN_1: '1',
  MIN_5: '5',
  MIN_15: '15',
  MIN_30: '30',
  HOUR_1: '60',
  DAY_1: 'D',
  WEEK_1: 'W',
  MONTH_1: 'M'
}

interface KeyStr {
  [key: string]: string
}