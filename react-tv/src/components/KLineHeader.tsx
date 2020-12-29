import * as React from "react";
import { makeStyles, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 0.3,
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
        if (!e.tradable) {
          return null;
        }
        const isActive = name === e.name;
        return (
          <Button
            key={e.name}
            variant="outlined"
            color={isActive ? "secondary" : "primary"}
            onClick={() => onClick(e.name)}
          >
            {e.base_currency.toLocaleUpperCase()}/
            {e.quote_currency.toLocaleUpperCase()}
          </Button>
        );
      })}
    </div>
  );
};
