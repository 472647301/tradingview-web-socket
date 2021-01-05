import * as React from "react";
import { apiGet } from "./api";
import { KLineHeader } from "./components/KLineHeader";
import { KLineWidget } from "./components/KLineWidget";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { ws } from "./utils/socket";

type Props = {};
type State = {
  symbol: string;
  symbolInfo?: IApiSymbols;
  symbolList: IApiSymbols[];
};
class App extends React.Component<Props, State> {
  private klineRfe: null | KLineWidget = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      symbol: "",
      symbolInfo: void 0,
      symbolList: [],
    };
  }

  public fetchSymbolList() {
    apiGet<IApiSymbols[]>("common_symbols").then((res) => {
      if (!res || !res.data) {
        return;
      }
      const list: IApiSymbols[] = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i]["quote-currency"] === "usdt") {
          list.push(res.data[i]);
        }
      }
      const symbol = list.length ? list[0].symbol : "";
      this.setState({
        symbol: symbol,
        symbolInfo: list[0],
        symbolList: list,
      });
    });
  }

  public setSymbol = (symbol: string) => {
    const symbolInfo = this.state.symbolList.find((e) => e.symbol === symbol);
    if (!symbolInfo) {
      return;
    }
    this.setState({ symbol, symbolInfo });
    this.klineRfe?.setSymbol(symbol);
  };

  public componentDidMount() {
    ws.initWebSocket();
    this.fetchSymbolList();
  }

  public render() {
    const { symbol, symbolInfo, symbolList } = this.state;
    return (
      <div className="App">
        <Grid container spacing={1}>
          <Grid item xs>
            <Paper>
              <KLineHeader
                name={symbol}
                symbols={symbolList}
                onClick={this.setSymbol}
              />
            </Paper>
          </Grid>
          <Grid item xs={10}>
            <Paper>
              {symbolInfo && (
                <KLineWidget
                  symbolInfo={symbolInfo}
                  ref={(ref) => (this.klineRfe = ref)}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
