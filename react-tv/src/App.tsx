import * as React from "react";
import { apiGet } from "./api";
import { KLineHeader } from "./components/KLineHeader";
import { KLineWidget } from "./components/KLineWidget";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { ws } from "./utils/socket";

function App() {
  const [name, setName] = React.useState("btcusdt");
  const [symbols, setSymbols] = React.useState<IApiSymbols[]>([]);
  React.useEffect(() => {
    ws.initWebSocket();
    apiGet<IApiSymbols[]>("public_symbols").then((res) => {
      if (!res || !res.data) {
        return;
      }
      setSymbols(res.data);
    });
  }, []);

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs>
          <Paper>
            <KLineHeader name={name} symbols={symbols} onClick={setName} />
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Paper>
            <KLineWidget symbol={name} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
