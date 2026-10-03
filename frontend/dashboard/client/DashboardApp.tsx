import {
  WithStyles,
  withStyles,
}                                   from '@material-ui/core';
import { GlobalMessageContainer }   from '@my-old-startup/frontend-common/components/growl/GlobalMessageContainer';
import {
  CommonRoutes,
  DashboardRoutes,
}                                   from '@my-old-startup/frontend-common/routes';
import { authenticationService }    from '@my-old-startup/frontend-common/services/AuthenticationService';
import { GoogleAnalyticsService }   from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import { logService }               from '@my-old-startup/frontend-common/services/LogService';
import { history }                  from '@my-old-startup/frontend-common/services/RouteService';
import * as React                   from 'react';
import { ErrorInfo }                from 'react';
import {
  Route,
  Switch,
}                                   from 'react-router';
import { DASHBOARD_GA_TRACKING_ID } from './common/constants';
import { DashboardBase }            from './pages/dashboard/DashboardBase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EmailNotVerified }         from './pages/EmailNotVerified';
import { ErrorPage }                from './pages/ErrorPage';
import { Login }                    from './pages/Login';
import { Registration }             from './pages/registration/Registration';
import { routeService }             from './services/CdbRouteService';

type Props = WithStyles<{}>;

type State = {
  hasError: boolean;
};

export class _DashboardApp extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logService.error(`Caught error: ${error}`, {
      error,
      errorInfo,
    });
    routeService.routeTo(CommonRoutes.Error);
    this.setState({ hasError: true });
  }

  public componentDidMount(): void {
    const isAdmin = authenticationService.isLoggedInAdmin();
    GoogleAnalyticsService.init(DASHBOARD_GA_TRACKING_ID, 'dashboard.my-old-startups-domain.de', isAdmin);

    if (!isAdmin) {
      history.listen((location) => {
        GoogleAnalyticsService.set({ page: location.pathname });
        GoogleAnalyticsService.trackPageView(location.pathname);
      });
    }
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      routeService.routeTo(CommonRoutes.Error);
      return <ErrorPage/>;
    }

    const isAuthenticated = authenticationService.isAuthenticated();
    if (!isAuthenticated) {
      routeService.routeTo(DashboardRoutes.Login);
      return <Login/>;
    }

    const user = authenticationService.getAuthUserProfile();
    if (user !== null && user.email_verified === false) {
      routeService.routeTo(DashboardRoutes.ErrorEmailNotVerified);
      return <EmailNotVerified/>;
    }

    return (
      <>
        <GlobalMessageContainer/>
        <Switch>
          <Route exact path={DashboardRoutes.Registration} component={Registration}/>
          <Route path={DashboardRoutes.Home} component={DashboardBase}/>
        </Switch>
      </>
    );
  }
}

export const DashboardApp = (withStyles({})(_DashboardApp));
