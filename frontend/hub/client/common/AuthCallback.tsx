import { CircularProgress }      from '@material-ui/core';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                from 'react';
import { routeService }          from '../services/HubRouteService';
import { HubRoutes }             from './HubRoutes';

export class AuthCallback extends React.Component {
  public componentDidMount(): void {

    authenticationService
      .handleAuthCallback()
      .then(() => routeService.routeTo(HubRoutes.Home, {}, true))
      .catch(() => routeService.routeTo(HubRoutes.Error));
  }

  public render(): JSX.Element {
    return <CircularProgress/>;
  }
}
