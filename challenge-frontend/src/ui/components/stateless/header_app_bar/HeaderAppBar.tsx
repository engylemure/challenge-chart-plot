import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MultilineChart from '@material-ui/icons/MultilineChartRounded'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

interface HeaderAppBarProps {
  title: String;
}

export default function HeaderAppBar({ title }: HeaderAppBarProps) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <MultilineChart className={classes.icon}/>
          <Typography align='left' variant="h6" className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}