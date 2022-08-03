import axios from "axios";
import to from "await-to-js";

export interface IApiSymbol {
  "amount-precision": number;
  "api-trading": string;
  "base-currency": string;
  "buy-market-max-order-value": number;
  "leverage-ratio": number;
  "limit-order-max-order-amt": number;
  "limit-order-min-order-amt": number;
  "max-order-amt": number;
  "min-order-amt": number;
  "min-order-value": number;
  "price-precision": number;
  "quote-currency": string;
  "sell-market-max-order-amt": number;
  "sell-market-min-order-amt": number;
  state: string;
  "super-margin-leverage-ratio": number;
  symbol: string;
  "symbol-partition": string;
  "value-precision": number;
}

export interface IApiKLine {
  id: number; //	调整为新加坡时间的时间戳，单位秒，并以此作为此K线柱的id
  amount: number; // 	以基础币种计量的交易量
  count: number; //	交易次数
  open: number; //	本阶段开盘价
  close: number; // 本阶段收盘价
  low: number; //	本阶段最低价
  high: number; //	本阶段最高价
  vol: number; //	以报价币种计量的交易量
}

export async function fetchSymbols() {
  const [err, res] = await to(
    axios.get<{ data: IApiSymbol[] }>("https://api.huobi.pro/v1/common/symbols")
  );
  if (err) return;
  return res.data?.data;
}

export async function fetchKLine(symbol: string, period: string, size = 2000) {
  const [err, res] = await to(
    axios.get<{ data: IApiKLine[] }>(
      "https://api.huobi.pro/market/history/kline",
      { params: { symbol, period, size } }
    )
  );
  if (err) return;
  return res.data?.data;
}
