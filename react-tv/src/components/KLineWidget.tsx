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
type State = {
  interval: keyof typeof intervalMap;
};
export class KLineWidget extends React.Component<Props, State> {
  private _widget?: IChartingLibraryWidget;
  private datafeed = new DataFeed({
    getBars: (params) => this.getBars(params),
    fetchResolveSymbol: () => this.resolveSymbol(),
  });

  constructor(props: Props) {
    super(props);
    this.state = {
      interval: "M5",
    };
  }

  public resolveSymbol = () => {
    return new Promise<LibrarySymbolInfo>((resolve) => {
      const { symbol } = this.props;
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
    const { symbol } = this.props;
    const { interval } = this.state;
    console.log("--------", params);
    const res = await apiGet<Array<IApiCandles>>(
      "market_candles",
      `/${interval}/${symbol}`,
      {
        params: {
          before: params.to,
          limit: window.innerWidth || 1000,
        },
      }
    );
    if (
      params.resolution === intervalMap[interval] &&
      params.firstDataRequest &&
      res &&
      res.data.length
    ) {
      ws.subscribe(
        `candle.${interval}.${symbol}`,
        {
          cmd: "sub",
          args: [`candle.${interval}.${symbol}`],
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

  public initTradingView = () => {
    const { symbol } = this.props;
    const { interval } = this.state;
    this._widget = new widget({
      // debug: true,
      fullscreen: true,
      symbol: symbol.toLocaleUpperCase(),
      interval: intervalMap[interval],
      container_id: "tv_chart_container",
      datafeed: this.datafeed,
      // library_path: "http://49.233.210.12/TradingView/",
      library_path: "/TradingView/",
      locale: "zh",
      theme: "Dark",
      timezone: "Asia/Shanghai",
    });
    // this._widget.onChartReady(() => {
    //   if (!this._widget) {
    //     return;
    //   }
    //   const activeChart = this._widget.activeChart();
    //   const intervalChanged = activeChart.onIntervalChanged();
    //   intervalChanged.subscribe(null, (interval, timeframeObj) => {
    //     console.log("---subscribe----", interval, timeframeObj);
    //   });
    // });
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
