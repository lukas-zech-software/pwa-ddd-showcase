import {
  Button,
  Card,
  CardContent,
  createStyles,
  Dialog,
  DialogActions,
  DialogContentText,
  Theme,
  Typography,
  WithStyles,
  withStyles,
  withWidth,
}                                from '@material-ui/core';
import { WithWidth }             from '@material-ui/core/withWidth';
import {
  IApiCompany,
  IApiDeal,
}                                from '@my-old-startup/common/interfaces';
import { RawHtml }               from '@my-old-startup/frontend-common/components';
import { observer }              from 'mobx-react';
import * as React                from 'react';
import { createDealWizardStore } from '../../pages/dashboard/deals/wizard/CreateDealWizardStore';
import { dealAccountStore }      from '../../stores/DealAccountStore';
import { locale }                from '../locales';
import { DealDetailPreview }     from './DealDetailPreview';
import { DealsRemainingWarning } from './DealsRemainingWarning';

export function hasInsufficientBalance(): boolean {
  const dealsRemaining    = dealAccountStore.dealsRemaining;
  const publishTimestamps = createDealWizardStore.publishTimestamps;

  const dealCount = publishTimestamps.length;
  return dealsRemaining <= 0 || dealCount > dealsRemaining;
}

const styles = (theme: Theme) =>
  createStyles(
    {
      dialogBox:              {
        padding: theme.spacing(1),
        zIndex:  999,
      },
      cardContent:            {
        paddingBottom: '0 !important',
      },
      hasInsufficientBalance: {
        color:        theme.palette.error.main,
        marginBottom: theme.spacing(3),
      },
    },
  );

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
  deal: IApiDeal;
} & WithWidth;

type State = {
  isReviewDialogOpen: boolean
}

/**
 * Confirms that a restaurant wishes to use a non-refundable deal
 */
@observer
class _DealPublishConfirmationCard extends React.Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      isReviewDialogOpen: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    return dealAccountStore.refresh();
  }

  public render(): React.ReactNode {
    const { deal, classes, company, width } = this.props;

    const dealsRemaining    = dealAccountStore.dealsRemaining;
    const publishTimestamps = createDealWizardStore.publishTimestamps;

    const dealCount = publishTimestamps.length;

    return (
      <>
        <Card elevation={0}>
          <CardContent className={classes.cardContent}>

            <DealsRemainingWarning dealsRemaining={dealsRemaining}/>

            {dealCount !== 0 && (
              <DialogContentText component={'div' as any}>
                <Typography color="textPrimary">
                  <RawHtml>
                    {locale.dashboard.dialogs.dealPublishConfirmation.bulkPublishHint(dealCount)}
                  </RawHtml>
                </Typography>
              </DialogContentText>
            )}

            {deal.isStatic === true && (
              <DialogContentText component={'div' as any}>
                <Typography color="textPrimary">
                  <RawHtml>
                    {locale.createDealWizard.summary.help.static}
                  </RawHtml>
                </Typography>
              </DialogContentText>
            )}

            {hasInsufficientBalance() && (
              <DialogContentText component={'div' as any}>
                <Typography color="textPrimary" className={classes.hasInsufficientBalance}>
                  <RawHtml>
                    {locale.dashboard.dialogs.dealPublishConfirmation.notEnoughCreditsHint(dealCount, dealsRemaining)}
                  </RawHtml>
                </Typography>
              </DialogContentText>
            )}

            <DialogActions style={{ justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={() => this.setState({ isReviewDialogOpen: true })}>
                {locale.dashboard.dialogs.dealPublishConfirmation.preview}
              </Button>
            </DialogActions>
          </CardContent>
        </Card>
        <Dialog
          open={this.state.isReviewDialogOpen}
          fullScreen={width === 'xs'}
          onClick={() => this.setState({ isReviewDialogOpen: false })}
          onClose={() => this.setState({ isReviewDialogOpen: false })}>
          <DealDetailPreview deal={deal} company={company}/>
        </Dialog>
      </>
    );
  }
}

export const DealPublishConfirmationCard = withWidth()(withStyles(styles)(_DealPublishConfirmationCard));
