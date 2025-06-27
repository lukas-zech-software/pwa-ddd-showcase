import {
  createStyles,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                 from '@material-ui/core';
import {
  Help,
  Home,
} from '@material-ui/icons';
import { CUSTOMER_COMMON_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import { IS_PWA }                 from '@my-old-startup/frontend-common/constants';
import Router                     from 'next/router';
import * as React                 from 'react';
import { locale }                 from '../../common/locales';
import { MenuDrawerHeader }       from './MenuDrawerHeader';
import { SideMenuAppInstallItem } from './SideMenuAppInstallItem';

const styles = (theme: Theme) => createStyles(
  {
    drawerPaper:         {
      position: 'relative',
      width:    300,
    },
    invisibleButton:     {
      display: 'inline',
    },
    smallLink:           {
      color:   'inherit',
      display: 'block',
    },
    legalLinksListItem:  {
      width:    300,
      position: 'fixed',
      bottom:   theme.spacing(locale.name === 'de' ? 6 : 1),
    },
    legalLinksContainer: {
      textAlign:  'center',
      width:      '100%',
      lineHeight: 1,
      height:     theme.spacing(6),
      '& > div':  {
        display:        'flex',
        flexGrow:       1,
        justifyContent: 'center',
      },
    },
  },
);

type Props = {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  markInstall: boolean;
} & WithStyles<typeof styles>;

type State = {};

class _SideMenu extends React.Component<Props, State> {
  public render(): JSX.Element {
    const { classes, isOpen, onClose, onOpen, markInstall } = this.props;
    return (
      <SwipeableDrawer
        variant="temporary"
        anchor="left"
        onOpen={onOpen}
        onClose={onClose}
        onBackdropClick={onClose}
        open={isOpen}
        classes={{ paper: classes.drawerPaper }}
      >
        <MenuDrawerHeader/>
        <List>
          {IS_PWA === false && (
            <>
              <SideMenuAppInstallItem markInstall={markInstall}/>
              <Divider/>
            </>
          )}


          <ListItem button onClick={() => {
            window.open('https://www.my-old-startups-domain.de/', '_self');
            onClose();
          }}>
            <ListItemIcon>
              <Home/>
            </ListItemIcon>
            <ListItemText primary={locale.drawer.items.home}/>
          </ListItem>

          <ListItem className={classes.legalLinksListItem}>
            <Grid container justify="space-between" spacing={0} className={classes.legalLinksContainer}>
              <Grid item>
                <Typography variant="overline">
                  <a
                    rel="noopener noreferrer"
                    href="https://www.my-old-startups-domain.de/datenschutz/"
                    target="_blank"
                    className={classes.smallLink}>{locale.drawer.items.privacy}</a>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="overline">
                  <a
                    rel="noopener noreferrer"
                    href="https://www.my-old-startups-domain.de/impressum/"
                    target="_blank"
                    className={classes.smallLink}>{locale.drawer.items.legal}</a>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="overline"
                  className={classes.invisibleButton}
                  onClick={() => {
                    void Router.push(CUSTOMER_COMMON_ROUTES.login);
                    onClose();
                  }}>
                  &copy; {new Date().getFullYear()}
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </SwipeableDrawer>
    );
  }
}

export const SideMenu = withStyles(styles)(_SideMenu);
