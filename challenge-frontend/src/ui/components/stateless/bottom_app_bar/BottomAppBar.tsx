import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    flexGrow: 1,
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
  onGenerateChartButtonPress?: React.MouseEventHandler,
  shouldInterpolate?: boolean,
  onCheckBoxPressed?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void,
  defaultInterpolateInterval?: number,
  onInterpolateIntervalChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default function BottomAppBar({
  onGenerateChartButtonPress,
  shouldInterpolate = true, onCheckBoxPressed, defaultInterpolateInterval = 100, onInterpolateIntervalChange
}: BottomAppBarProps) {
  const classes = useStyles()

  return (
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <Typography align="left" className={classes.grow} >
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={onGenerateChartButtonPress}
            >
              Generate Chart
            </Button>
          </Typography>
          <Typography align="right"  >
            should Interpolate?
            <Checkbox
                checked={shouldInterpolate}
                onChange={onCheckBoxPressed}
                value="shouldInterpolate"
            />
          </Typography>
          <TextField
              defaultValue={defaultInterpolateInterval}
              label="Number of Points:"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onInterpolateIntervalChange}
              inputProps={{
                style: { textAlign: "center" }
              }}
          />

        </Toolbar>
      </AppBar>
  )
}
