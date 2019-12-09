import {
  Bar,
  HistoryMetadata,
  LibrarySymbolInfo
} from "../typings/datafeed-api";

import {
  getErrorMessage,
  RequestParams,
  UdfErrorResponse,
  UdfOkResponse,
  UdfResponse
} from "./helpers";

import { Requester } from "./requester";

interface HistoryPartialDataResponse extends UdfOkResponse {
  t: number[];
  c: number[];
  o?: never;
  h?: never;
  l?: never;
  v?: never;
}

interface HistoryFullDataResponse extends UdfOkResponse {
  t: number[];
  c: number[];
  o: number[];
  h: number[];
  l: number[];
  v: number[];
}

interface HistoryNoDataResponse extends UdfResponse {
  s: "no_data";
  nextTime?: number;
}

type HistoryResponse =
  | HistoryFullDataResponse
  | HistoryPartialDataResponse
  | HistoryNoDataResponse;

export interface GetBarsResult {
  bars: Bar[];
  meta: HistoryMetadata;
}

export class HistoryProvider {
  private _datafeedUrl: string;
  private readonly _requester: Requester;

  public constructor(datafeedUrl: string, requester: Requester) {
    this._datafeedUrl = datafeedUrl;
    this._requester = requester;
  }

  public getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: string,
    rangeStartDate: number,
    rangeEndDate: number,
    firstDataRequest: boolean
  ): Promise<GetBarsResult> {
    const requestParams: RequestParams = {
      symbol: symbolInfo.ticker || "",
      resolution: resolution,
      from: rangeStartDate,
      to: rangeEndDate,
      firstDataRequest: firstDataRequest
    };

    return new Promise(
      (
        resolve: (result: GetBarsResult) => void,
        reject: (reason: string) => void
      ) => {
        this._requester
          .sendRequest<GetBarsResult>(
            this._datafeedUrl,
            "history",
            requestParams
          )
          .then((response: GetBarsResult) => {
            resolve({
              bars: response.bars,
              meta: response.meta
            });
          })
          .catch((reason?: string | Error) => {
            const reasonString = getErrorMessage(reason);
            // tslint:disable-next-line:no-console
            console.warn(
              `HistoryProvider: getBars() failed, error=${reasonString}`
            );
            reject(reasonString);
          });
      }
    );
  }
}
