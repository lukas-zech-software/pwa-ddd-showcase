import {
  Typography,
  withStyles,
  WithStyles,
}                                    from '@material-ui/core';
import { IApiCompany }               from '@my-old-startup/common/interfaces';
import { Loading }                   from '@my-old-startup/frontend-common/components/Loading';
import { DashboardRoutes }           from '@my-old-startup/frontend-common/routes';
import { authenticationService }     from '@my-old-startup/frontend-common/services/AuthenticationService';
import { observer }                  from 'mobx-react';
import * as React                    from 'react';
import {
  Redirect,
  Route,
  Switch,
}                                    from 'react-router';
import { ContactPage }               from '../../common/contact/ContactPage';
import { locale }                    from '../../common/locales';
import { routeService }              from '../../services/CdbRouteService';
import { companyStore }              from '../../stores/CompanyStore';
import { allCompaniesStore }         from '../registration/AllCompaniesStore';
import { DashboardAwaitingApproval } from './DashboardAwaitingApproval';
import { DashboardMenu }             from './DashboardMenu';
import { CompanyDishForm }           from './restaurant/CompanyDishesForm';
import { CoronaForm }                from './restaurant/CoronaForm';
import { RestaurantForm }            from './restaurant/RestaurantForm';
import { Welcome }                   from './restaurant/Welcome';

type Props = WithStyles<{}>;

@observer
class _DashboardBase extends React.Component<Props> {

  public componentWillMount(): void {
    void allCompaniesStore.loadCompanies();
  }

  public render(): React.ReactNode {
    if (allCompaniesStore.companies === undefined || companyStore.currentCompany === undefined) {
      return <Loading center/>;
    }

    const companyStatus = this.getCompanyStatusCheck(companyStore.currentCompany);
    if (companyStatus !== null) {
      return companyStatus;
    }

    return (
      <DashboardMenu>
        {this.getContent(companyStore.currentCompany)}
      </DashboardMenu>
    );
  }

  private getCompanyStatusCheck(currentCompany: IApiCompany | undefined): React.ReactNode {
    if (currentCompany === undefined) {
      return null;
    }

    if (currentCompany.status.isApproved === false) {
      // Logout force user to login again, getting new meta data
      // but do not redirect him to login page so he will see the hint
      void authenticationService.logOut(false);
      return <DashboardAwaitingApproval header={locale.dashboard.hints.notApproved.header}
                                        text={locale.dashboard.hints.notApproved.text}/>;
    }

    if (currentCompany.status.isBlocked === true) {
      return <DashboardAwaitingApproval header={locale.dashboard.hints.blocked.header}
                                        text={locale.dashboard.hints.blocked.text}/>;
    }

    return null;
  }

  private getContent(currentCompany: IApiCompany | undefined): JSX.Element {
    if (currentCompany === undefined) {
      return (
        <>
          <Typography>{locale.dashboard.hints.noCompanySelected}</Typography>
        </>
      );
    }

    /* CORONA
    const isNotOnRestaurantPage = !routeService.isRouteActive(DashboardRoutes.Restaurant);

    if (isMissingDetails(currentCompany) && isNotOnRestaurantPage) {
      setTimeout(() => globalMessageService.pushMessage(
        {
          message: locale.dashboard.hints.notCompleted,
          variant: 'warning',
        },
      ));

      return <Redirect to={routeService.getRoute(DashboardRoutes.Restaurant, { companyId: currentCompany.id })}/>;
    }*/

    return (
      <Switch>
        <Route exact
               path={DashboardRoutes.Contact}
               render={() => (
                 <ContactPage email="support@my-old-startups-domain.de"
                              title={locale.dashboard.contactPage.title}
                              bodyParagraphs={locale.dashboard.contactPage.body}
                              showContactOptions
                 />
               )}
        />
        <Route exact
               path={DashboardRoutes.Feedback}
               render={() => (
                 <ContactPage email="feedback@my-old-startups-domain.de"
                              title={locale.dashboard.feedbackPage.title}
                              bodyParagraphs={locale.dashboard.feedbackPage.body}/>
               )}
        />
        <Route exact
               path={DashboardRoutes.Restaurant}
               component={RestaurantForm}/>

        <Route exact
               path={DashboardRoutes.Dishes}
               component={CompanyDishForm}/>

        <Route exact
               path={DashboardRoutes.Corona}
               component={CoronaForm}/>

        <Route exact
               path={DashboardRoutes.Welcome}
               component={Welcome}/>

        {/* CORONA
        <Route exact
               path={DashboardRoutes.Deals}
               component={DealsTableCard}/>

        <Route exact
               path={DashboardRoutes.TemplateDeal}
               render={() => <CreateDealWizardContext mode={WizardMode.TEMPLATE}/>}/>

        <Route exact
               path={DashboardRoutes.NewDeal}
               render={() => <CreateDealWizardContext mode={WizardMode.CREATE}/>}/>

        <Route exact
               path={DashboardRoutes.EditDeal}
               render={() => <CreateDealWizardContext mode={WizardMode.EDIT}/>}/>

        <Route exact
               path={DashboardRoutes.Dashboard}
               render={() => <Dashboard currentCompany={currentCompany}/>}/>*/}

        <Route exact path={DashboardRoutes.Settings} render={() => <Typography>Settings</Typography>}/>
        <Route path={DashboardRoutes.Home} render={() => <Redirect
          to={routeService.getRoute(DashboardRoutes.Corona, { companyId: currentCompany.id })}/>}/>
      </Switch>
    );
  }
}

export const DashboardBase = withStyles({})(_DashboardBase);
