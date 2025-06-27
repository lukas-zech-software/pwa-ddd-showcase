import {
  createStyles,
  Grid,
  Hidden,
  Paper,
  Theme,
  withStyles,
  WithStyles,
}                                     from '@material-ui/core';
import { green }                      from '@material-ui/core/colors';
import { ErrorCode }                  from '@my-old-startup/common/error/ErrorCode';
import { Loading }                    from '@my-old-startup/frontend-common/components';
import { DashboardRoutes }            from '@my-old-startup/frontend-common/routes';
import { authenticationService }      from '@my-old-startup/frontend-common/services/AuthenticationService';
import { globalMessageService }       from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { centerCard }                 from '@my-old-startup/frontend-common/style';
import clsx                           from 'clsx';
import { runInAction }                from 'mobx';
import { observer }                   from 'mobx-react';
import * as React                     from 'react';
import { CompanyFormCheckbox }        from '../../common/company/CompanyFormField';
import { locale }                     from '../../common/locales';
import { getValidationError }         from '../../common/utils/utils';
import { WelcomeCard }                from '../../common/WelcomeCard';
import { dashboardCompanyFacade }     from '../../facade/DashboardCompanyFacade';
import { BaseCompanyFormCard }        from '../../form/BaseCompanyFormCard';
import { routeService }               from '../../services/CdbRouteService';
import { companyStore }               from '../../stores/CompanyStore';
import { allCompaniesStore }          from './AllCompaniesStore';
import { CompanyRegisterCard }        from './CompanyRegisterCard';
import { CompanyRegisterCoronaCard }  from './CompanyRegisterCoronaCard';
import { CompanyRegisterDetailsCard } from './CompanyRegisterDetailsCard';
import { UserContactCard }            from './UserContactCard';

let count = 0;

