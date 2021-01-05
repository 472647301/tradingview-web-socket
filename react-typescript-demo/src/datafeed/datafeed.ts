/**
 * JS API
 * https://aitrade.ga/books/tradingview/book/JS-Api.html
 */

import * as Tv from "./library.min";

export { widget, version } from "./library.min.js";

export type SearchSymbolsParams = {
  userInput: string;
  exchange: string;
  symbolType: string;
};
export type GetBarsParams = {
  symbolInfo: Tv.LibrarySymbolInfo;
  resolution: string;
  from: number;
  to: number;
  firstDataRequest: boolean;
};
export type GetMarksParams = {
  symbolInfo: Tv.LibrarySymbolInfo;
  startDate: number;
  endDate: number;
  resolution: string;
};
export type GetTimescaleMarks = GetMarksParams;
export interface Options {
  fetchConfiguration?: () => Promise<Tv.DatafeedConfiguration>;
  fetchSearchSymbols?: (
    params: SearchSymbolsParams
  ) => Promise<Array<Tv.SearchSymbolResultItem>>;
  fetchResolveSymbol?: (symbolName: string) => Promise<Tv.LibrarySymbolInfo>;
  getBars?: (
    params: GetBarsParams
  ) => Promise<{ bars: Tv.Bar[]; meta: Tv.HistoryMetadata }>;
  calculateHistoryDepth?: (
    resolution: string,
    resolutionBack: Tv.ResolutionBackValues,
    intervalBack: number
  ) => Tv.HistoryDepth | undefined;
  getMarks?: (params: GetMarksParams) => Promise<Array<Tv.Mark>>;
  getTimescaleMarks?: (
    params: GetTimescaleMarks
  ) => Promise<Array<Tv.TimescaleMark>>;
  getServerTime?: () => Promise<number>;
}
export interface DataSubscriber {
  symbolInfo: Tv.LibrarySymbolInfo;
  resolution: string;
  lastBarTime: number | null;
  listener: Tv.SubscribeBarsCallback;
}

export interface DataSubscribers {
  [guid: string]: DataSubscriber;
}

export class DataFeed implements Tv.IExternalDatafeed, Tv.IDatafeedChartApi {
  private options: Options;
  private configuration: Partial<Tv.DatafeedConfiguration> = {};
  private subscribers: DataSubscribers = {};
  private requesting = false;

  constructor(options: Options = {}) {
    this.options = options;
  }

  /**
   * 此方法可以设置图表库支持的图表配置。这些数据会影响到图表支持的功能
   */
  public onReady(callback: Tv.OnReadyCallback): void {
    new Promise((resolve) => {
      resolve(void 0);
    }).then(() => {
      const { fetchConfiguration } = this.options;
      this.configuration = this.defaultConfiguration();
      if (!fetchConfiguration) {
        callback(this.configuration);
        return;
      }
      fetchConfiguration().then((configuration) => {
        this.configuration = Object.assign(this.configuration, configuration);
        callback(this.configuration);
      });
    });
  }

