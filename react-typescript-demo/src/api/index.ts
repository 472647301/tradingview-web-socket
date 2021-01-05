import { https } from "./axios";
import { AxiosRequestConfig } from "axios";

// export const BASE_URL = "/api";
export const BASE_URL = "https://api.huobi.pro";

export const API_URL = {
  /**
   * 交易对
   */
  common_symbols: "/v1/common/symbols",
  /**
   * K线数据
   */
  history_kline: "/market/history/kline",
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
