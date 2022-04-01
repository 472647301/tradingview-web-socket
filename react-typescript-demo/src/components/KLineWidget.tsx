import * as React from "react";
import { apiGet } from "../api";
import { ws } from "../utils/socket";
import { LibrarySymbolInfo } from "../datafeed/charting_library";
import { DatafeedConfiguration } from "../datafeed/charting_library";
import {
  IChartingLibraryWidget,
  Bar,
  EntityId,
} from "../datafeed/charting_library";
import { DataFeed, GetBarsParams } from "../datafeed";

import BB from "../studys/BB";
import EMA from "../studys/EMA";
import MACD from "../studys/MACD";
import SuperTrend from "../studys/SuperTrend";

const INTERVAL = {
  "1": { server: "1min", name: "1m" },
  "5": { server: "5min", name: "5m" },
  // "15": { server: "15min", name: "15m" },
  "30": { server: "30min", name: "30m" },
  "60": { server: "60min", name: "1h" },
  "240": { server: "4hour", name: "4h" },
  "1440": { server: "1day", name: "1D" },
  "10080": { server: "1week", name: "1W" },
  "302400": { server: "1mon", name: "1M" },
};

// 切换到tv的iframe可通过 window.JSServer.studyLibrary 查看tv所有内置指标详情

/**
 * 默认展示指标 Array<[指标名称, [指标入参]]>
 */
const defaultStudy: Array<[string, Array<number | string>]> = [
  ["SuperTrend", [10, 3]],
  ["Bollinger Bands", [20, 2]],
  ["SuperTrend", [10, 1]],
  ["MACD", [12, 26, "close", 9]],
  ["EMA Cross", [9, 26]],
];

type KeyT = keyof typeof INTERVAL;
type Props = {
  symbol: IApiSymbols;
};
type State = {};
export class KLineWidget extends React.Component<Partial<Props>, State> {
  private interval: KeyT = "5";
  private widget?: IChartingLibraryWidget;
  private datafeed: DataFeed;
  private buttons: Array<HTMLElement> = [];
  private height: number;
  private ids: EntityId[] = [];

  constructor(props: Partial<Props>) {
    super(props);
    this.state = {};
    this.datafeed = new DataFeed({
      getBars: this.fetchKLineData,
      fetchResolveSymbol: this.fetchResolveSymbol,
      fetchConfiguration: this.fetchConfiguration,
    });
    this.height = window.innerHeight - (this.isMobile() ? 88 : 48);
  }

  public isMobile = () => {
    const reg = new RegExp("(iPhone|iPad|iPod|iOS|Android)", "i");
    return reg.test(navigator.userAgent);
  };

  public fetchResolveSymbol = (
    symbolName: string
  ): Promise<LibrarySymbolInfo> => {
    return new Promise((resolve) => {
      const symbol = this.props.symbol!;
      const display_name = `${symbol[
        "base-currency"
      ].toLocaleUpperCase()}/${symbol["quote-currency"].toLocaleUpperCase()}`;
      resolve({
        name: display_name,
        full_name: display_name,
        description: symbolName,
        type: "stock",
        session: "24x7",
        exchange: "",
        listed_exchange: "",
        timezone: "Asia/Shanghai",
        format: "price",
        pricescale: Math.pow(10, symbol["price-precision"]),
        minmov: 1,
        volume_precision: symbol["value-precision"],
        has_intraday: true,
        supported_resolutions: Object.keys(INTERVAL) as any,
        has_weekly_and_monthly: true,
        has_daily: true,
      });
    });
  };

  public fetchConfiguration = () => {
    return new Promise<DatafeedConfiguration>((resolve) => {
      resolve({
        supported_resolutions: Object.keys(INTERVAL) as any,
      });
    });
  };

