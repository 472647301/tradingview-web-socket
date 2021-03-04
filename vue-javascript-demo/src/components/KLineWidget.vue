<template>
  <div className="kline">
    <div id="tv_chart_container"></div>
  </div>
</template>

<script>
import { apiGet } from "../api";
import { DataFeed, widget as TvWidget } from "tradingview-api";
import { ws } from "../utils/socket";

const supported_resolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "240",
  "D",
  "W",
  "M",
];
/**
 * @key Server 端定义字段
 * @value value 对应 supported_resolutions
 */
// 1min, 5min, 15min, 30min, 60min, 4hour, 1day, 1mon, 1week, 1year
const intervalMap = {
  "1min": "1",
  "5min": "5",
  "15min": "15",
  "30min": "30",
  "60min": "60",
  "4hour": "240",
  "1day": "D",
  "1week": "W",
  "1mon": "M",
};
export default {
  name: "KLineWidget",
  props: {
    symbolInfo: Object,
  },
  data() {
    return {
      symbol: this.symbolInfo.symbol,
      interval: "5min",
      widget: null,
      datafeed: new DataFeed({
        getBars: (params) => this.getBars(params),
        fetchResolveSymbol: () => this.resolveSymbol(),
        fetchConfiguration: () => {
          return new Promise((resolve) => {
            resolve({
              supported_resolutions: supported_resolutions,
            });
          });
        },
      }),
    };
  },
  methods: {
    resolveSymbol() {
      return new Promise((resolve) => {
        const symbol = this.symbol;
        const info = this.symbolInfo;
        resolve({
          name: symbol.toLocaleUpperCase(),
          full_name: symbol.toLocaleUpperCase(),
          description: symbol.toLocaleUpperCase(),
          type: symbol,
          session: "24x7",
          exchange: "HuoBi",
          listed_exchange: symbol,
          timezone: "Asia/Shanghai",
          format: "price",
          pricescale: Math.pow(10, info["price-precision"]),
          minmov: 1,
          volume_precision: info["value-precision"],
          has_intraday: true,
          supported_resolutions: supported_resolutions,
        });
      });
    },
    async getBars(params) {
      const symbol = this.symbol;
      const size = window.innerWidth;
      if (!params.firstDataRequest /**是否第一次请求历史数据 */) {
        // 火币接口暂时不支持分段查询历史数据
        return {
          bars: [],
          meta: {
            noData: true,
          },
        };
      }
      if (params.resolution !== intervalMap[this.interval]) {
        this.unsubscribeKLine();
        for (let key in intervalMap) {
          if (intervalMap[key] === params.resolution) {
            this.interval = key;
          }
        }
      }
      const res = await apiGet("history_kline", void 0, {
        params: {
          symbol: symbol,
          period: this.interval,
          size: size > 2000 ? 2000 : size,
        },
      });
      if (
        params.resolution === intervalMap[this.interval] &&
        params.firstDataRequest &&
        res &&
        res.data.length
      ) {
        this.subscribeKLine();
      }

      if (!res || !res.data || !res.data.length) {
        return {
          bars: [],
          meta: { noData: true },
        };
      }
      const list = [];
      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        list.push({
          time: item.id * 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.vol,
        });
      }
      list.sort((l, r) => (l.time > r.time ? 1 : -1));
      return {
        bars: list,
        meta: {
          noData: !list.length,
        },
      };
    },
    subscribeKLine() {
      const symbol = this.symbol;
      ws.subscribe(
        `market.${symbol}.kline.${this.interval}`,
        {
          id: "react-tv",
          sub: `market.${symbol}.kline.${this.interval}`,
        },
        (data) => {
          const tick = data.tick;
          this.datafeed.updateKLine({
            time: tick.id * 1000,
            open: tick.open,
            high: tick.high,
            low: tick.low,
            close: tick.close,
            volume: tick.vol,
          });
        }
      );
    },
    unsubscribeKLine() {
      const symbol = this.symbol;
      ws.unsubscribe(`market.${symbol}.kline.${this.interval}`);
    },
    initTradingView() {
      const symbol = this.symbol;
      this.widget = new TvWidget({
        // debug: true,
        fullscreen: true,
        symbol: symbol.toLocaleUpperCase(),
        interval: intervalMap[this.interval],
        container_id: "tv_chart_container",
        datafeed: this.datafeed,
        library_path: "/charting_library/",
        locale: "zh",
        theme: "Dark",
        timezone: "Asia/Shanghai",
      });
    },
    setSymbol(symbol) {
      this.unsubscribeKLine();
      this.symbol = symbol;
      this.widget?.setSymbol(symbol, intervalMap[this.interval], () => {
        console.log("------setSymbol---------", this.symbol);
      });
    },
  },
  mounted() {
    this.initTradingView();
  },
};
</script>