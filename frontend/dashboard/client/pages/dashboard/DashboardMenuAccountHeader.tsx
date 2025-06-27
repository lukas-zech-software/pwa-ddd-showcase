import {
  CardHeader,
  Collapse,
  createStyles,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  withStyles,
  WithStyles,
}                                           from '@material-ui/core';
import ExitToAppIcon                        from '@material-ui/icons/ExitToApp';
import ExpandLessIcon                       from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon                       from '@material-ui/icons/ExpandMore';
import AccountCircleIcon                    from '@material-ui/icons/Home';
import { IApiUser }                         from '@my-old-startup/common/interfaces';
import { loginFacade }                      from '@my-old-startup/frontend-common/facades/LoginFacade';
import { CommonRoutes }                     from '@my-old-startup/frontend-common/routes';
import { authenticationService }            from '@my-old-startup/frontend-common/services/AuthenticationService';
import { logService }                       from '@my-old-startup/frontend-common/services/LogService';
import * as React                           from 'react';
import { locale }                           from '../../common/locales';
import { routeService }                     from '../../services/CdbRouteService';
import { DashboardMenuAccountHeaderAvatar } from './DashboardMenuAccountHeaderAvatar';
import { DashboardMenuCompanySelector }     from './DashboardMenuCompanySelector';

const styles = () => createStyles({
  container: {
    width:           '100%',
    backgroundColor: 'inherit',
  },
  listIcon:      {},
  listIconLogin: {
    width:  40,
    height: 40,
  },
  text:      {},
  title:     {},
  subheader: {
    wordBreak: 'break-all',
  },
});

type Props = WithStyles<typeof styles>;

type State = {
  user: IApiUser | undefined;
  showLogout: boolean;
};

export const DashboardMenuAccountHeader = withStyles(styles)(
  class DashboardMenuAccountHeader extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = {
        showLogout: false,
        user:       undefined,
      };
    }

    public componentWillMount(): void {
      loginFacade.getOwnUser().then(user => this.setState({ user })).catch((error) => {
        logService.error(error.toString(), error);
        routeService.routeTo(CommonRoutes.Error, { reason: error });
      });
    }

    public render(): React.ReactNode {
      const { container } = this.props.classes;

      return (
        <Paper elevation={0}
               square
               className={container}>

          {this.getTop()}
          {this.getListItem()}
        </Paper>
      );
    }

    private getTop(): React.ReactNode {
      const user = this.state.user;

      if (user === undefined) {
        return null;
      }

      const showLogout = this.state.showLogout;

      const { title, subheader, text, listIcon } = this.props.classes,
            listItemTextClass                    = { primary: text, secondary: text };

      const cardIcon = (
        <IconButton color="inherit">
          {this.state.showLogout ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
        </IconButton>
      );

      return (
        <>
          <CardHeader avatar={<DashboardMenuAccountHeaderAvatar/>}
                      onClick={() => this.setState({ showLogout: !showLogout })}
                      action={cardIcon}/>
          <Collapse in={showLogout}>

            <CardHeader classes={{ title, subheader }}
                        subheader={user.emailAddress}/>
            <List>
              <DashboardMenuCompanySelector/>

              <ListItem
                button
                onClick={() => authenticationService.logOutHard()}>

                <ListItemIcon>
                  <ExitToAppIcon className={listIcon}/>
                </ListItemIcon>

                <ListItemText
                  classes={listItemTextClass}
                  primary={locale.dashboard.menuItems.header.logout}
                />
              </ListItem>

              <Divider/>

            </List>
          </Collapse>
        </>
      );
    }

    private getListItem(): React.ReactNode {
      const { text }          = this.props.classes,
            listItemTextClass = { primary: text, secondary: text };

      if (!authenticationService.isAuthenticated()) {
        return (
          <List>
            <ListItem
              button
              onClick={() => authenticationService.authorize()}>
              <ListItemIcon>
                <AccountCircleIcon className={this.props.classes.listIconLogin}/>
              </ListItemIcon>

              <ListItemText
                classes={listItemTextClass}
                primary={locale.dashboard.menuItems.header.login}
              />
            </ListItem>
          </List>
        );
      }

      return null;
    }
  },
);
