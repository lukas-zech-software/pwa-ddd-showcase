import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
}                      from '@material-ui/core';
import ResetIcon       from '@material-ui/icons/Refresh';
import { IApiCompany } from '@my-old-startup/common/interfaces';
import * as moment     from 'moment';
import * as React      from 'react';

const styles = () => createStyles({
  dialogContent: {
    textAlign: 'center',
  },
});

type Props = WithStyles<typeof styles> & {
  company: Pick<IApiCompany, 'contact'>;
  open: boolean;
  onDone(): void;
  send(dealsRemaining: number): void;
};

type State = {
  dealsRemaining: number;
};

class SetDealAccountDialog extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      dealsRemaining: SetDealAccountDialog.defaultDealsRemaining(),
    };
  }

  private static defaultDealsRemaining(): number {
    return moment().daysInMonth() - moment().date() + 1;
  }

  public render(): React.ReactElement {
    const { classes, company, open, onDone, send } = this.props;
    const { dealsRemaining } = this.state;

    return (
      <Dialog open={open}
              onBackdropClick={() => onDone()}
              onEscapeKeyDown={() => onDone()}
      >
        <DialogTitle>
          <Typography variant="h6">Set Deal Account for &quot;{company.contact.title}&quot;</Typography>
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogContent}>
            <TextField label="Deals Remaining"
                       value={dealsRemaining}
                       onChange={(event) => this.onChange(event.target.value)}
            />
            <IconButton onClick={() => this.setDealsRemaining()}
            >
              <Tooltip title="Reset to Default">
                <ResetIcon/>
              </Tooltip>
            </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained"
                  onClick={() => {
                    this.setDealsRemaining();
                    onDone();
                  }}
          >
            Cancel
          </Button>
          <Button variant="contained"
                  color="primary"
                  onClick={() => send(dealsRemaining)}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private setDealsRemaining(dealsRemaining?: number): void {
    if (dealsRemaining !== undefined) {
      this.setState({ dealsRemaining });
    } else {
      this.setState({ dealsRemaining: SetDealAccountDialog.defaultDealsRemaining() });
    }
  }

  private onChange(rawValue: string): void {
    const value = rawValue.replace(/\D/g, '');

    this.setDealsRemaining(parseInt(value, 10));
  }
}

export default withStyles(styles)(SetDealAccountDialog);
