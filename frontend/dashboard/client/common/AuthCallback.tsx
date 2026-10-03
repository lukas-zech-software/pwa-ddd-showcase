import { CircularProgress }              from '@material-ui/core';
import { CommonRoutes, DashboardRoutes } from '@my-old-startup/frontend-common/routes';
import { authenticationService }         from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                        from 'react';
import { routeService }                  from '../services/CdbRouteService';

export class AuthCallback extends React.Component {
  public componentWillMount(): void {
    authenticationService
      .handleAuthCallback()
      .then(() => {
        routeService.routeTo(DashboardRoutes.Home, {}, true);
      })
      .catch(() => routeService.routeTo(CommonRoutes.Error));
  }

  public render(): JSX.Element {
    return <CircularProgress/>;
  }
}
