import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                    from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
}                    from '@material-ui/icons';
import { Timestamp } from '@my-old-startup/common/interfaces';
import moment        from 'moment';
import * as React    from 'react';
import { locale }    from '../locales';

const COLON = ':';

const styles = (theme: Theme) => createStyles(
  {
    dialogContent: {
      textAlign:         'center',
      width:             150,
      '& .MuiGrid-item': {
        display:        'flex',
        justifyContent: 'center',
      },
    },
    dialogActions: {
      justifyContent: 'center',
    },
    arrowIcon:     {
      fontSize: theme.typography.pxToRem(45),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  timestamp: Timestamp;
  label: string;
  open: boolean;

  onSubmit: (timestamp: Timestamp) => void;
  onAbort: () => void;
};

type State = {
  hour: number;
  minute: number;
};

class _TimePickerDialog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const date = moment(props.timestamp);

    // Round up to nearest multiple of 5
    let minute = Math.ceil(date.minutes() / 5) * 5;

    const hour = minute === 60 ? date.hours() + 1 : date.hours();
    minute     = minute === 60 ? 0 : minute;

    this.state = {
      hour,
      minute,
    };
  }

  public render(): React.ReactNode {
    const { classes, onAbort, open, label } = this.props;
    const { hour, minute }                  = this.state;

    const displayValue = (value: number): string => value < 10 ? `0${value}` : String(value);

    return (
      <Dialog open={open}
              onClose={onAbort}
              disableBackdropClick>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={4}>
              <Button onClick={() => this.changeHour(1)}
                      color="primary">
                <ExpandLess className={classes.arrowIcon}/>
              </Button>
            </Grid>

            <Grid item xs={4}/>

            <Grid item xs={4}>
              <Button onClick={() => this.changeMinute(5)}
                      color="primary">
                <ExpandLess className={classes.arrowIcon}/>
              </Button>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h3">
                {displayValue(hour)}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h3">
                {COLON}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography variant="h3">
                {displayValue(minute)}
              </Typography>
            </Grid>


            <Grid item xs={4}>
              <Button onClick={() => this.changeHour(-1)}
                      color="primary">
                <ExpandMore className={classes.arrowIcon}/>
              </Button>
            </Grid>

            <Grid item xs={4}/>

            <Grid item xs={4}>
              <Button onClick={() => this.changeMinute(-5)}
                      color="primary">
                <ExpandMore className={classes.arrowIcon}/>
              </Button>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button variant="contained" onClick={onAbort}>
            {locale.common.buttons.cancel}
          </Button>
          <Button variant="contained" onClick={() => this.onSubmit()} color="primary">
            {locale.common.buttons.save}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private changeHour(amount: number): void {
    let hour = 0;
    if (this.state.hour === 0) {
      hour = Math.abs((24 + amount) % 24);
    } else {
      hour = Math.abs((this.state.hour + amount) % 24);
    }

    this.setState({ hour });
  }

  private changeMinute(amount: number): void {
    let minute = 0;
    if (this.state.minute === 0) {
      minute = Math.abs((60 + amount) % 60);
    } else {
      minute = Math.abs((this.state.minute + amount) % 60);
    }

    this.setState({ minute });
  }

  private onSubmit(): void {
    const date = moment(this.props.timestamp).hour(this.state.hour).minute(this.state.minute);

    this.props.onSubmit(date.valueOf());
  }
}

export const TimePickerDialog = withStyles(styles)(_TimePickerDialog);
