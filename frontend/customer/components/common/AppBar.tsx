import {
  AppBar,
  createStyles,
  Grid,
  Hidden,
  Theme,
  Toolbar,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import clsx                        from 'clsx';
import { observer }                from 'mobx-react';
import { WithRouterProps }         from 'next/dist/client/with-router';
import { withRouter }              from 'next/router';
import * as React                  from 'react';
import { CDN_STATIC_BASE_URL }     from '../../../../common/enums';
import { APP_HEADER_HEIGHT }       from '../../common/constants';
import { SearchInput }             from '../search/SearchInput';
import { SearchNavigationButton }  from '../search/SearchNavigationButton';
import { TopNavigation }           from './TopNavigation';

const styles = (theme: Theme) => createStyles(
  {
    iosSticky:    {
      position: '-webkit-sticky',
    },
    appBar:       {
      backgroundColor: theme.palette.background.paper,
    },
    appToolbar:   {
      backgroundColor: theme.palette.background.paper,
      zIndex:          100,
      paddingLeft:     theme.spacing(1),
      paddingRight:    theme.spacing(1),
      height:          theme.spacing(6),
      '&.open':        {
        height: 'auto',
      },
    },
    menuButton:   {
      marginLeft:  -12,
      marginRight: 20,
    },
    hide:         {
      display: 'none',
    },
    drawerHeader: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'flex-end',
      padding:        '0 8px',
      ...theme.mixins.toolbar,
      height:         theme.spacing(APP_HEADER_HEIGHT),
    },
    logo:         {
      height:      theme.spacing(6),
      width:       theme.spacing(6),
      padding:     theme.spacing(1),
      marginRight: theme.spacing(1),
      cursor:      'pointer',
    },
    logoWide:     {
      cursor:          'pointer',
      backgroundColor: 'inherit',
      height:          'auto',
      position:        'relative',
      top:             12,
      left:            theme.spacing(1),
      width:           40,
      marginRight:     theme.spacing(1),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  onMenuClick: () => void;
} & WithRouterProps;

type State = {
  markInstall: boolean;
  isOpen: boolean;
};

@observer
class _TopAppBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      markInstall: false,
      isOpen:      false,
    };
  }

  public render(): React.ReactNode {
    const { classes, onMenuClick, router } = this.props;
    const { isOpen }               = this.state;

    const isList     = router.pathname.includes(CUSTOMER_COMPANY_ROUTES.companyListViewPath);

    return (
      <AppBar position={'sticky'} className={
        clsx(classes.appBar, classes.iosSticky, {
          open: isOpen,
        })}>
        <Toolbar variant="dense" disableGutters className={
          clsx(classes.appToolbar, {
            open: isOpen,
          })}>
          <Grid container spacing={0} alignItems="baseline" style={{ textAlign: 'center' }}>
            <div style={{ position: 'absolute' }}>
              <div style={{ float: 'left' }}>
                  <Hidden smDown implementation="css">
                    <img className={classes.logoWide} src={CDN_STATIC_BASE_URL + '/images/logo/logo_farbig.png'}
                         onClick={() =>window.open('https://www.my-old-startups-domain.de', '_self')}/>
                  </Hidden>
              </div>
              {onMenuClick && <SearchNavigationButton onMenuClick={onMenuClick}/>}
            </div>
            <Grid item xs={12}>
              <SearchInput onMenuClick={() => onMenuClick()}
                           isList={isList}
                           onSearchInputClick={(isOpen) => this.setState({ isOpen })}/>
            </Grid>
          </Grid>
        </Toolbar>

        <TopNavigation/>
      </AppBar>
    );
  }
}

export const TopAppBar = withRouter(withStyles(styles)(_TopAppBar));
