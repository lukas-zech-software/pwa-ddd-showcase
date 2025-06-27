import {
  AppBar,
  createStyles,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography,
  withStyles,
  WithStyles,
}                               from '@material-ui/core';
import { Delete }               from '@material-ui/icons';
import AttachMoneyIcon          from '@material-ui/icons/AttachMoney';
import DashboardIcon            from '@material-ui/icons/Dashboard';
import MenuIcon                 from '@material-ui/icons/Menu';
import SettingsIcon             from '@material-ui/icons/Settings';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import TrendingUpIcon           from '@material-ui/icons/TrendingUp';
import clsx                     from 'clsx';
import * as React               from 'react';
import { HubRoutes }            from '../common/HubRoutes';
import { locale }               from '../common/locales';
import { hubAdminFacade }       from '../facade/HubAdminFacade';
import { routeService }         from '../services/HubRouteService';
import { HubMenuAccountHeader } from './HubMenuAccountHeader';

const appBarHeight = 64;
const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  flex: {
    flexGrow: 1,
  },
  appFrame: {
    zIndex:   1,
    // overflow: 'hidden',
    position: 'relative',
    display:  'flex',
    width:    '100%',
    height:   '100vh',
  },
  appBar: {
    height:     appBarHeight,
    position:   'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing:   theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width:      `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing:   theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft:  12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    width:    drawerWidth,
  },
  drawerHeader: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'flex-end',
    padding:        '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow:        1,
    width:           `calc(100% - ${drawerWidth + theme.spacing(6)}px)`,
    marginLeft:      -drawerWidth,
    backgroundColor: theme.palette.background.default,
    padding:         theme.spacing(3),
    transition:      theme.transitions.create('margin', {
      easing:   theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing:   theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
});

type Props = WithStyles<typeof styles>;

type State = {
  isOpen: boolean;
};

class _HubMenu extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={classes.flex}>
        <div className={classes.appFrame}>
          <AppBar
            className={clsx(classes.appBar, {
              [classes.appBarShift]: isOpen,
            })}
          >
            <Toolbar disableGutters={!isOpen}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                className={clsx(classes.menuButton)}
              >
                <MenuIcon/>
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.flex}>
                {locale.dashboard.header.appBar}
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="persistent"
            anchor="left"
            open={isOpen}
            classes={{ paper: classes.drawerPaper }}
          >
            <HubMenuAccountHeader/>
            <Divider/>
            <List>
              <ListItem button onClick={() => routeService.routeTo(HubRoutes.Companies)}>
                <ListItemIcon>
                  <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary={locale.dashboard.menuItems.companies}/>
              </ListItem>
              <ListItem button
                        onClick={() => routeService.routeTo(HubRoutes.User)}>
                <ListItemIcon>
                  <SupervisedUserCircleIcon/>
                </ListItemIcon>
                <ListItemText primary={locale.dashboard.menuItems.users}/>
              </ListItem>
              <ListItem button
                        onClick={() => routeService.routeTo(HubRoutes.Deals)}>
                <ListItemIcon>
                  <AttachMoneyIcon/>
                </ListItemIcon>
                <ListItemText primary={locale.dashboard.menuItems.deals}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <TrendingUpIcon/>
                </ListItemIcon>
                <ListItemText primary="Charts"/>
              </ListItem>
            </List>
            <Divider/>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary={locale.dashboard.menuItems.settings}/>
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <Delete/>
                </ListItemIcon>
                <ListItemText primary={'Disable Google Analytics'}
                              onClick={() => void hubAdminFacade.deactivateGoogleAnalytics()}/>
              </ListItem>
            </List>
          </Drawer>
          <main className={clsx(classes.content, { [classes.contentShift]: isOpen })}>
            <div className={classes.drawerHeader}/>
            {this.props.children}
          </main>
        </div>
      </div>
    );
  }
}

export const HubMenu = withStyles(styles)(_HubMenu);
