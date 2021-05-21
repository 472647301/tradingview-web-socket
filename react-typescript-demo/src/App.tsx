import * as React from "react";
import { apiGet } from "./api";
import { ws } from "./utils/socket";
import { KLineHeader } from "./components/KLineHeader";
import { KLineWidget } from "./components/KLineWidget";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

const icon_url = "https://static.okex.com/cdn/oksupport/asset/currency/icon/";

type Props = {};
type State = {
  code: string;
  visible: boolean;
  list: Array<IApiSymbols>;
};
class App extends React.Component<Props, State> {
  private klineRef: KLineWidget | null = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      code: "btcusdt",
      visible: false,
      list: [],
    };
  }

  public async fetchSymbolList() {
    const res = await apiGet<IApiSymbols[]>("common_symbols");
    if (!res || !res.data) {
      return;
    }
    const obj: IUtilsMap<IApiSymbols> = {};
    for (let i = 0; i < res.data.length; i++) {
      const item = res.data[i];
      if (
        item.state === "online" &&
        item["quote-currency"] === "usdt" &&
        !/\d/.test(item["base-currency"])
      ) {
        obj[item["base-currency"]] = item;
      }
    }
    const arr = Object.keys(obj).sort();
    this.setState({ list: arr.map((k) => obj[k]) });
  }

  public componentDidMount() {
    ws.initWebSocket();
    this.fetchSymbolList().then(() => {
      this.klineRef && this.klineRef.initTradingView();
    });
  }

  public onOpen = () => {};

  public onClose = () => {};

  public onClick = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  public onSelected = (item: IApiSymbols) => {
    const { code } = this.state;
    if (code !== item.symbol) {
      this.setState({ code: item.symbol });
      this.klineRef && this.klineRef.onChangeSymbol(item);
    }
    this.onClick();
  };

  public render() {
    const { code, visible, list } = this.state;
    const symbol = list.find((e) => e.symbol === code);
    const title = symbol
      ? `${symbol["base-currency"].toLocaleUpperCase()}/${symbol[
          "quote-currency"
        ].toLocaleUpperCase()}`
      : "";
    return (
      <div className="kline">
        <KLineHeader onClick={this.onClick} title={title} />
        <KLineWidget symbol={symbol} ref={(ref) => (this.klineRef = ref)} />
        <SwipeableDrawer
          open={visible}
          onOpen={this.onOpen}
          onClose={this.onClose}
          ModalProps={{ onBackdropClick: this.onClick }}
        >
          <List dense={true}>
            {list.map((e, i) => {
              return (
                <ListItem
                  key={e.symbol}
                  button={true}
                  selected={code === e.symbol}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar n°${i + 1}`}
                      src={`${icon_url}${e["base-currency"]}.png?x-oss-process=image/format,webp`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    style={{
                      color: code === e.symbol ? "red" : "inherit",
                    }}
                    primary={`${e["base-currency"].toLocaleUpperCase()}/${e[
                      "quote-currency"
                    ].toLocaleUpperCase()}`}
                    onClick={() => this.onSelected(e)}
                  />
                </ListItem>
              );
            })}
          </List>
        </SwipeableDrawer>
      </div>
    );
  }
}

export default App;
