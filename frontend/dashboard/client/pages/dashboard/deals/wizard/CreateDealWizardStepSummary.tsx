import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
}                                      from '@material-ui/core';
import * as React                      from 'react';
import { DealPublishConfirmationCard } from '../../../../common/deal/DealPublishConfirmationCard';
import { locale }                      from '../../../../common/locales';
import { companyStore }                from '../../../../stores/CompanyStore';
import { createDealWizardStore }       from './CreateDealWizardStore';

export function CreateDealWizardStepSummary(): JSX.Element {
  const company = companyStore.currentCompany!;
  const deal    = createDealWizardStore.deal;

  return (
    <DealPublishConfirmationCard company={company} deal={deal}/>
  );
}

const useStylesHelp = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        helpLine: {
          marginBottom: theme.spacing(3),
        },
      },
    ),
);

export function CreateDealWizardStepSummaryHelp(): JSX.Element {
  const classes = useStylesHelp();

  return (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.summary.header.publish}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.summary.help.publish}
        </Typography>
      </Grid>

      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.summary.header.static}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.summary.help.static}
        </Typography>
      </Grid>

      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.summary.header.preview}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.summary.help.preview}
        </Typography>
      </Grid>
    </Grid>
  );
}

