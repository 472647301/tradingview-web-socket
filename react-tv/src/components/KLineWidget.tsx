import * as React from "react";
import { apiGet } from "../api";
import { DataFeed, widget, GetBarsParams } from "../datafeed/datafeed";
import {
  IChartingLibraryWidget,
  Bar,
  LibrarySymbolInfo,
} from "../datafeed/library.min";
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

type Props = {
  symbol: string;
};

type IntervalT = keyof typeof intervalMap;
export class KLineWidget extends React.Component<Props> {
  private symbol = this.props.symbol;
  private interval: IntervalT = "M5";
  private _widget?: IChartingLibraryWidget;
  private datafeed = new DataFeed({
    getBars: (params) => this.getBars(params),
    fetchResolveSymbol: () => this.resolveSymbol(),
  });

  public resolveSymbol = () => {
    return new Promise<LibrarySymbolInfo>((resolve) => {
      const symbol = this.symbol;
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
        has_intraday: true,
        supported_resolutions: ["1", "5", "15", "30", "60", "D", "1W", "1M"],
      });
    });
  };

  public getBars = async (params: GetBarsParams) => {
    const symbol = this.symbol;
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
  };

  public subscribeKLine = () => {
    const symbol = this.symbol;
    ws.subscribe(
      `candle.${this.interval}.${symbol}`,
      {
        cmd: "sub",
        args: [`candle.${this.interval}.${symbol}`],
        id: "react-tv",
      },
      (data: IApiCandles) => {
        this.datafeed.updateKLine({
          time: data.id * 1000,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
          volume: data.base_vol,
        });
      }
    );
  };

  public unsubscribeKLine = () => {
    const symbol = this.symbol;
    ws.unsubscribe(`candle.${this.interval}.${symbol}`);
  };

  public initTradingView = () => {
    const symbol = this.symbol;
    this._widget = new widget({
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
  };

  public setSymbol = (symbol: string) => {
    this.unsubscribeKLine();
    this.symbol = symbol;
    this._widget?.setSymbol(symbol, intervalMap[this.interval], () => {
      console.log("------setSymbol---------");
    });
  };

  public componentDidMount() {
    this.initTradingView();
  }

  public componentWillUnmount() {
    this._widget && this._widget.remove();
  }

  public render() {
    return (
      <div className="kline">
        <div id="tv_chart_container"></div>
      </div>
    );
  }
}
