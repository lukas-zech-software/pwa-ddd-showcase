import { withStyles, WithStyles } from '@material-ui/core';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import { authenticationService }  from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                 from 'react';
import { Redirect }               from 'react-router';
import { RegistrationForm }       from './RegistrationForm';
import { RegistrationIntro }      from './RegistrationIntro';

type Props = WithStyles<{}>;

export const Registration = withStyles({})(
  class Registration extends React.Component<Props> {

    public render(): JSX.Element {
      const isAuthenticated = authenticationService.isAuthenticated();

      if (!isAuthenticated) {
        return <RegistrationIntro/>;
      }

      const isLoggedInCompany = authenticationService.isLoggedInCompany();

      if (isLoggedInCompany) {
        return <Redirect to={DashboardRoutes.Home}/>;
      }

      return <RegistrationForm/>;
    }
  },
);
