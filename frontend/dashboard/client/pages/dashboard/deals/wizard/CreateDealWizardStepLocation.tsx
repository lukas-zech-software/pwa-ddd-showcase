import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
}                                from '@material-ui/core';
import { warningCard }           from '@my-old-startup/frontend-common/style';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
import { locale }                from '../../../../common/locales';
import { companyStore }          from '../../../../stores/CompanyStore';
import { fullHeight }            from '../../../../styles/common';
import { DealMap }               from '../DealMap';
import { createDealWizardStore } from './CreateDealWizardStore';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        header:              {
          paddingLeft: 0,
        },
        card:                {
          ...fullHeight,
          marginTop: theme.spacing(4),
          minHeight: theme.spacing(63),
        },
        warningCard:         warningCard(theme),
        locationCardContent: {
          padding: 0,
          height:  '60vh',
        },
      },
    ),
);

type Props = {
  validate: boolean;
};

export function CreateDealWizardStepLocation(props: Props): JSX.Element {
  const classes  = useStyles();
  const errors   = props.validate ? createDealWizardStore.validateLocation() : [];
  const hasError = errors.length !== 0;
  const deal     = createDealWizardStore.deal;
  const company  = companyStore.currentCompany!;

  if (deal.location === undefined) {
    createDealWizardStore.setLocation({ location: company.location });
  }

  return useObserver(() => (
    <Card elevation={0} className={classes.card}>
      <CardHeader className={classes.header} title={
        <Typography variant="body1">
          {locale.dashboard.dealsPage.location.error}
        </Typography>}/>

      <CardContent className={classes.locationCardContent}>
        <DealMap companyLocation={company.location}
                 dealLocation={deal.location ? deal.location.location : company.location}
                 onMarkerSet={(location, address) => {
                   createDealWizardStore.setLocation(
                     {
                       location,
                       address,
                     },
                   );
                 }}/>
      </CardContent>
      {hasError && (
        <CardHeader subheader={
          <Typography color="error" variant="caption">
            {locale.dashboard.dealsPage.location.error}
          </Typography>}/>
      )}
    </Card>
  ));
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

export function CreateDealWizardStepLocationHelp(): JSX.Element {
  const classes = useStylesHelp();

  return (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.forms.apiDealLocation.fields.location}
        </Typography>
        <Typography variant="body2">
          {locale.forms.apiDealLocation.tooltips.location}
        </Typography>
      </Grid>
    </Grid>
  );
}