  /**
   * 提供一个匹配用户搜索的商品列表
   */
  public searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: Tv.SearchSymbolsCallback
  ) {
    const { fetchSearchSymbols } = this.options;
    if (!fetchSearchSymbols) {
      return;
    }
    fetchSearchSymbols({ userInput, exchange, symbolType })
      .then(onResult)
      .catch(() => {
        onResult([]);
      });
  }

  /**
   * 通过商品名称解析商品信息
   */
  public resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: Tv.ResolveCallback,
    onResolveErrorCallback: Tv.ErrorCallback
  ) {
    const { fetchResolveSymbol } = this.options;
    if (!fetchResolveSymbol) {
      return;
    }
    fetchResolveSymbol(symbolName)
      .then(onSymbolResolvedCallback)
      .catch(() => {
        onResolveErrorCallback("Error fetchResolveSymbol");
      });
  }

  /**
   * 当图表库需要由日期范围定义的历史K线片段时，将调用此函数
   */
  public getBars(
    symbolInfo: Tv.LibrarySymbolInfo,
    resolution: string,
    from: number,
    to: number,
    onHistoryCallback: Tv.HistoryCallback,
    onErrorCallback: Tv.ErrorCallback,
    firstDataRequest: boolean
  ) {
    const { getBars } = this.options;
    if (!getBars) {
      return;
    }
    if (this.requesting) {
      return;
    }
    this.requesting = true;
    getBars({ symbolInfo, resolution, from, to, firstDataRequest })
      .then((data) => {
        this.requesting = false;
        onHistoryCallback(data.bars, data.meta);
      })
      .catch(() => {
        this.requesting = false;
        onErrorCallback("Error getBars");
      });
  }

  /**
   * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
   */
  public subscribeBars(
    symbolInfo: Tv.LibrarySymbolInfo,
    resolution: string,
    onRealtimeCallback: Tv.SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) {
    if (this.subscribers[subscriberUID]) {
      return;
    }
    this.subscribers[subscriberUID] = {
      lastBarTime: null,
      listener: onRealtimeCallback,
      resolution: resolution,
      symbolInfo: symbolInfo,
    };
  }

  /**
   * 取消订阅K线数据
   */
  public unsubscribeBars(subscriberUID: string) {
    if (!this.subscribers[subscriberUID]) {
      return;
    }
    delete this.subscribers[subscriberUID];
  }

  public updateKLine(bar: Tv.Bar) {
    for (const listenerGuid in this.subscribers) {
      const subscriptionRecord = this.subscribers[listenerGuid];
      if (
        subscriptionRecord.lastBarTime !== null &&
        bar.time < subscriptionRecord.lastBarTime
      ) {
        continue;
      }
      subscriptionRecord.lastBarTime = bar.time;
      subscriptionRecord.listener(bar);
    }
  }

  /**
   * 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度
   */
  public calculateHistoryDepth(
    resolution: string,
    resolutionBack: Tv.ResolutionBackValues,
    intervalBack: number
  ) {
    const { calculateHistoryDepth } = this.options;
    if (!calculateHistoryDepth) {
      return;
    }
    return calculateHistoryDepth(resolution, resolutionBack, intervalBack);
  }

  /**
   * 图表库调用这个函数来获得可见的K线范围的标记
   */
  public getMarks(
    symbolInfo: Tv.LibrarySymbolInfo,
    startDate: number,
    endDate: number,
    onDataCallback: Tv.GetMarksCallback<Tv.Mark>,
    resolution: string
  ) {
    const { getMarks } = this.options;
    if (!getMarks) {
      return;
    }
    getMarks({ symbolInfo, startDate, endDate, resolution }).then(
      onDataCallback
    );
  }

  /**
   * 图表库调用此函数获取可见K线范围的时间刻度标记
   */
  public getTimescaleMarks(
    symbolInfo: Tv.LibrarySymbolInfo,
    startDate: number,
    endDate: number,
    onDataCallback: Tv.GetMarksCallback<Tv.TimescaleMark>,
    resolution: string
  ) {
    const { getTimescaleMarks } = this.options;
    const { supports_timescale_marks } = this.configuration;
    if (!getTimescaleMarks || !supports_timescale_marks) {
      return;
    }
    getTimescaleMarks({ symbolInfo, startDate, endDate, resolution }).then(
      onDataCallback
    );
  }

  /**
   * 当图表需要知道服务器时间时，如果配置标志supports_time设置为true，则调用此函数
   */
  public getServerTime(callback: Tv.ServerTimeCallback) {
    const { getServerTime } = this.options;
    const { supports_time } = this.configuration;
    if (!getServerTime || !supports_time) {
      return;
    }
    getServerTime().then(callback);
  }

  private defaultConfiguration(): Tv.DatafeedConfiguration {
    return {
      supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
      supports_marks: false,
      supports_timescale_marks: false,
    };
  }
}
