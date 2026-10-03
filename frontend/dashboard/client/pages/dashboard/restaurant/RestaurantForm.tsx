import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                from '@material-ui/core';
import { green } from '@material-ui/core/colors';

import { Loading }                from '@my-old-startup/frontend-common/components';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import { authenticationService }  from '@my-old-startup/frontend-common/services/AuthenticationService';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { FrontendError }          from '../../../../../../common/error/FrontendError';
import { IApiCompany }            from '../../../../../../common/interfaces';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { companyStore }           from '../../../stores/CompanyStore';
import { fullHeight }             from '../../../styles/common';
import { CompanyContactCard }     from './CompanyContactCard';
import { CompanyDetailsCard }     from './CompanyDetailsCard';
import { CompanyImagesCard }      from './CompanyImagesCard';
import { CompanyMap }             from './CompanyMap';
import { FastNavigationButtons }  from './FastNavigationButtons';

const styles = (theme: Theme) => createStyles({
                                                container:       {
                                                  display:  'flex',
                                                  flexWrap: 'wrap',
                                                },
                                                card:            fullHeight,
                                                buttonCard:      {
                                                  flexBasis:  '100%',
                                                  flexGrow:   5,
                                                  minWidth:   100,
                                                  '& button': {
                                                    fontSize: theme.typography.subtitle1.fontSize,
                                                  },
                                                },
                                                button:          {
                                                  margin: theme.spacing(1),
                                                },
                                                leftIcon:        {
                                                  marginRight: theme.spacing(1),
                                                },
                                                actions:         {
                                                  flexDirection: 'row-reverse',
                                                },
                                                icon:            {
                                                  color:    green[500],
                                                  fontSize: theme.typography.h1.fontSize,
                                                },
                                                backgroundImage: {
                                                  objectFit: 'cover',
                                                  height:    140,
                                                },
                                                logoImage:       {
                                                  width:     140,
                                                  margin:    '0 auto',
                                                  objectFit: 'cover',
                                                },
                                                cardGrid:        {
                                                  height:                         '768px',
                                                  width:                          '100%',
                                                  [theme.breakpoints.down('md')]: {
                                                    height: '80vh',
                                                  },
                                                },
                                                cardGridItem:    {
                                                  // Fix for iOS 10
                                                  height: '100%',
                                                },
                                              });

type Props = WithStyles<typeof styles>;

@observer
class _RestaurantForm extends React.Component<Props> {

  public render(): JSX.Element {
    const { classes }     = this.props;
    const currentCompany  = companyStore.currentCompany;
    const isLoggedInAdmin = authenticationService.isLoggedInAdmin();

    if (currentCompany === undefined) {
      return <Loading/>;
    }

    return (
      <Grid container alignItems="stretch" spacing={2}>
        <Grid item md={12}>
          <FastNavigationButtons company={currentCompany} route={DashboardRoutes.Restaurant}/>
        </Grid>
        <Grid item md={12} lg={6}>
          <CompanyContactCard isLoggedInAdmin={isLoggedInAdmin}
                              successMessage={locale.forms.apiCompanyContact.saveMessage}
                              onSubmit={() => this.saveContact(currentCompany)}
          />
        </Grid>

        <Grid item md={12} lg={6}>
          <CompanyDetailsCard/>
        </Grid>

        <Grid item md={12} lg={6}>
          <CompanyImagesCard company={currentCompany} onImageChange={() => {
            void this.saveImages(currentCompany);
          }}/>
        </Grid>

        <Grid item md={12} lg={6}>
          <Card className={classes.card}>
            <CardHeader title={locale.dashboard.companyPage.mapHeader}/>

            <CardContent>
              <Grid container spacing={3} className={classes.cardGrid}>
                <Grid item xs={12} className={classes.cardGridItem}>
                  <CompanyMap companyLocation={currentCompany.location} type={currentCompany!.contact.type}/>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  private async saveImages({ images, id }: IApiCompany): Promise<void> {
    await dashboardCompanyFacade.updateImages(images, id);

    globalMessageService.pushMessage(
      {
        message: locale.forms.apiCompanyImages.saveMessage,
        variant: 'success',
      },
    );
  }

  private async saveContact(company: IApiCompany): Promise<void> {
    const isLoggedInAdmin = authenticationService.isLoggedInAdmin();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const companyOptionalInfo = companyStore.currentCompanyOptionalInfo!;

    if (isLoggedInAdmin) {
      try {
        await dashboardCompanyFacade.updateContact(company.contact, company.id);

      } catch (error) {
        // TODO: Extract handle FrontenError
        const { errorResponse, statusCode } = error as FrontendError;

        const localeError = errorResponse
          ? locale.common.error.errorCode[errorResponse.errorCode]
          : locale.common.error.statusCode[statusCode];

        globalMessageService.pushMessage(
          {
            message: localeError || error.toString(),
            variant: 'error',
          },
        );
throw error;
      }

    } else {
      // eslint-disable-next-line require-atomic-updates
      companyStore.currentCompany = await dashboardCompanyFacade.updateOptional(companyOptionalInfo,
                                                                                company.id);
    }
  }
}

export const RestaurantForm = withStyles(styles)(_RestaurantForm);
