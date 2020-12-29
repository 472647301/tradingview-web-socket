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
  symbolList: IApiSymbols[];
};
class App extends React.Component<Props, State> {
  private klineRfe: null | KLineWidget = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      symbol: "btcusdt",
      symbolList: [],
    };
  }

  public fetchSymbolList() {
    apiGet<IApiSymbols[]>("public_symbols").then((res) => {
      if (!res || !res.data) {
        return;
      }
      this.setState({
        symbolList: res.data,
      });
    });
  }

  public setSymbol = (symbol: string) => {
    this.setState({ symbol });
    this.klineRfe?.setSymbol(symbol);
  };

  public componentDidMount() {
    ws.initWebSocket();
    this.fetchSymbolList();
  }

  public render() {
    const { symbol, symbolList } = this.state;
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
              <KLineWidget
                symbol={symbol}
                ref={(ref) => (this.klineRfe = ref)}
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
