import { Card, CardContent, CardHeader, createStyles, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Loading }
  from '@my-old-startup/frontend-common/components';
import { observer }           from 'mobx-react';
import * as React             from 'react';
import { CompanyFormField }   from '../../common/company/CompanyFormField';
import { CompanyPhoneField }  from '../../common/company/CompanyPhoneField';
import { locale }             from '../../common/locales';
import { getValidationError } from '../../common/utils/utils';
import { companyStore }       from '../../stores/CompanyStore';
import { fullHeight }         from '../../styles/common';

const styles = (theme: Theme) => createStyles({
  card: {
    ...fullHeight,
    margin: theme.spacing(0),
  },

});

type Props = WithStyles<typeof styles> & {};

const userContactCard: React.FunctionComponent<Props> = (props: Props): React.ReactElement => {
  const { classes } = props;
  const contact     = companyStore.companyUserContact;
  const errors      = companyStore.companyUserContactValidationError;

  if (contact === undefined) {
    return <Loading/>;
  }

  return (
    <Card className={classes.card}>
      <CardHeader title={locale.forms.apiUserContact.header} subheader={locale.forms.apiUserContact.subheader}/>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CompanyFormField errorMessage={getValidationError(errors, 'firstName')}
                              value={contact.firstName}
                              propertyName="firstName"
                              onValueChange={(value) => (contact.firstName = value)}
                              label={locale.forms.apiUserContact.fields.firstName}
                              tooltip={locale.forms.apiUserContact.tooltips.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CompanyFormField errorMessage={getValidationError(errors, 'lastName')}
                              value={contact.lastName}
                              propertyName="lastName"
                              onValueChange={(value) => (contact.lastName = value)}
                              label={locale.forms.apiUserContact.fields.lastName}
                              tooltip={locale.forms.apiUserContact.tooltips.lastName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CompanyPhoneField errorMessage={getValidationError(errors, 'telephone')}
                               value={contact.telephone}
                               propertyName="telephone"
                               onValueChange={(value:string) => (contact.telephone = value)}
                               label={locale.forms.apiUserContact.fields.telephone}
                               tooltip={locale.forms.apiUserContact.tooltips.telephone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CompanyFormField errorMessage={getValidationError(errors, 'email')}
                              value={contact.email}
                              propertyName="email"
                              onValueChange={(value) => (contact.email = value)}
                              label={locale.forms.apiUserContact.fields.email}
                              tooltip={locale.forms.apiUserContact.tooltips.email}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const UserContactCard = withStyles(styles)(observer(userContactCard));
