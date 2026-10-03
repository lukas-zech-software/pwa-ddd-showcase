// Make sure react-hot-loader is required before react and react-dom
import { MuiThemeProvider }      from '@material-ui/core/styles';
import { Loading }               from '@my-old-startup/frontend-common/components';
import {
  CommonRoutes,
  DashboardRoutes,
}                                from '@my-old-startup/frontend-common/routes';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import { history }               from '@my-old-startup/frontend-common/services/RouteService';
import { dashboardTheme }        from '@my-old-startup/frontend-common/theme';
import * as React                from 'react';
import { hot }                   from 'react-hot-loader';
import {
  Route,
  Router,
  Switch,
}                                from 'react-router';
import { AuthCallback }          from './common/AuthCallback';
import { EmailCallback }         from './common/EmailCallback';
import { PrivacyBar }            from './common/PrivacyBar';
import { DashboardApp }          from './DashboardApp';
import { EmailNotVerified }      from './pages/EmailNotVerified';
import { ErrorPage }             from './pages/ErrorPage';
import { Login }                 from './pages/Login';

const _App: React.FC = () => (
  <Router history={history}>
    <MuiThemeProvider theme={dashboardTheme}>
      <PrivacyBar/>
      <Switch>
        <Route exact path={DashboardRoutes.Login} component={Login}/>
        <Route exact path={DashboardRoutes.Logout} render={() => {
          authenticationService.logOutHard();
          return <Loading/>;
        }}/>
        <Route exact path={CommonRoutes.Error} component={ErrorPage}/>
        <Route exact path={DashboardRoutes.ErrorEmailNotVerified} component={EmailNotVerified}/>
        <Route exact path={DashboardRoutes.AuthCallback} component={AuthCallback}/>
        <Route exact path={DashboardRoutes.EmailCallback} component={EmailCallback}/>
        <Route component={DashboardApp}/>
      </Switch>
    </MuiThemeProvider>
  </Router>
);

export const App = hot(module)(_App);
