import React, { useRef, useState, useEffect } from "react";
import { DataFeed } from "./datafeed";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { fetchKLine, fetchSymbols, IApiKLine, IApiSymbol } from "./services";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import * as pako from "pako";

declare global {
  interface Window {
    TradingView: {
      widget: TradingView.IChartWidgetApi;
    };
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    marginRight: theme.spacing(2),
  },
}));

const Resolution = {
  "1": { server: "1min", name: "1m" },
  "5": { server: "5min", name: "5m" },
  "30": { server: "30min", name: "30m" },
  "60": { server: "60min", name: "1h" },
  "240": { server: "4hour", name: "4h" },
  "1440": { server: "1day", name: "1D" },
  "10080": { server: "1week", name: "1W" },
  "302400": { server: "1mon", name: "1M" },
};

const icon_url = "https://static.okex.com/cdn/oksupport/asset/currency/icon/";

function App() {
  const [visible, setVisible] = useState(false);
  const [list, setList] = useState<IApiSymbol[]>([]);
  const interval = useRef<keyof typeof Resolution>("5");
  const container = useRef<HTMLDivElement | null>(null);
  const widget = useRef<TradingView.IChartingLibraryWidget>();
  const datafeed = useRef<DataFeed>();
  const [info, setInfo] = useState<IApiSymbol>();
  const infoRef = useRef(info);
  const ws = useRef<WebSocket>();

  useEffect(() => {
    infoRef.current = info;
  });

  useEffect(() => {
    if (ws.current) {
      return;
    }
    const init = async () => {
      const res = await fetchSymbols();
      if (!res) return;
      const obj: Record<string, IApiSymbol> = {};
      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        if (
          item.state === "online" &&
          item["quote-currency"] === "usdt" &&
          !/\d/.test(item["base-currency"])
        ) {
          obj[item["base-currency"]] = item;
        }
      }
      const arr = Object.keys(obj).sort();
      const newList = arr.map((k) => obj[k]);
      const newInfo = newList.find((e) => {
        return e.symbol === "btcusdt";
      });
      setInfo(newInfo || newList[0]);
      setList(newList);
      initDatafeed(newInfo || newList[0]);
      initTradingView(newInfo || newList[0]);
    };
    ws.current = new WebSocket("wss://api.huobi.pro/ws");
    ws.current.binaryType = "arraybuffer";
    ws.current.onmessage = onMessage;
    ws.current.onopen = () => {
      init();
    };
    // eslint-disable-next-line
  }, []);

  const onMessage = (event: MessageEvent<pako.Data>) => {
    if (!event.data) {
      return;
    }
    const text = pako.inflate(event.data, {
      to: "string",
    });
    const data = JSON.parse(text);
    // console.log("---inflate----", data);
    if (data && data.ping) {
      ws.current?.send(
        JSON.stringify({
          pong: Date.now(),
        })
      );
      return;
    }
    const tick: IApiKLine = data.tick;
    if (!tick || !tick.id) {
      return;
    }
    datafeed.current?.updateBar({
      time: tick.id * 1000,
      open: tick.open,
      high: tick.high,
      low: tick.low,
      close: tick.close,
      volume: tick.vol,
    });
  };

  const initDatafeed = (data?: IApiSymbol) => {
    const currentInfo = data || info;
    if (!currentInfo) return;
    const display_name = `${currentInfo[
      "base-currency"
    ].toLocaleUpperCase()}/${currentInfo[
      "quote-currency"
    ].toLocaleUpperCase()}`;
    const supported_resolutions = Object.keys(Resolution) as never;
    datafeed.current = new DataFeed({
      SymbolInfo: {
        name: display_name,
        full_name: display_name,
        description: "",
        type: "stock",
        session: "24x7",
        exchange: "",
        listed_exchange: "",
        timezone: "Asia/Shanghai",
        format: "price",
        pricescale: Math.pow(10, currentInfo["price-precision"]),
        minmov: 1,
        volume_precision: currentInfo["value-precision"],
        has_intraday: true,
        supported_resolutions: supported_resolutions,
        has_weekly_and_monthly: true,
        has_daily: true,
      },
      DatafeedConfiguration: {
        supported_resolutions: supported_resolutions,
      },
      getBars: getBars,
    });
  };

  const getBars = async (
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    periodParams: TradingView.PeriodParams,
    onResult: TradingView.HistoryCallback,
    onError: TradingView.ErrorCallback
  ) => {
    const bars: TradingView.Bar[] = [];
    const size = window.innerWidth;
    if (!periodParams.firstDataRequest) {
      // 火币接口暂时不支持分段查询历史数据
      onResult(bars, { noData: true });
      return;
    }
    if (resolution !== interval.current) {
      unsubscribeKLine();
      interval.current = resolution as keyof typeof Resolution;
    }
    const res = await fetchKLine(
      infoRef.current?.symbol!,
      Resolution[interval.current].server,
      size > 2000 ? 2000 : size
    );
    if (!res || !res.length) {
      onResult(bars, { noData: true });
      return;
    }
    for (let i = 0; i < res.length; i++) {
      const item = res[i];
      bars.push({
        time: item.id * 1000,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.vol,
      });
    }
    bars.sort((l, r) => (l.time > r.time ? 1 : -1));
    if (periodParams.firstDataRequest) {
      subscribeKLine();
    }
    onResult(bars);
  };

  const initTradingView = (data?: IApiSymbol) => {
    const currentInfo = data || info;
    widget.current = new window.TradingView.widget({
      locale: "zh",
      fullscreen: true,
      theme: "Light",
      symbol: currentInfo?.symbol,
      interval: interval.current as never,
      container: container.current!,
      datafeed: datafeed.current!,
      // library_path: "http://test.byronzhu.com/tv/charting_library/",
      library_path: "./charting_library/",
    });
  };

  const onClick = () => {
    setVisible(!visible);
  };

  const onSelected = (e: IApiSymbol) => {
    if (!info || !widget.current) {
      return;
    }
    if (e.symbol !== info.symbol) {
      setInfo(e);
      unsubscribeKLine();
      interval.current = "5";
      widget.current.setSymbol(
        `${info["base-currency"].toLocaleUpperCase()}/${info[
          "quote-currency"
        ].toLocaleUpperCase()}`,
        "5" as never,
        () => {}
      );
    }
  };

  const subscribeKLine = () => {
    const sub = `market.${infoRef.current?.symbol}.kline.${
      Resolution[interval.current].server
    }`;
    ws.current?.send(JSON.stringify({ id: "tv", sub: sub }));
  };

  const unsubscribeKLine = () => {
    const sub = `market.${infoRef.current?.symbol}.kline.${
      Resolution[interval.current].server
    }`;
    ws.current?.send(JSON.stringify({ id: "tv", sub: sub, cmd: "unsub" }));
  };

  const styles = useStyles();
  const title = info
    ? `${info["base-currency"].toLocaleUpperCase()}/${info[
        "quote-currency"
      ].toLocaleUpperCase()}`
    : "";

  return (
    <div className="app">
      <div className={styles.root}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              className={styles.menu}
              onClick={onClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit">
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
      <div className="container" ref={container} />
      <SwipeableDrawer open={visible} onOpen={() => {}} onClose={onClick}>
        <List dense={true}>
          {list.map((e, i) => {
            return (
              <ListItem
                key={e.symbol}
                button={true}
                selected={e.symbol === info?.symbol}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${i + 1}`}
                    src={`${icon_url}${e["base-currency"]}.png?x-oss-process=image/format,webp`}
                  />
                </ListItemAvatar>
                <ListItemText
                  style={{
                    color: e.symbol === info?.symbol ? "red" : "inherit",
                  }}
                  primary={`${e["base-currency"].toLocaleUpperCase()}/${e[
                    "quote-currency"
                  ].toLocaleUpperCase()}`}
                  onClick={() => onSelected(e)}
                />
              </ListItem>
            );
          })}
        </List>
      </SwipeableDrawer>
    </div>
  );
}

export default React.memo(App);
