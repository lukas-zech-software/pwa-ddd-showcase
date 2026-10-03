import {
  createStyles,
  Grid,
  Hidden,
  Theme,
  withStyles,
  WithStyles,
}                               from '@material-ui/core';
import {
  GoogleMapsAutoCompleteInput,
  Loading,
}                               from '@my-old-startup/frontend-common/components';
import { globalMessageService } from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }             from 'mobx-react';
import * as React               from 'react';
import {
  CompanyFormCheckbox,
  CompanyFormField,
}                                     from '../../common/company/CompanyFormField';
import { CompanyPhoneField }          from '../../common/company/CompanyPhoneField';
import { CompanyTypeSelect }          from '../../common/company/CompanyTypeSelect';
import { FormTooltip }                from '../../common/FormTooltip';
import { locale }                     from '../../common/locales';
import { getValidationError }         from '../../common/utils/utils';
import { BaseCompanyFormCard }        from '../../form/BaseCompanyFormCard';
import { companyStore }               from '../../stores/CompanyStore';
import { CompanyRegisterDetailsCard } from './CompanyRegisterDetailsCard';

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

type Props = {
  successMessage?: string;
} & WithStyles<typeof styles>;

@observer
class _CompanyRegisterCard extends React.Component<Props> {
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
        header={locale.forms.apiCompanyContact.header}
        subheader={locale.forms.apiCompanyContact.subHeader}
        submit={() => void 0}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'title')}
              value={company.contact.title || ''}
              propertyName="title"
              onValueChange={(value) => (company.contact.title = value)}
              label={locale.forms.apiCompanyContact.fields.title}
              tooltip={locale.forms.apiCompanyContact.tooltips.title}
            />
          </Grid>

          <Grid item xs={12}>
            <GoogleMapsAutoCompleteInput
              city={company.contact.city}
              types={['address']}
              errorMessage={getValidationError(errors, 'address')}
              onValueChange={(address, zipCode, city) => {
                if (address) {
                  company.contact.address = address;
                }
                if (zipCode) {
                  company.contact.zipCode = zipCode;
                }
                if (city) {
                  company.contact.city = city;
                }
              }}

              textFieldProps={{
                label:      locale.forms.apiCompanyContact.fields.address,
                InputProps: {
                  endAdornment: (<FormTooltip form title={locale.forms.apiCompanyContact.tooltips.address}/>),
                },
              }}

            />

          </Grid>

          <Grid item xs={12} sm={4}>
            <CompanyFormField
              disabled
              errorMessage={undefined}
              value={company.contact.zipCode || ''}
              propertyName="zipCode"
              onValueChange={() => {
              }}
              label={locale.forms.apiCompanyContact.fields.zipCode}
              tooltip={locale.forms.apiCompanyContact.tooltips.zipCode}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <CompanyFormField
              disabled
              errorMessage={undefined}
              propertyName="city"
              onValueChange={() => {
              }}
              value={company.contact.city||''}
              label={locale.forms.apiCompanyContact.fields.city}
              tooltip={locale.forms.apiCompanyContact.tooltips.city}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyTypeSelect tooltip/>
          </Grid>

          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'email')}
              value={company.contact.email || ''}
              propertyName="email"
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.email = value}
              label={locale.forms.apiCompanyContact.fields.email}
              optional
              tooltip={locale.forms.apiCompanyContact.tooltips.email}
            />
          </Grid>

          <Grid item xs={12}>
            <CompanyPhoneField
              errorMessage={getValidationError(errors, 'telephone')}
              value={company.contact.telephone || ''}
              propertyName="telephone"
              isOptional
              emptyStringToUndefined
              onValueChange={(value: string) => company.contact.telephone = value}
              label={locale.forms.apiCompanyContact.fields.telephone}
              tooltip={locale.forms.apiCompanyContact.tooltips.telephone}
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
              optional
              tooltip={locale.forms.apiCompanyContact.tooltips.website}
            />
          </Grid>
        </Grid>
      </BaseCompanyFormCard>
    );
  }
}

export const CompanyRegisterCard = withStyles(styles)(_CompanyRegisterCard);
