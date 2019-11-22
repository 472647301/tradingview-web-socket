import * as _TradingView from "charting_library";
import { UDFCompatibleDatafeed } from "./datafeeds/udf-compatible-datafeed";
import { QuotesProvider } from "./datafeeds/quotes-provider";
import { Requester } from "./datafeeds/requester";

export class Datafeed extends UDFCompatibleDatafeed {
  public constructor(options: any, datafeedURL: string = "") {
    const requester = new Requester(options);
    const quotesProvider = new QuotesProvider(datafeedURL, requester);
    super(datafeedURL, quotesProvider, requester, undefined);
  }
}

export class TradingView extends _TradingView.widget {}
