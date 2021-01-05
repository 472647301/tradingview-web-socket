import * as React from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: window.innerHeight,
    overflow: "scroll",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

type Props = {
  name: string;
  symbols: IApiSymbols[];
  onClick: (name: string) => void;
};
export const KLineHeader = (props: Props) => {
  const classes = useStyles();
  const { name, symbols, onClick } = props;

  return (
    <div className={classes.root}>
      {symbols.map((e) => {
        if (e.state !== "online") {
          return null;
        }
        const isActive = name === e.symbol;
        return (
          <Button
            key={e.symbol}
            size={"small"}
            variant="outlined"
            color={isActive ? "secondary" : "primary"}
            onClick={() => onClick(e.symbol)}
          >
            {e["base-currency"].toLocaleUpperCase()}/
            {e["quote-currency"].toLocaleUpperCase()}
          </Button>
        );
      })}
    </div>
  );
};
