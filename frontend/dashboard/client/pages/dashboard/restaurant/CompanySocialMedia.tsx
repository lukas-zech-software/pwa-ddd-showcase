import {
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                  from '@material-ui/core';
import { ExpandMore }              from '@material-ui/icons';
import { Loading }                 from '@my-old-startup/frontend-common/components';
import { observer }                from 'mobx-react';
import * as React                  from 'react';
import { CompanySocialMediaField } from '../../../common/company/CompanySocialMediaField';
import { FormTooltip }             from '../../../common/FormTooltip';
import { locale }                  from '../../../common/locales';
import { getValidationError }      from '../../../common/utils/utils';
import { companyStore }            from '../../../stores/CompanyStore';

const styles = (theme: Theme) => createStyles({
  root:             {
    width: '100%',
  },
  heading:          {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color:    theme.palette.text.secondary,
  },
  details:          {
    alignItems: 'center',
  },
  platformGrid:     {
    alignItems: 'flex-end',
  },
  socialMediaIcon:  {
    width:      25,
    marginLeft: theme.spacing(1),
  },
});

type Props = WithStyles<typeof styles>;

@observer
class _CompanySocialMedia extends React.Component<Props> {

  public render(): JSX.Element {
    const { classes } = this.props;
    const company     = companyStore.currentCompany;
    const errors      = companyStore.detailsValidationError;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography component={'div' as any}
                            className={classes.heading}>{locale.forms.apiCompanyDetails.socialMediaForm.header}
                  <FormTooltip inline title={locale.forms.apiCompanyDetails.socialMediaForm.tooltip}/>
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.secondaryHeading}>
                  {locale.forms.apiCompanyDetails.socialMediaForm.hint}
                </Typography>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails className={classes.details}>
            <Grid container spacing={3} className={classes.platformGrid}>
              <Grid item xs={2}>
                <img src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/facebook.png"
                     className={classes.socialMediaIcon}
                     alt="Facebook"/>
              </Grid>

              <Grid item xs={10}>
                <CompanySocialMediaField
                  errorMessage={getValidationError(errors, 'facebook')}
                  value={company.details.facebook || ''}
                  propertyName="facebook"
                  emptyStringToUndefined
                  onValueChange={(value) => company.details.facebook = value}
                  label={locale.forms.apiCompanyDetails.socialMediaForm.platforms.facebook}
                />

              </Grid>

              <Grid item xs={2}>
                <img src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/instagram.png"
                     className={classes.socialMediaIcon}
                     alt="instagram"/>
              </Grid>

              <Grid item xs={10}>
                <CompanySocialMediaField
                  errorMessage={getValidationError(errors, 'instagram')}
                  value={company.details.instagram || ''}
                  propertyName="instagram"
                  emptyStringToUndefined
                  onValueChange={(value) => company.details.instagram = value}
                  label={locale.forms.apiCompanyDetails.socialMediaForm.platforms.instagram}
                />

              </Grid>

              <Grid item xs={2}>
                <img src="https://storage.googleapis.com/static.my-old-startups-domain.de/images/social/twitter.png"
                     className={classes.socialMediaIcon}
                     alt="twitter"/>
              </Grid>

              <Grid item xs={10}>
                <CompanySocialMediaField
                  errorMessage={getValidationError(errors, 'twitter')}
                  value={company.details.twitter || ''}
                  propertyName="twitter"
                  emptyStringToUndefined
                  onValueChange={(value) => company.details.twitter = value}
                  label={locale.forms.apiCompanyDetails.socialMediaForm.platforms.twitter}
                />

              </Grid>

            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export const CompanySocialMedia = withStyles(styles)(_CompanySocialMedia);
