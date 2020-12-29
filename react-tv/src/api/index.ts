import { https } from "./axios";
import { AxiosRequestConfig } from "axios";

// export const BASE_URL = "https://api.fcoin.pro/v2";
export const BASE_URL = "/api";

export const API_URL = {
  /**
   * 查询可用交易对
   */
  public_symbols: "/public/symbols",
  /**
   * 获取 Candle 信息
   */
  market_candles: "/market/candles",
};

export type UrlT = keyof typeof API_URL;

export async function apiGet<T>(
  url: UrlT,
  params?: string,
  config?: AxiosRequestConfig
) {
  let _url = API_URL[url];
  _url = _url ? `${BASE_URL}${_url}` : url;
  _url = params ? _url + params : _url;
  const res = await https.get<IApiResponse<T>>(_url, config).catch(() => {
    return;
  });
  return res ? res.data : void 0;
}

export async function apiPost<T, P = any>(
  url: UrlT,
  params?: P,
  config?: AxiosRequestConfig
) {
  let _url = API_URL[url];
  _url = _url ? `${BASE_URL}${_url}` : url;
  const res = await https
    .post<IApiResponse<T>>(_url, params, config)
    .catch(() => {
      return;
    });
  return res ? res.data : void 0;
}
