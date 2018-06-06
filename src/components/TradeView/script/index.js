
import './chart'
import Io from './socket'
import Datafeeds from './datafeed'

export default {
  symbol: null,
  period: null,
  widget: null,
  dataFeed: null,
  init: function (options) {

    this.dataFeed = new Datafeeds(this)

    this.widget = new TradingView.widget({
      autosize: true,
      symbol: options.symbol,
      interval: options.interval,
      container_id: 'tv_chart_container',
      datafeed: this.dataFeed,
      library_path: '/static/charting_library/',
      drawings_access: {
        type: 'black',
        tools: [{ name: 'Regression Trend' }]
      },
      disabled_features: [],
      enabled_features: [],
      numeric_formatting: {
        decimal_sign: '.'
      },
      timezone: 'Asia/Shanghai',
      locale: 'zh',
      debug: true
    })

    this.symbol = options.symbol
    this.period = options.interval

    this.widget.onChartReady(() => {
      this.widget.chart().createStudy('MA Cross', false, false, [30, 120])
    })

  },

  getBars: function (symbol, resolution, from, to, callback) {

    // 更新数据
    const onUpdateData = list => {
      const data = list.data.kLine
      console.log(data)
      const nodata = data.s == 'no_data'
      const bars = []
      
      const barsCount = nodata ? 0 : data.t.length
      const volumePresent = typeof data.v !== undefined
      const ohlPresent = typeof data.o !== undefined

      for (let i = 0; i < barsCount; ++i) {
        const barValue = {
          time: data.t[i] * 1000,
          close: data.c[i],
        }

        if (ohlPresent) {
          barValue.open = data.o[i]
          barValue.high = data.h[i]
          barValue.low = data.l[i]
        } else {
          barValue.open = barValue.high = barValue.low = barValue.close
        }

        if (volumePresent) {
          barValue.volume = data.v[i]
        }
        bars.push(barValue)
      }
      
      callback({bars: bars, s: data.s, noData: nodata, nextTime: data.nb || data.nextTime})
    }

    const params = {
      period: resolution,
      symbol: symbol,
      type: 'kline',
      from: from,
      to: to
    }
    Io.subscribeKline(params, onUpdateData)

  },

  getConfig: function () {
    return {

    }
  },

  getServerTime: function () {
    return parseInt(Date.now() / 1000)
  },

  resolveTVSymbol(symbol) {
    return {
      'name': symbol,
      'exchange-traded': '',
      'exchange-listed': '',
      'timezone': 'Asia/Shanghai',
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': 1,
      'fractional': false,
      'session': '24x7',
      'has_intraday': true,
      'has_no_volume': false,
      'description': symbol,
      'pricescale': 1,
      'ticker': symbol,
      'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '1W', '1M']
    }
  },

  onUpdateData(data) {
    // console.log(data)
    const nodata = data.s == 'no_data'

    if (data.s != 'ok' && !nodata) {
      if (onErrorCallback) {
        onErrorCallback(data.s);
      }
      return;
    }

    const bars = [];
    //	data is JSON having format {s: "status" (ok, no_data, error),
    //  v: [volumes], t: [times], o: [opens], h: [highs], l: [lows], c:[closes], nb: "optional_unixtime_if_no_data"}
    const barsCount = nodata ? 0 : data.t.length;
    const volumePresent = typeof data.v !== 'undefined';
    const ohlPresent = typeof data.o !== 'undefined';

    for (let i = 0; i < barsCount; ++i) {
      const barValue = {
        time: data.t[i] * 1000,
        close: data.c[i],
      };

      if (ohlPresent) {
        barValue.open = data.o[i];
        barValue.high = data.h[i];
        barValue.low = data.l[i];
      } else {
        barValue.open = barValue.high = barValue.low = barValue.close;
      }

      if (volumePresent) {
        barValue.volume = data.v[i];
      }
      bars.push(barValue);
    }

    const meta = { version: that._protocolVersion, noData: true, nextTime: data.nb || data.nextTime };

    // console.log('getBars bars->', bars);
    // console.log('getBars meta->', meta);
    // 只会执行一次
    onDataCallback(bars, meta)
  }
}