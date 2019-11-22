import * as _TradingView from "charting_library";
import { UDFCompatibleDatafeedBase } from "./datafeeds/udf-compatible-datafeed-base";
import { QuotesProvider } from "./datafeeds/quotes-provider";
import { Requester } from "./datafeeds/requester";
import { Options } from "./typings/datafeed-api";

export class Datafeed extends UDFCompatibleDatafeedBase {
  public constructor(datafeedURL: string, options: Options) {
    const requester = new Requester();
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(datafeedURL, quotesProvider, requester, undefined, options);
  }
}

export class TradingView extends _TradingView.widget {}
