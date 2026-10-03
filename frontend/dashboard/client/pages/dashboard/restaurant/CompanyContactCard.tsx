import { createStyles, Fab, Grid, TextField, Theme, withStyles, WithStyles }
  from '@material-ui/core';
import { OpenInNew }            from '@material-ui/icons';
import { Loading }              from '@my-old-startup/frontend-common/components/Loading';
import { COMPANY_ROUTES }       from '@my-old-startup/frontend-common/routes';
import { globalMessageService } from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }             from 'mobx-react';
import * as React               from 'react';
import { CompanyFormField }     from '../../../common/company/CompanyFormField';
import { CompanyPhoneField }    from '../../../common/company/CompanyPhoneField';
import { CompanyTypeSelect }    from '../../../common/company/CompanyTypeSelect';
import { locale }               from '../../../common/locales';
import {
  getValidationError,
} from '../../../common/utils/utils';
import { BaseCompanyFormCard }  from '../../../form/BaseCompanyFormCard';
import { routeService }         from '../../../services/CdbRouteService';
import { companyStore }         from '../../../stores/CompanyStore';

const styles = (theme: Theme) => createStyles({
  extendedFabIcon: {
    marginRight: theme.spacing(1),
  },
});

type Props = {
  successMessage?: string;
  isLoggedInAdmin: boolean;
  hasWarning?: boolean;

  onSubmit(): Promise<void>;
} & WithStyles<typeof styles>;

@observer
class _CompanyContactCard extends React.Component<Props> {
  public render(): JSX.Element {
    const { isLoggedInAdmin, hasWarning, classes } = this.props;
    const company                                  = companyStore.currentCompany;
    const errors                                   = companyStore.contactValidationError;

    if (company === undefined) {
      return <Loading/>;
    }

    let isDirty = false;
    if (companyStore.isDirty) {
      isDirty = companyStore.checkDirty(Object.keys(company.contact));
    }

    return (
      <BaseCompanyFormCard
        header={locale.forms.apiCompanyContact.header}
        hasWarning={hasWarning}
        isDirty={isDirty}
        submit={() => this.onSubmit()}
      >

        <Grid container spacing={3}>

          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'title')}
              value={company.contact.title || ''}
              propertyName="title"
              onValueChange={(value) => company.contact.title = value}
              label={locale.forms.apiCompanyContact.fields.title}
              disabled={!isLoggedInAdmin}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'address')}
              value={company.contact.address || ''}
              propertyName="address"
              onValueChange={(value) => company.contact.address = value}
              label={locale.forms.apiCompanyContact.fields.address}
              disabled={!isLoggedInAdmin}
            />

          </Grid>

          <Grid item  xs={12} sm={4}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'zipCode')}
              value={company.contact.zipCode || ''}
              propertyName="zipCode"
              onValueChange={(value) => company.contact.zipCode = value}
              label={locale.forms.apiCompanyContact.fields.zipCode}
              disabled={!isLoggedInAdmin}
            />
          </Grid>
          <Grid item  xs={12} sm={8}>
            <TextField
              disabled
              fullWidth
              defaultValue={company.contact.city}
              label={locale.forms.apiCompanyContact.fields.city}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyTypeSelect disabled={!isLoggedInAdmin}/>
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'email')}
              value={company.contact.email || ''}
              propertyName="email"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.email = value}
              label={locale.forms.apiCompanyContact.fields.email}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyPhoneField
              errorMessage={getValidationError(errors, 'telephone')}
              value={company.contact.telephone || ''}
              propertyName="telephone"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.telephone = value}
              label={locale.forms.apiCompanyContact.fields.telephone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CompanyPhoneField
              errorMessage={getValidationError(errors, 'secondaryTelephone')}
              value={company.contact.secondaryTelephone || ''}
              propertyName="telephone"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.secondaryTelephone = value}
              label={locale.forms.apiCompanyContact.fields.secondaryTelephone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'secondaryTelephoneReason')}
              value={company.contact.secondaryTelephoneReason || ''}
              propertyName="secondaryTelephoneReason"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.secondaryTelephoneReason = value}
              label={locale.forms.apiCompanyContact.fields.secondaryTelephoneReason}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'website')}
              value={company.contact.website || ''}
              propertyName="website"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.website = value}
              label={locale.forms.apiCompanyContact.fields.website}
            />
          </Grid>

         {/* CORONA <Grid item xs={12}>
            <CompanyFormField
              errorMessage={undefined}
              value={company.couponCode}
              propertyName="website"
              disabled
              onValueChange={() => void 0}
              label={locale.forms.apiCompanyContact.couponCode}
            />
          </Grid>*/}

        </Grid>
      </BaseCompanyFormCard>
    );
  }

  private async onSubmit(): Promise<void> {
    await this.props.onSubmit().then(() => {
      if (this.props.successMessage) {
        globalMessageService.pushMessage({ message: this.props.successMessage, variant: 'success' });
      }
    }).catch(() => {
      // Force update to show first validation errors
      this.forceUpdate();
    });
  }
}

export const CompanyContactCard = withStyles(styles)(_CompanyContactCard);
