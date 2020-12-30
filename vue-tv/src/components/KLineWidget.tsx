import { defineComponent } from "vue";
import { apiGet } from "../api";
// import { DataFeed, widget, GetBarsParams } from "../datafeed/datafeed";
import { DataFeed, widget, GetBarsParams } from "tradingview-api";
import {
  IChartingLibraryWidget,
  Bar,
  LibrarySymbolInfo,
} from "tradingview-api/lib/library.min";
import { ws } from "../utils/socket";

/**
 * @key Server 端定义字段
 * @value value 对应 DataFeed.configuration.supported_resolutions
 */
const intervalMap = {
  M1: "1",
  M5: "5",
  M15: "15",
  M30: "30",
  H1: "60",
  D1: "1D",
  W1: "1W",
  MN: "1M",
};

type IntervalT = keyof typeof intervalMap;
type DateT = {
  coin: string;
  interval: IntervalT;
  datafeed?: DataFeed;
  _widget?: IChartingLibraryWidget;
};
export default defineComponent({
  name: "KLineWidget",
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  data(): DateT {
    return {
      coin: this.$props.symbol,
      interval: "M5",
      datafeed: void 0,
      _widget: void 0,
    };
  },
  methods: {
    resolveSymbol() {
      return new Promise<LibrarySymbolInfo>((resolve) => {
        const symbol = this.coin;
        resolve({
          name: symbol.toLocaleUpperCase(),
          full_name: symbol.toLocaleUpperCase(),
          description: symbol.toLocaleUpperCase(),
          type: symbol,
          session: "24x7",
          exchange: "BTB",
          listed_exchange: symbol,
          timezone: "Asia/Shanghai",
          format: "price",
          pricescale: Math.pow(10, 2),
          minmov: 1,
          volume_precision: 10,
          has_intraday: true,
          supported_resolutions: ["1", "5", "15", "30", "60", "D", "1W", "1M"],
        });
      });
    },
    async getBars(params: GetBarsParams) {
      const symbol = this.coin;
      if (params.resolution !== intervalMap[this.interval]) {
        this.unsubscribeKLine();
        for (let key in intervalMap) {
          if (intervalMap[key as IntervalT] === params.resolution) {
            this.interval = key as IntervalT;
          }
        }
      }
      const res = await apiGet<Array<IApiCandles>>(
        "market_candles",
        `/${this.interval}/${symbol}`,
        {
          params: {
            before: params.to,
            limit: window.innerWidth || 1000,
          },
        }
      );
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
      const list: Bar[] = [];
      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        list.push({
          time: item.id * 1000,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.base_vol,
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
      const symbol = this.coin;
      ws.subscribe(
        `candle.${this.interval}.${symbol}`,
        {
          cmd: "sub",
          args: [`candle.${this.interval}.${symbol}`],
          id: "react-tv",
        },
        (data: IApiCandles) => {
          this.datafeed?.updateKLine({
            time: data.id * 1000,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.base_vol,
          });
        }
      );
    },
    unsubscribeKLine() {
      const symbol = this.coin;
      ws.unsubscribe(`candle.${this.interval}.${symbol}`);
    },
    initTradingView() {
      if (!this.datafeed) {
        return;
      }
      const symbol = this.coin;
      this._widget = new widget({
        // debug: true,
        fullscreen: true,
        symbol: symbol.toLocaleUpperCase(),
        interval: intervalMap[this.interval],
        container_id: "tv_chart_container",
        datafeed: this.datafeed,
        library_path: process.env.NODE_ENV !== "development" ? "/vite/charting_library/" : "/charting_library/",
        locale: "zh",
        theme: "Dark",
        timezone: "Asia/Shanghai",
      });
    },
    setSymbol(symbol: string) {
      this.unsubscribeKLine();
      this.coin = symbol;
      this._widget?.setSymbol(symbol, intervalMap[this.interval], () => {
        console.log("------setSymbol---------");
      });
    },
  },
  created() {
    this.datafeed = new DataFeed({
      getBars: (params) => this.getBars(params),
      fetchResolveSymbol: () => this.resolveSymbol(),
    });
    ws.evt.on("onChangeSymbol", (name) => {
      this.setSymbol(name);
    });
  },
  mounted() {
    this.initTradingView();
  },
  setup() {
    return () => (
      <div class="kline">
        <div id="tv_chart_container"></div>
      </div>
    );
  },
});
