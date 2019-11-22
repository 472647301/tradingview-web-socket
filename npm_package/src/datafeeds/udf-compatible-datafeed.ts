import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
import { Options } from '../typings/datafeed-api'

export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
	public constructor(datafeedURL: string, options: Options) {
		const requester = new Requester();
		const quotesProvider = new QuotesProvider(datafeedURL, requester);
		super(datafeedURL, quotesProvider, requester, undefined, options);
	}
}
