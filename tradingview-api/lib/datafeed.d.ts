/**
 * JS API
 * https://aitrade.ga/books/tradingview/book/JS-Api.html
 */
import * as Tv from "./library.min";
export { widget, version } from "./library.min.js";
export declare type SearchSymbolsParams = {
    userInput: string;
    exchange: string;
    symbolType: string;
};
export declare type GetBarsParams = {
    symbolInfo: Tv.LibrarySymbolInfo;
    resolution: string;
    from: number;
    to: number;
    firstDataRequest: boolean;
};
export declare type GetMarksParams = {
    symbolInfo: Tv.LibrarySymbolInfo;
    startDate: number;
    endDate: number;
    resolution: string;
};
export declare type GetTimescaleMarks = GetMarksParams;
export interface Options {
    fetchConfiguration?: () => Promise<Tv.DatafeedConfiguration>;
    fetchSearchSymbols?: (params: SearchSymbolsParams) => Promise<Array<Tv.SearchSymbolResultItem>>;
    fetchResolveSymbol?: (symbolName: string) => Promise<Tv.LibrarySymbolInfo>;
    getBars?: (params: GetBarsParams) => Promise<{
        bars: Tv.Bar[];
        meta: Tv.HistoryMetadata;
    }>;
    calculateHistoryDepth?: (resolution: string, resolutionBack: Tv.ResolutionBackValues, intervalBack: number) => Tv.HistoryDepth | undefined;
    getMarks?: (params: GetMarksParams) => Promise<Array<Tv.Mark>>;
    getTimescaleMarks?: (params: GetTimescaleMarks) => Promise<Array<Tv.TimescaleMark>>;
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
export declare class DataFeed implements Tv.IExternalDatafeed, Tv.IDatafeedChartApi {
    private options;
    private configuration;
    private subscribers;
    private requesting;
    constructor(options?: Options);
    /**
     * 此方法可以设置图表库支持的图表配置。这些数据会影响到图表支持的功能
     */
    onReady(callback: Tv.OnReadyCallback): void;
    /**
     * 提供一个匹配用户搜索的商品列表
     */
    searchSymbols(userInput: string, exchange: string, symbolType: string, onResult: Tv.SearchSymbolsCallback): void;
    /**
     * 通过商品名称解析商品信息
     */
    resolveSymbol(symbolName: string, onSymbolResolvedCallback: Tv.ResolveCallback, onResolveErrorCallback: Tv.ErrorCallback): void;
    /**
     * 当图表库需要由日期范围定义的历史K线片段时，将调用此函数
     */
    getBars(symbolInfo: Tv.LibrarySymbolInfo, resolution: string, from: number, to: number, onHistoryCallback: Tv.HistoryCallback, onErrorCallback: Tv.ErrorCallback, firstDataRequest: boolean): void;
    /**
     * 订阅K线数据。图表库将调用onRealtimeCallback方法以更新实时数据
     */
    subscribeBars(symbolInfo: Tv.LibrarySymbolInfo, resolution: string, onRealtimeCallback: Tv.SubscribeBarsCallback, subscriberUID: string, onResetCacheNeededCallback: () => void): void;
    /**
     * 取消订阅K线数据
     */
    unsubscribeBars(subscriberUID: string): void;
    updateKLine(bar: Tv.Bar): void;
    /**
     * 图表库在它要请求一些历史数据的时候会调用这个函数，让你能够覆盖所需的历史深度
     */
    calculateHistoryDepth(resolution: string, resolutionBack: Tv.ResolutionBackValues, intervalBack: number): Tv.HistoryDepth | undefined;
    /**
     * 图表库调用这个函数来获得可见的K线范围的标记
     */
    getMarks(symbolInfo: Tv.LibrarySymbolInfo, startDate: number, endDate: number, onDataCallback: Tv.GetMarksCallback<Tv.Mark>, resolution: string): void;
    /**
     * 图表库调用此函数获取可见K线范围的时间刻度标记
     */
    getTimescaleMarks(symbolInfo: Tv.LibrarySymbolInfo, startDate: number, endDate: number, onDataCallback: Tv.GetMarksCallback<Tv.TimescaleMark>, resolution: string): void;
    /**
     * 当图表需要知道服务器时间时，如果配置标志supports_time设置为true，则调用此函数
     */
    getServerTime(callback: Tv.ServerTimeCallback): void;
    private defaultConfiguration;
}
