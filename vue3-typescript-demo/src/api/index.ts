import axios from "@/plugins/axios";
import qs from "@/plugins/qs";
import type {
  SymbolList,
  IApiSymbols,
  KlineHistory,
  KlineHistoryItem,
  IApiKLine,
} from "@/types";

/** 取得幣種 */
export const getSymbols = async (): Promise<Error | [SymbolList, string]> => {
  const { data } = await axios.get("/v1/common/symbols");
  if (!data.data) return new Error("empty data");
  const symbolList: SymbolList = [];
  data.data.forEach((item: IApiSymbols) => {
    if (item["quote-currency"] === "usdt") {
      symbolList.push({
        ...item,
        pair:
          item["base-currency"].toLocaleUpperCase() +
          "/" +
          item["quote-currency"].toLocaleUpperCase(),
      });
    }
  });
  const symbolData = symbolList.length ? symbolList[0].symbol : "";
  return [symbolList, symbolData] as [SymbolList, string];
};

/** 取得kline歷史紀錄 */
export const getKlineHistory = async (obj: Record<string, any>) => {
  const { data } = await axios.get(
    `/market/history/kline?${qs.stringify(obj)}`
  );
  if (data.status !== "ok" && !data.data.length) return [null];
  const list: KlineHistory = data.data
    .map((item: IApiKLine) => {
      return {
        time: item.id * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.vol,
      };
    })
    .sort((a: KlineHistoryItem, b: KlineHistoryItem) =>
      a.time > b.time ? 1 : -1
    );
  return [list];
};
