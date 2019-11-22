import Vue from "vue";
import Component from "vue-class-component";
import { TradingView, Datafeed } from "trader-view";
import { IChartingLibraryWidget, IDatafeed } from "trader-view";
import { LibrarySymbolInfo, Bar } from "trader-view";

import axios from "axios";

@Component
class KlineChart extends Vue {
  public widget?: IChartingLibraryWidget;
  public datafeed?: IDatafeed;
  public socket?: WebSocket;
  public klineData: Bar[] = [];

  public initWebSocket() {
    this.socket = new WebSocket("wss://www.btb.io/websocket/api");
    this.socket.onopen = () => {
      if (!this.socket) return;
      const data = {
        event: "addChannel",
        channel: "market.BTC/USDT.kline.1day"
      };
      this.socket.send(JSON.stringify(data));
    };
    this.socket.onmessage = ev => {
      this.onMessage(ev.data);
    };
  }

  public onMessage(msg: string) {
    // console.log("", msg);
    try {
      const _msg = JSON.parse(msg);
      if (_msg && _msg.data && !this.klineData.length) {
        const list: Bar[] = [];
        const is1D = true;
        for (let i = 0; i < _msg.data.length; i++) {
          list.push({
            time: is1D ? _msg.data[i].time + 86400000 : _msg.data[i].time,
            open: _msg.data[i].open,
            high: _msg.data[i].hight,
            low: _msg.data[i].low,
            close: _msg.data[i].close,
            volume: _msg.data[i].amount
          });
        }
        list.sort((a, b) => a.time - b.time);
        this.klineData = list;
      }
      if (_msg && _msg.ticker && !this.klineData.length) {
        if (this.datafeed) {
          const is1D = true;
          this.datafeed.updateData({
            bars: [
              {
                time: is1D ? _msg.ticker.time + 86400000 : _msg.ticker.time,
                open: _msg.ticker.open,
                high: _msg.ticker.hight,
                low: _msg.ticker.low,
                close: _msg.ticker.close,
                volume: _msg.ticker.amount
              }
            ],
            meta: { noData: false }
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  public initDatafeed() {
    this.datafeed = new Datafeed(
      {
        history: params => {
          return this.getBars(
            params.symbol,
            params.resolution,
            params.from,
            params.to
          ).then(data => {
            this.klineData = [];
            return data;
          });
        }
      },
      "https://demo_feed.tradingview.com"
    );
  }

  public initTradingView() {
    if (!this.datafeed) {
      return;
    }
    this.widget = new TradingView({
      // debug: true, // uncomment this line to see Library errors and warnings in the console
      fullscreen: true,
      symbol: "AAPL",
      interval: "D",
      container_id: "tv_chart_container",

      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: this.datafeed,
      library_path: "charting_library/",
      locale: "zh",

      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: "http://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      // debug: true,
      theme: "Dark",
      timezone: "Asia/Shanghai"
    });
  }

  public getBars(
    symbol: string,
    resolution: string,
    rangeStartDate: number,
    rangeEndDate: number
  ) {
    console.log(symbol, resolution, rangeStartDate, rangeEndDate);
    // return axios
    //   .post<IApi<IData[]>>("/v1/exchange/ticker/getScaleByDate", {
    //     from: rangeStartDate,
    //     symbol: "btcusdt",
    //     to: rangeEndDate,
    //     type: "DAY_1"
    //   })
    //   .then(result => {
    //     if (result.data && result.data.data) {
    //       const data = result.data.data;
    //       const list: Bar[] = [];
    //       for (let i = 0; i < data.length; i++) {
    //         list.push({
    //           time: data[i].id * 1000,
    //           open: data[i].open,
    //           high: data[i].high,
    //           low: data[i].low,
    //           close: data[i].close,
    //           volume: data[i].volume
    //         });
    //       }
    //       return {
    //         bars: list,
    //         meta: { noData: !list.length }
    //       };
    //     } else {
    //       return {
    //         bars: [],
    //         meta: { noData: true }
    //       };
    //     }
    //   });
    return new Promise(resolve => {
      resolve();
    }).then(() => {
      return {
        bars: this.klineData,
        meta: { noData: !this.klineData.length }
      };
    });
  }

  public created() {
    this.initDatafeed();
    this.initWebSocket();
  }

  public mounted() {
    window.addEventListener(
      "DOMContentLoaded",
      this.initTradingView.bind(this),
      false
    );
  }
}

export default KlineChart;

export interface IApi<T> {
  data: T;
  error: string;
  message: string;
  status: number;
  success: boolean;
  timestamp: string;
  type: string;
}

export interface IData {
  amount: number;
  close: number;
  date: string;
  high: number;
  id: number;
  low: number;
  open: number;
  symbol: string;
  type: string;
  volume: number;
}
