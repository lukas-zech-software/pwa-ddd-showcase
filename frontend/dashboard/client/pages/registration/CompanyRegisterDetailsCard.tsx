import {
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                    from '@material-ui/core';
import { Loading }                   from '@my-old-startup/frontend-common/components';
import { observer }                  from 'mobx-react';
import * as React                    from 'react';
import { CompanyFormField }          from '../../common/company/CompanyFormField';
import { CompanyTagSelect }          from '../../common/company/CompanyTagsSelect';
import { locale }                    from '../../common/locales';
import { getValidationError }        from '../../common/utils/utils';
import { BaseCompanyFormCard }       from '../../form/BaseCompanyFormCard';
import { companyStore }              from '../../stores/CompanyStore';
import { CompanySocialMedia }        from '../dashboard/restaurant/CompanySocialMedia';
import { CoronaCouponsDetailsCard }  from '../dashboard/restaurant/CoronaCouponDetailsCard';
import { CoronaDeliveryDetailsCard } from '../dashboard/restaurant/CoronaDeliveryDetailsCard';
import { CoronaTakeAwayDetailsCard } from '../dashboard/restaurant/CoronaTakeAwayDetailsCard';
import { CompanyOpeningHoursPicker } from '../dashboard/restaurant/openingHours/CompanyOpeningHoursPicker';

const styles = (theme: Theme) => createStyles({
                                                checkboxLine: {
                                                  padding: '0 !important',

                                                },
                                                checkboxForm: {
                                                  margin:     0,
                                                  marginLeft: theme.spacing(1),
                                                },
                                                card:         {
                                                  margin: theme.spacing(0),
                                                },
                                              });

type Props = {} & WithStyles<typeof styles>;

@observer
class _CompanyRegisterDetailsCard extends React.Component<Props> {
  public render(): JSX.Element {
    const { classes } = this.props;
    const company     = companyStore.currentCompany;
    const errors      = companyStore.contactValidationError;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <BaseCompanyFormCard
        subForm
        className={classes.card}
        header={locale.forms.apiCompanyDetails.register.header}
        subheader={locale.forms.apiCompanyDetails.register.subHeader}
        submit={() => void 0}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'description')}
              value={company.details.description || ''}
              propertyName="description"
              onValueChange={(value) => (company.details.description = value)}
              label={locale.forms.apiCompanyDetails.fields.description}
              tooltip={locale.forms.apiCompanyDetails.tooltips.description}
              multiline
              rows="10"/>
          </Grid>

          <Grid item xs={12}>
            <CompanyTagSelect/>
          </Grid>

          <Grid item xs={12}>
            <CompanyOpeningHoursPicker company={company} defaultOpen={false}/>
          </Grid>

          <Grid item xs={12}>
            <CompanySocialMedia/>
          </Grid>

        </Grid>
      </BaseCompanyFormCard>
    );
  }
}

export const CompanyRegisterDetailsCard = withStyles(styles)(_CompanyRegisterDetailsCard);