async function tryGetCompany() {
  try {

    count += 1;

    if (count === 5) {
      try {
        await authenticationService.logOutHard();
      } catch (e) {
        console.warn('Error logging out', e);
      }
      routeService.routeTo(DashboardRoutes.Login);
      return;
    }

    try {
      companyStore.clearDirty();

      await authenticationService.renewToken();
      await allCompaniesStore.loadCompanies();
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (e) {
      console.warn('Not authorized yet', e);
    }

    if (companyStore.currentCompany !== undefined) {
      routeService.routeTo(DashboardRoutes.Welcome);
    } else {
      setTimeout(tryGetCompany, 1500);
    }
  } catch (error) {
    console.error('Error logging in after regiser', error);
    window.location.reload();
  }
}

const styles = (theme: Theme) => createStyles({
                                                background: {
                                                  marginTop:            '-60px',
                                                  paddingTop:           theme.spacing(6),
                                                  paddingBottom:        theme.spacing(3),
                                                  height:               '100%',
                                                  width:                '100%',
                                                  backgroundImage:      'url("https://storage.googleapis.com/static.my-old-startups-domain.de/images/registration_form_background.jpg?v1")',
                                                  backgroundPosition:   'center',
                                                  backgroundRepeat:     'no-repeat',
                                                  backgroundSize:       'cover',
                                                  backgroundAttachment: 'fixed',
                                                },

                                                container:    {
                                                  display:  'flex',
                                                  flexWrap: 'wrap',
                                                },
                                                card:         {
                                                  ...centerCard(theme),
                                                  width:     '55%',
                                                  marginTop: theme.spacing(-3),
                                                },
                                                cardTop:      {
                                                  marginTop: theme.spacing(5),
                                                },
                                                actions:      {
                                                  flexDirection: 'row-reverse',
                                                },
                                                button:       {
                                                  margin: theme.spacing(1),
                                                },
                                                icon:         {
                                                  color:    green[500],
                                                  fontSize: theme.typography.h1.fontSize,
                                                },
                                                checkboxLine: {
                                                  padding: '0 !important',

                                                },
                                                checkboxForm: {
                                                  margin:     0,
                                                  marginLeft: theme.spacing(1),
                                                },
                                                buttonCard:   {
                                                  margin: 0,
                                                },

                                              });

type Props = WithStyles<typeof styles>;

type State = {
  wasSuccessful: boolean | undefined;
};

@observer
class _RegistrationForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      wasSuccessful: undefined,
    };
  }

  public componentWillMount(): void {
      let email         = '';
      const userProfile = authenticationService.getAuthUserProfile();

      if (userProfile !== null && userProfile.email !== undefined) {
        email = userProfile.email;
      }

      companyStore.companyUserContact = {
        email,
        firstName: '',
        lastName:  '',
        telephone: '',
      };

      const newCompany = {
        id:      undefined,
        contact: {},
        details: {},
        status:  {},
        corona:  {
          openRestrictions: {
            indoor: true,
          },
        },
      };

      // An empty company cannot be valid from the beginning
      companyStore.isValidationEnabled = false;
      companyStore.currentCompany      = newCompany as any;
    }

    public render(): JSX.Element {
      const { classes } = this.props;

      if (this.state.wasSuccessful === true) {
        // CORONA

        // wait until API processed registration

        setTimeout(tryGetCompany, 1500);

        return <Loading/>;
        /*return (
          <>
            <Card className={clsx(classes.card, classes.cardTop)}>
              <CardMediaFix
                image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/registration_success.jpg"
                title={locale.registrationForm.header}
              />
              <CardHeader title={locale.registrationForm.header}/>
              <CardContent>
                <Typography variant="body2">
                  {locale.registrationForm.successMessage}
                </Typography>
              </CardContent>
            </Card>
          </>
        );*/
      }

      const company = companyStore.currentCompany;
      const errors  = companyStore.contactValidationError;

      if (company === undefined) {
        return <Loading/>;
      }

      return (
        <div className={classes.background}>
          <Paper elevation={0} className={clsx(classes.card, classes.cardTop)}>
            <WelcomeCard/>
          </Paper>

          <Paper elevation={0} className={classes.card}>
            <UserContactCard/>
          </Paper>

          <Paper elevation={0} className={classes.card}>
            <CompanyRegisterCard/>
          </Paper>

          <Paper elevation={0} className={classes.card}>
            <CompanyRegisterCoronaCard/>
          </Paper>

          <Paper elevation={0} className={classes.card}>
            <CompanyRegisterDetailsCard/>
          </Paper>

          <Paper elevation={0} className={classes.card}>
            <BaseCompanyFormCard
              className={classes.buttonCard}
              header={null}
              subheader={locale.forms.apiCompanyDetails.register.support}
              submit={() => this.send()}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} className={classes.checkboxLine}>
                  <CompanyFormCheckbox
                    className={classes.checkboxForm}
                    errorMessage=""
                    label={locale.forms.apiCompanyContact.fields.hasSubscribedToNewsletter}
                    value={company.contact.hasSubscribedToNewsletter || false}
                    propertyName={'hasSubscribedToNewsletter'}
                    onCheckboxChange={(value: boolean) => {
                      company.contact.hasSubscribedToNewsletter = value;
                    }}
                  />
                </Grid>

                <Hidden smUp>
                  <Grid item xs={12} className={classes.checkboxLine}>
                  </Grid>
                </Hidden>

                <Grid item xs={12} className={classes.checkboxLine}>
                  <CompanyFormCheckbox
                    className={classes.checkboxForm}
                    errorMessage={getValidationError(errors, 'hasAcceptedTerms')}
                    label={locale.forms.apiCompanyContact.fields.hasAcceptedTerms}
                    value={company.contact.hasAcceptedTerms || false}
                    propertyName={'hasAcceptedTerms'}
                    onCheckboxChange={(value: boolean) => {
                      company.contact.hasAcceptedTerms = value;
                    }}
                  />
                </Grid>
              </Grid>
            </BaseCompanyFormCard>
          </Paper>
        </div>
      );
    }

    private async send(): Promise<void> {
      // Force update
      await new Promise(resolve => runInAction(() => {
        companyStore.isValidationEnabled = false;
        resolve();
      }));

      companyStore.isValidationEnabled = true;

      if (companyStore.contactValidationError.length !== 0 ||
        companyStore.companyUserContactValidationError.length !== 0 ||
        companyStore.currentCompany === undefined ||
        companyStore.companyUserContact === undefined) {
        return Promise.reject();
      }

      try {
        await dashboardCompanyFacade.registerCompany({
                                                       companyContact: companyStore.currentCompany.contact,
                                                       companyDetails: companyStore.currentCompany.details,
                                                       companyCorona: companyStore.currentCompany.corona,
                                                       user:           companyStore.companyUserContact,
                                                     });
        authenticationService.logOut(false);
        this.setState({ wasSuccessful: true });
      } catch (error) {
        // Error case is handled inside CompanyContactCard
        if (error.errorResponse && locale.common.error.errorCode[error.errorResponse.errorCode as ErrorCode]) {
          globalMessageService.pushMessage({
            message: locale.common.error.errorCode[error.errorResponse.errorCode as ErrorCode],
            variant: 'warning',
                                           });
          return;
        }

        globalMessageService.pushMessage({
                                           message: locale.common.error.defaultErrorMessage,
                                           variant: 'error',
                                         });
      }
    }
}


export const RegistrationForm = withStyles(styles)(_RegistrationForm);
