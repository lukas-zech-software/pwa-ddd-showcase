import {
  Avatar,
  CardHeader,
  Collapse,
  createStyles,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  withStyles,
  WithStyles,
}                                from '@material-ui/core';
import { Memory }                from '@material-ui/icons';
import ExitToAppIcon             from '@material-ui/icons/ExitToApp';
import ExpandLessIcon            from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon            from '@material-ui/icons/ExpandMore';
import AccountCircleIcon         from '@material-ui/icons/Home';
import { IApiUser }              from '@my-old-startup/common/interfaces/IApiUser';
import { loginFacade }           from '@my-old-startup/frontend-common/facades/LoginFacade';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import { logService }            from '@my-old-startup/frontend-common/services/LogService';
import * as React                from 'react';
import { HubRoutes }             from '../common/HubRoutes';
import { locale }                from '../common/locales';
import { routeService }          from '../services/HubRouteService';

const styles = () => createStyles({
  container: {
    width:           '100%',
    backgroundColor: 'inherit',
  },
  avatar: {
    width:  75,
    height: 75,
  },
  avatarIcon: {
    width:  '90%',
    height: '90%',
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

export const HubMenuAccountHeader = withStyles(styles)(
  class HubMenuAccountHeader extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = {
        showLogout: false,
        user:       undefined,
      };
    }

    public componentDidMount(): void {
      loginFacade.getOwnUser().then(user => this.setState({ user })).catch((error) => {
        logService.error(error.toString(), error);
        routeService.routeTo(HubRoutes.Error, { reason: error });
      });
    }

    public render(): React.ReactNode {
      const { container } = this.props.classes;

      return (
        <Paper elevation={0}
               className={container}>

          {this.getTop()}

          <List>
            {this.getListItem()}
          </List>
        </Paper>
      );
    }

    private getTop(): React.ReactNode {
      const user = this.state.user;

      if (user === undefined) {
        return null;
      }

      const showLogout = this.state.showLogout;

      const { title, subheader, avatar, avatarIcon, text, listIcon } = this.props.classes,
            listItemTextClass = { primary: text, secondary: text };

      const cardAvatar = (
        <Avatar className={avatar}>
          <Memory className={avatarIcon}/>
        </Avatar>
      ),
            cardIcon = (
              <IconButton color="inherit">
                {this.state.showLogout ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
              </IconButton>
            );

      return (
        <>
          <CardHeader avatar={cardAvatar}
                      onClick={() => this.setState({ showLogout: !showLogout })}
                      action={cardIcon}/>
          <Collapse in={showLogout}>

            <CardHeader classes={{ title, subheader }}
                        subheader={user.emailAddress}/>
            <List>
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
            </List>
          </Collapse>
        </>
      );
    }

    private getListItem(): React.ReactNode {
      const { text } = this.props.classes,
            listItemTextClass = { primary: text, secondary: text };

      if (authenticationService.isAuthenticated() === false) {
        return (
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
        );
      }

      return null;
    }
  },
);
