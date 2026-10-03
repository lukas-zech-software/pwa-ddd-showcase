import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  Theme,
  WithStyles,
  withStyles,
}                           from '@material-ui/core';
import {
  IApiCompany,
  IApiDeal,
}                           from '@my-old-startup/common/interfaces';
import { ApiDeal }          from '@my-old-startup/common/validation';
import { plainToClass }     from 'class-transformer';
import { observer }         from 'mobx-react';
import * as React           from 'react';
import { dealAccountStore } from '../../stores/DealAccountStore';
import { locale }           from '../locales';
import {
  DealPublishConfirmationCard,
  hasInsufficientBalance,
}                           from './DealPublishConfirmationCard';

const styles = (theme: Theme) =>
  createStyles(
    {
      dialogBox: {
        padding: theme.spacing(1),
        zIndex:  999,
      },
      ok:        {
        // TODO: No idea whz this loads the wrong theme, check after migrating to v4
        backgroundColor: theme.palette.primary.main,
        color:           theme.palette.text.primary,
        marginRight:     theme.spacing(1),
      },
    },
  );

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
  deal: IApiDeal;
  isOpen: boolean;

  onCancel: () => void;
  onOk: () => void;
};

/**
 * Confirms that a restaurant wishes to use a non-refundable deal
 */
@observer
class _DealPublishConfirmationDialog extends React.Component<Props> {
  public async componentDidMount(): Promise<void> {
    return dealAccountStore.refresh();
  }

  public render(): React.ReactNode {
    const { isOpen, deal, classes, company } = this.props;

    const instance = plainToClass(ApiDeal, deal);

    return (
      <Dialog
        open={isOpen}
        onClose={() => this.onCancel()}
        className={classes.dialogBox}
      >
        <DealPublishConfirmationCard company={company} deal={deal}/>

        <DialogActions>
          <Button variant="contained" onClick={() => this.onCancel()}>
            {locale.common.buttons.cancel}
          </Button>
          <Button
            variant="contained"
            disabled={hasInsufficientBalance() || !instance.canBePublished}
            onClick={() => this.onOk()}
            color="primary" className={classes.ok}>
            {locale.common.buttons.publish}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private onCancel(): void {
    this.props.onCancel();
  }

  private onOk(): void {
    this.props.onOk();
  }
}

export const DealPublishConfirmationDialog = withStyles(styles)(_DealPublishConfirmationDialog);
