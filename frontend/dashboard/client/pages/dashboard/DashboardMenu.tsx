import {
  AppBar,
  createStyles,
  Divider,
  Drawer,
  Grid,
  Hidden,
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
  withWidth,
}                                 from '@material-ui/core';
import { WithWidth }              from '@material-ui/core/withWidth';
import {
  Bookmarks,
  Email,
}                                 from '@material-ui/icons';
import HomeIcon                   from '@material-ui/icons/Home';
import LocalHosptial              from '@material-ui/icons/LocalHospital';
import MenuIcon                   from '@material-ui/icons/Menu';
import RestaurantIcon             from '@material-ui/icons/Restaurant';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import clsx                       from 'clsx';
import * as React                 from 'react';
import {
  APP_BAR_HEIGHT,
  DRAWER_WIDTH,
}                                 from '../../common/constants';
import { SupportButton }          from '../../common/contact/SupportButton';
import { locale }                 from '../../common/locales';
import { routeService }           from '../../services/CdbRouteService';
import { companyStore }               from '../../stores/CompanyStore';
import { DashboardMenuAccountHeader } from './DashboardMenuAccountHeader';

const styles = (theme: Theme) => createStyles(
  {
    flex:     {
      flexGrow: 1,
    },
    appFrame: {
      zIndex:   1,
      // overflow: 'hidden',
      position: 'relative',
      display:  'flex',
      width:    '100%',
    },
    appBar:              {
      backgroundImage:
        `linear-gradient(to bottom right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
      height:     APP_BAR_HEIGHT,
      position:   'absolute',
      transition: theme.transitions.create(['margin', 'width'], {
        easing:   theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift:         {
      width:      `calc(100% - ${DRAWER_WIDTH}px)`,
      marginLeft: DRAWER_WIDTH,
      transition: theme.transitions.create(['margin', 'width'], {
        easing:   theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton:          {
      marginLeft:  12,
      marginRight: 20,
    },
    smallLink:           {
      color:    'inherit',
      fontSize: '0.65rem',
    },
    legalLinksListItem:  {
      width:       240,
      paddingLeft: 0,
      position:    'absolute',
      bottom:      0,
    },
    legalLinksContainer: {
      width:    '100%',
      position: 'relative',
    },
    divider:             {
      marginLeft: theme.spacing(2),
    },
    menuItem:            {
      borderRadius: `${theme.spacing(3)}px 0 0 ${theme.spacing(3)}px`,
    },
    hide:                {
      display: 'none',
    },
    drawerPaper:         {
      position: 'relative',
    },
    drawerRoot:          {
      width:     DRAWER_WIDTH,
      overflowX: 'hidden',
    },
    drawerHeader:        {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'flex-end',
      padding:        '0 8px',
      ...theme.mixins.toolbar,
    },
    content:             {
      flexGrow:        1,
      width:           `calc(100% - ${DRAWER_WIDTH + theme.spacing(6)}px)`,
      minHeight:       '90vh',
      marginLeft:      -DRAWER_WIDTH,
      backgroundColor: theme.palette.background.default,
      padding:         theme.spacing(3),
      // Padding for fixed FabButton
      paddingBottom:   theme.spacing(10),
      transition:      theme.transitions.create('margin', {
        easing:   theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    contentShift:        {
      marginLeft: 0,
      transition: theme.transitions.create('margin', {
        easing:   theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    fab:                 {
      width:           theme.spacing(24.5),
      marginLeft:      theme.spacing(2),
      height:          theme.spacing(6),
      // eslint-disable-next-line @typescript-eslint/tslint/config
      backgroundImage: `linear-gradient(to bottom right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    },
    extendedIcon:        {
      height:   theme.spacing(5),
      width:    theme.spacing(5),
      position: 'relative',
      ...locale.dashboard.cards.companyInfo.createNewDealChip.style(),
    },
    list:     {
      marginLeft: theme.spacing(2),
      overflow:   'hidden',
      height:     '100%',
    },
    typeItem:            {
      // disable padding for the company type item, so that "My Food Truck" will still fit in one line
      paddingRight: 0,
    },
  },
);

function getIsSmall(width: string): boolean {
  return width === 'xs' || width === 'sm' || width === 'md';
}

type Props = WithStyles<typeof styles> & WithWidth & {};

type State = {
  isOpen: boolean;
};

class _DashboardMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const isSmall = getIsSmall(props.width);
    this.state    = { isOpen: isSmall === false };
  }

  public render(): React.ReactNode {
    const { classes, width } = this.props;
    const { isOpen }         = this.state;
    const currentCompany     = companyStore.currentCompany;
    const isSmall            = getIsSmall(width);

    return (
      <div className={classes.flex}>
        <div className={classes.appFrame}>
          <AppBar
            className={clsx(classes.appBar, {
              [classes.appBarShift]: isOpen && isSmall === false,
            })}
          >
            <Toolbar disableGutters={!isOpen}>
              {isSmall && (
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                  className={clsx(classes.menuButton)}
                >
                  <MenuIcon/>
                </IconButton>
              )}
              <Typography variant="h5" color="inherit" className={classes.flex}>
                <Hidden xsDown>
                  {locale.dashboard.header}
                </Hidden>
                <Hidden smUp>
                  {locale.dashboard.headerXs}
                </Hidden>
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant={isSmall ? 'temporary' : 'persistent'}
            anchor={'left'}
            open={isOpen}
            onBackdropClick={() => this.setState({ isOpen: !this.state.isOpen })}
            classes={{
              paper: classes.drawerPaper,
              root:  classes.drawerRoot,
            }}
          >
            <DashboardMenuAccountHeader/>

            {currentCompany && (
              <>
              <List className={classes.list}>
                {/* CORONA
                <Fab variant="extended" color="primary" aria-label="Create new" className={classes.fab}
                     onClick={() => {
                       dashboardAnalyticsService.trackEvent(
                         {
                           category: 'dashboard',
                           action:   'add-new-deal',
                           label:    AddNewDealLabel.NewDealFab,
                         },
                       );
                       createDealWizardStore.reset();
                       routeService.routeTo(DashboardRoutes.Dashboard);
                       setTimeout(() => {
                         // force unmounting of the wizard if currently already on the wizard
                         routeService.routeTo(DashboardRoutes.NewDeal, { companyId: currentCompany.id }, true);
                       }, 0);
                     }}>
                  <Add className={classes.extendedIcon}/>
                  {locale.dashboard.cards.companyInfo.createNewDealChip.label}
                </Fab>
                <List className={classes.list}>
                  <ListItem button
                            selected={routeService.isRouteActive(DashboardRoutes.Dashboard,
                                                                 true,
                                                                 { companyId: currentCompany.id })}
                            onClick={() => routeService.routeTo(DashboardRoutes.Dashboard,
                                                                { companyId: currentCompany.id })}
                            className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <DashboardIcon/>
                    </ListItemIcon>
                    <ListItemText primary={locale.dashboard.menuItems.dashBoard}/>
                  </ListItem>
                  <ListItem button
                            selected={routeService.isRouteActive(DashboardRoutes.Deals,
                                                                 false,
                                                                 { companyId: currentCompany.id })}
                            onClick={() => routeService.routeTo(DashboardRoutes.Deals,
                                                                { companyId: currentCompany.id })}
                            className={classes.menuItem}
                  >
                    <ListItemIcon>
                      <InboxIcon/>
                    </ListItemIcon>
                    <ListItemText primary={locale.dashboard.menuItems.dealsPage}/>
                  </ListItem>
*/}

                <ListItem button
                          selected={routeService.isRouteActive(DashboardRoutes.Corona)}
                          onClick={() => routeService.routeTo(DashboardRoutes.Corona,
                                                              { companyId: currentCompany.id })}
                          className={classes.menuItem}
                >
                  <ListItemIcon>
                    <LocalHosptial/>
                  </ListItemIcon>
                  <ListItemText primary={locale.dashboard.menuItems.corona}
                  />
                </ListItem>

                <ListItem button
                          selected={routeService.isRouteActive(DashboardRoutes.Restaurant)}
                          onClick={() => routeService.routeTo(DashboardRoutes.Restaurant,
                                                              { companyId: currentCompany.id })}
                          className={classes.menuItem}
                >
                  <ListItemIcon>
                    <HomeIcon/>
                  </ListItemIcon>
                  <ListItemText primary={
                    `${commonLocale.company.prefix[currentCompany.contact.type]} ${commonLocale.company.types[currentCompany.contact.type]}`}
                  />
                </ListItem>
                <ListItem button
                          selected={routeService.isRouteActive(DashboardRoutes.Dishes)}
                          onClick={() => routeService.routeTo(DashboardRoutes.Dishes,
                                                              { companyId: currentCompany.id })}
                          className={classes.menuItem}
                >
                  <ListItemIcon>
                    <RestaurantIcon/>
                  </ListItemIcon>
                  <ListItemText primary={locale.dashboard.menuItems.dishes}/>
                </ListItem>

                <Divider className={classes.divider}/>

                {/* <ListItem button
                            selected={routeService.isRouteActive(DashboardRoutes.Feedback)}
                            className={classes.menuItem}
                            onClick={() => routeService.routeTo(DashboardRoutes.Feedback)}
                  >
                    <ListItemIcon>
                      <Feedback/>
                    </ListItemIcon>
                    <ListItemText primary={locale.dashboard.menuItems.feedback}/>
                  </ListItem>
*/}
                <ListItem button
                          selected={routeService.isRouteActive(DashboardRoutes.Contact)}
                          className={clsx(classes.menuItem, classes.typeItem)}
                          onClick={() => routeService.routeTo(DashboardRoutes.Contact)}
                >
                  <ListItemIcon>
                    <Email/>
                  </ListItemIcon>
                  <ListItemText primary={locale.dashboard.menuItems.contact}/>
                </ListItem>

                <Divider className={classes.divider}/>

                <ListItem button
                          className={clsx(classes.menuItem, classes.typeItem)}
                >
                  <ListItemIcon>
                    <Bookmarks/>
                  </ListItemIcon>
                  <a href="https://www.dehoga-nrw.de/dehoga-nrw/umgang-mit-coronavirus/lockerungen-das-muessen-sie-wissen/" target="_blank" rel="noopener noreferrer">
                    <ListItemText primary={locale.dashboard.menuItems.dehoga}/>
                  </a>
                </ListItem>

                {/*<Divider className={classes.divider}/>

                  <ListItem button className={classes.menuItem} onClick={() => {
                    window.open('https://www.my-old-startups-domain.de/faq-partnerbereich', '_blank');
                  }}>
                    <ListItemIcon>
                      <Help/>
                    </ListItemIcon>
                    <ListItemText primary={locale.dashboard.menuItems.faq}/>
                  </ListItem>*/}

                  <ListItem className={classes.legalLinksListItem}>
                    <Grid container justify="center" spacing={1} className={classes.legalLinksContainer}>
                      <Grid item>
                        <Typography variant="overline">
                          <a href="https://www.my-old-startups-domain.de/datenschutz/" target="_blank" rel="noopener noreferrer"
                             className={classes.smallLink}>{locale.dashboard.menuItems.privacy}</a>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="overline">
                          <a href="https://www.my-old-startups-domain.de/impressum/" target="_blank" rel="noopener noreferrer"
                             className={classes.smallLink}>{locale.dashboard.menuItems.legal}</a>
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="overline">
                          <a href="https://my-old-startups-domain.de/agb-anbieter/" target="_blank" rel="noopener noreferrer"
                             className={classes.smallLink}>{locale.dashboard.menuItems.terms}</a>
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </>
            )}
          </Drawer>
          <main
            className={clsx(classes.content, { [classes.contentShift]: isOpen || isSmall })}
          >
            <div className={classes.drawerHeader}/>
            {this.props.children}
            <SupportButton/>
          </main>
        </div>
      </div>
    );
  }
}

export const DashboardMenu = withWidth()(withStyles(styles)(_DashboardMenu));
