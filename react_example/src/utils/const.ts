export const PERIOD_SERVER: KeyStr = {
  '1MIN': '1',
  '3MIN': '3',
  '5MIN': '5',
  '15MIN': '15',
  '30MIN': '30',
  '1HOUR': '60',
  '2HOUR': '120',
  '3HOUR': '180',
  '4HOUR': '240',
  '6HOUR': '360',
  '12HOUR': '720',
  '1DAY': 'D',
  '3DAY': '3D',
  '1WEEK': '1W',
  '2WEEK': '2W'
}

export const PERIOD_CLINENT: KeyStr = {
  '1': '1MIN',
  '3': '3MIN',
  '5': '5MIN',
  '15': '15MIN',
  '30': '30MIN',
  '60': '1HOUR',
  '120': '2HOUR',
  '180': '3HOUR',
  '240': '4HOUR',
  '360': '6HOUR',
  '720': '12HOUR',
  'D': '1DAY',
  '1D': '1DAY',
  '3D': '3DAY',
  '1W': '1WEEK',
  '2W': '2WEEK'
}

export const PERIODS = ['1',
  '3',
  '5',
  '15',
  '30',
  '60',
  '120',
  '180',
  '240',
  '360',
  '720',
  '1D',
  '3D',
  '1W',
  '2W'
]

interface KeyStr {
  [key: string]: string
}