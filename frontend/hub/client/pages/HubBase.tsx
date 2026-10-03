import {
  withStyles,
  WithStyles,
}                                from '@material-ui/core';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                from 'react';
import {
  Route,
  Switch,
}                                from 'react-router';
import { HubRoutes }             from '../common/HubRoutes';
import { CompanyTableExport }    from './company/CompanyExportTable';
import { CompanyTable }          from './company/CompanyTable';
import { DealsOverview }         from './deals/DealsOverview';
import { HubMenu }               from './HubMenu';
import { Login }                 from './Login';
import { UserTable }             from './user/UserTable';

type Props = WithStyles<{}>;

export const HubBase = withStyles({})(
  class HubBase extends React.Component<Props> {
    public render(): JSX.Element {
      const isAuthenticated = authenticationService.isAuthenticated();

      if (!isAuthenticated) {
        return <Login/>;
      }

      return (
        <HubMenu>
          <Switch>
            <Route path={HubRoutes.CompaniesExport} component={CompanyTableExport}/>
            <Route path={HubRoutes.Companies} component={CompanyTable}/>
            <Route path={HubRoutes.User} component={UserTable}/>
            <Route path={HubRoutes.Deals} component={DealsOverview}/>
            <Route component={CompanyTable}/>
          </Switch>
        </HubMenu>
      );
    }
  },
);
