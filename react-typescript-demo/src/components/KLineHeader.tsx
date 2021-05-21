import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menu: {
    marginRight: theme.spacing(2),
  },
}));

type Props = {
  title: string;
  onClick: () => void;
};
export function KLineHeader(props: Partial<Props>) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className={styles.menu}
            onClick={props.onClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            {props.title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