  public fetchKLineData = async (params: GetBarsParams) => {
    const bars: Bar[] = [];
    const size = window.innerWidth;
    if (!params.firstDataRequest) {
      // 火币接口暂时不支持分段查询历史数据
      return { bars, meta: { noData: true } };
    }
    if (params.resolution !== this.interval) {
      this.unsubscribeKLine();
      this.interval = params.resolution as KeyT;
    }
    const res = await apiGet<Array<IApiKLine>>("history_kline", void 0, {
      params: {
        symbol: this.props.symbol?.symbol,
        period: INTERVAL[this.interval].server,
        size: size > 2000 ? 2000 : size,
      },
    });
    if (!res || !res.data || !res.data.length) {
      return { bars, meta: { noData: true } };
    }
    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];
      bars.push({
        time: item.id * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.vol,
      });
    }
    bars.sort((l, r) => (l.time > r.time ? 1 : -1));
    if (params.firstDataRequest) {
      this.subscribeKLine();
    }
    return { bars, meta: { noData: true } };
  };

  public subscribeKLine = () => {
    const symbol = this.props.symbol?.symbol;
    const interval = INTERVAL[this.interval].server;
    const sub = `market.${symbol}.kline.${interval}`;
    ws.subscribe(sub, { id: "tv", sub: sub }, (data) => {
      const tick = data.tick as IApiKLine;
      this.datafeed.updateKLine({
        time: tick.id * 1000,
        open: tick.open,
        high: tick.high,
        low: tick.low,
        close: tick.close,
        volume: tick.vol,
      });
    });
  };

  public unsubscribeKLine = () => {
    const symbol = this.props.symbol?.symbol;
    const interval = INTERVAL[this.interval].server;
    ws.unsubscribe(`market.${symbol}.kline.${interval}`);
  };

  public initTradingView = () => {
    const symbol = this.props.symbol!;
    const display_name = `${symbol[
      "base-currency"
    ].toLocaleUpperCase()}/${symbol["quote-currency"].toLocaleUpperCase()}`;
    this.widget = new (window as unknown as any).TradingView.widget({
      locale: "zh",
      theme: "Dark",
      fullscreen: false,
      symbol: display_name,
      interval: this.interval,
      container_id: "tv_chart_container",
      datafeed: this.datafeed,
      library_path: "./charting_library/",
      timezone: "Asia/Shanghai",
      enabled_features: ["hide_last_na_study_output"],
      disabled_features: [
        "volume_force_overlay",
        "header_resolutions",
        "header_compare",
        "header_undo_redo",
      ],
      // preset: this.isMobile() ? "mobile" : void 0,
      custom_indicators_getter: function (PineJS: any) {
        return new Promise((resolve) => {
          resolve([BB(PineJS), EMA(PineJS), MACD(PineJS), SuperTrend(PineJS)]);
        });
      },
    });
    if (!this.widget) return;
    this.widget
      .headerReady()
      .then(() => {
        this.createStudys();
        this.buttons = [];
        if (this.isMobile()) {
          return;
        }
        for (let key in INTERVAL) {
          const item = INTERVAL[key as KeyT];
          const button = this.widget!.createButton();
          button.setAttribute("interval", key);
          button.textContent = item.name;
          button.addEventListener("click", () => this.onButtonClick(key));
          this.buttons.push(button);
        }
        this.addButtonColor();
      })
      .catch(() => {});
  };

  /**
   * 创建指标
   */
  public createStudys = async () => {
    const chart = this.widget?.chart();
    // 先清除已创建指标
    chart?.removeAllStudies(); // 包含成交量
    // this.ids.forEach((id) => {
    //   chart?.removeEntity(id);
    // });
    // this.ids = [];
    for (let item of defaultStudy) {
      const id = await chart?.createStudy(item[0], false, true, item[1]);
      const study = chart?.getStudyById(id!);
      study?.setUserEditEnabled(true);
      // if (id) this.ids.push(id);
    }
  };

  public onButtonClick = (resolution: string) => {
    if (resolution === this.interval) {
      return;
    }
    this.widget!.chart().setResolution(resolution as any, () => {
      if (this.isMobile()) {
        this.forceUpdate();
      } else {
        this.addButtonColor();
      }
    });
  };

  public addButtonColor = () => {
    for (let button of this.buttons) {
      const interval = button.getAttribute("interval");
      if (interval === this.interval) {
        button.style.color = "#1878F3";
      } else {
        button.style.color = "#131722";
      }
    }
  };

  public onChangeSymbol = (symbol: IApiSymbols) => {
    this.unsubscribeKLine();
    this.widget?.setSymbol(
      `${symbol["base-currency"].toLocaleUpperCase()}/${symbol[
        "quote-currency"
      ].toLocaleUpperCase()}`,
      this.interval as any,
      () => {}
    );
  };

  public componentDidMount() {}

  public componentWillUnmount() {
    this.widget && this.widget.remove();
  }

  public render() {
    return (
      <div className="kline-wrapp">
        {this.isMobile() ? (
          <div className="kline-list">
            {Object.keys(INTERVAL).map((k) => {
              return (
                <div
                  key={k}
                  className="kline-item"
                  onClick={() => this.onButtonClick(k)}
                  style={{ color: k === this.interval ? "#1878F3" : "#131722" }}
                >
                  {INTERVAL[k as KeyT].name}
                </div>
              );
            })}
          </div>
        ) : null}
        <div
          id="tv_chart_container"
          style={{ height: window.innerHeight - 48 }}
        />
      </div>
    );
  }
}
