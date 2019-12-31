import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
}))

export interface BottomAppBarProps {
  onGenerateChartButtonPress?: React.MouseEventHandler
}

export default function BottomAppBar({
  onGenerateChartButtonPress,
}: BottomAppBarProps) {
  const classes = useStyles()

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      <Toolbar>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={onGenerateChartButtonPress}
        >
          Generate Chart
        </Button>
      </Toolbar>
    </AppBar>
  )
}
