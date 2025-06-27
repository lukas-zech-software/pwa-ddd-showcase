import { GlobalMessageContainer } from '@my-old-startup/frontend-common/components/growl/GlobalMessageContainer';
import { logService }             from '@my-old-startup/frontend-common/services/LogService';
import { history }                from '@my-old-startup/frontend-common/services/RouteService';
import * as React                 from 'react';
import { ErrorInfo }              from 'react';
import { hot }                    from 'react-hot-loader';
import { Route, Router, Switch }  from 'react-router';
import { AuthCallback }           from './common/AuthCallback';
import { HubRoutes }              from './common/HubRoutes';
import { ErrorPage }              from './pages/ErrorPage';
import { HubBase }                from './pages/HubBase';
import { routeService }           from './services/HubRouteService';

export class HubApp extends React.Component {

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logService.error(`Caught error: ${error}`, { error, errorInfo });
    routeService.routeTo(HubRoutes.Error);
    this.setState({ hasError: true });
  }

  public render(): JSX.Element {
    return (
      <Router history={history}>
        <>
          <GlobalMessageContainer/>
          <Switch>
            <Route exact path={HubRoutes.Error} component={ErrorPage}/>
            <Route exact path={HubRoutes.AuthCallback} component={AuthCallback}/>
            <Route path={HubRoutes.Home} component={HubBase}/>
          </Switch>
        </>
      </Router>
    );
  }
}

export default hot(module)(HubApp);
