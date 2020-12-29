interface IApiResponse<T> {
  data: T;
  status: number;
}

interface IApiSymbols {
  name: string;
  base_currency: string;
  quote_currency: string;
  price_decimal: number;
  amount_decimal: number;
  tradable: boolean;
}

interface IApiCandles {
  base_vol: number;
  close: number;
  count: number;
  high: number;
  id: number;
  low: number;
  open: number;
  quote_vol: number;
  seq: number;
}
