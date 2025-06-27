import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                           from '@material-ui/core';
import { OpeningHourEntry } from '@my-old-startup/common/interfaces/openingHours';
import { getHourText }      from '@my-old-startup/frontend-common/utils/format';
import * as React           from 'react';
import { locale }           from '../../../../common/locales';

const hoursItems: number[] = [];

for (let time = 0; time <= 2400; time += 100) {
  hoursItems.push(time);

  if (time !== 2400) {
    const halfHour = time + 30;

    hoursItems.push(halfHour);
  }
}

const styles = (theme: Theme) => createStyles({
  container: {
    display:  'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin:   theme.spacing(1),
    minWidth: 120,
  },
  cancel: {
    backgroundColor: theme.palette.grey[400],
    marginRight:     theme.spacing(1),
  },
});

type Props = {
  label: string;
  open: boolean;

  onSubmit(timespan: OpeningHourEntry): void;

  onAbort(): void;
} & WithStyles<typeof styles>;

type State = {
  from: number;
  to: number;
};

class _CompanyOpeningHoursDialog extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      from: 800,
      to:   1200,
    };
  }

  public render(): JSX.Element {
    const { classes, onSubmit, onAbort, open, label } = this.props;
    const { from, to }                                = this.state;

    return (
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={open}
        onClose={onAbort}
      >
        <DialogTitle>{locale.forms.apiCompanyDetails.openingHoursForm.header.modal(label)}</DialogTitle>

        <DialogContent>
          <Typography variant="subtitle1">
            {locale.forms.apiCompanyDetails.openingHoursForm.header.description}
          </Typography>
        </DialogContent>

        <DialogContent>
          <form className={classes.container}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink>Von</InputLabel>
              <Select
                value={from}
                onChange={(e) => this.setTime({ to, from: Number(e.target.value) })}
              >
                {this.getTimeItems()}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl}>
              <InputLabel shrink>Bis</InputLabel>
              <Select
                value={to}
                onChange={(e) => this.setTime({ to: Number(e.target.value), from })}
              >
                {this.getTimeItems()}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onAbort} color="primary" className={classes.cancel}>
            {locale.common.buttons.cancel}
          </Button>
          <Button variant="contained" onClick={() => onSubmit(this.state)} color="primary">
            {locale.common.buttons.ok}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private getTimeItems(): React.ReactNode {
    return hoursItems.map((text, i) => (
      <MenuItem key={i} value={text}>
        {getHourText(text)}
      </MenuItem>
    ));
  }

  private setTime({ from, to }: OpeningHourEntry): void {
    this.setState({ from, to });
  }
}

export const CompanyOpeningHoursDialog = withStyles(styles)(_CompanyOpeningHoursDialog);
