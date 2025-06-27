import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction as MuiBottomNavigationAction,
  createStyles,
  Paper,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import {
  FilterList as FilterIcon,
  Map as MapIcon,
} from '@material-ui/icons';

import {
  CUSTOMER_COMPANY_ROUTES,
  CUSTOMER_DEAL_ROUTES,
  CUSTOMER_MARKET_ROUTES,
  CUSTOMER_NEWS_ROUTES,
}                         from '@my-old-startup/common/routes/FrontendRoutes';
import { IS_SERVER }      from '@my-old-startup/frontend-common/constants';
import clsx               from 'clsx';
import throttle           from 'lodash.throttle';
import Link               from 'next/link';
import Router             from 'next/router';
import * as React         from 'react';
import { TOP_NAV_HEIGHT } from '../../common/constants';
import { locale }         from '../../common/locales';
import { FourSquareIcon } from '../icons/icons';

const dealRoutes = {
  list: CUSTOMER_DEAL_ROUTES.dealListViewPath,
  map:  CUSTOMER_DEAL_ROUTES.dealMapViewPath,
};

const newsRoutes = {
  list: CUSTOMER_NEWS_ROUTES.newsListViewPath,
  map:  CUSTOMER_NEWS_ROUTES.newsMapViewPath,
};

const companyRoutes = {
  list: CUSTOMER_COMPANY_ROUTES.companyListViewPath,
  map:  CUSTOMER_COMPANY_ROUTES.companyMapViewPath,
};

const marketRoutes = {
  list: CUSTOMER_MARKET_ROUTES.marketListViewPath,
  map:  CUSTOMER_MARKET_ROUTES.marketMapViewPath,
};

const styles = (theme: Theme) => {

  return createStyles(
    {
      tabLabel:            {
        minHeight: 'auto',
      },
      selected:            {
        color:     theme.palette.secondary.main + ' !important',
        'button&': {
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
        },
      },
      muiBottomNavigation: {
        height: theme.spacing(TOP_NAV_HEIGHT + 0.5),
      },
      topNav:              {
        boxShadow:       '0px 4px 5px 0px rgba(0,0,0,0.2), 0px 3px 1px -2px rgba(0,0,0,0.12)',
        backgroundColor: theme.palette.background.paper,
        zIndex:          90,
        position:        'absolute',
        top:             theme.spacing(TOP_NAV_HEIGHT),
        transition:      'top 0.8s',
        borderBottom:    '1px solid ' + theme.palette.grey[400],
        height:          theme.spacing(TOP_NAV_HEIGHT),
        width:           '100%',
        '&.hidden':      {
          top: -theme.spacing(TOP_NAV_HEIGHT),
        },
      },
    },
  );
};

type State = {
  activeRoute: string | undefined;
  prevScrollpos: number;
  visible: boolean;
};

type Props = WithStyles<typeof styles>;

class _TopNavigation extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      activeRoute:   undefined,
      prevScrollpos: IS_SERVER ? 0 : window.pageYOffset,
      visible:       true,
    };
  }

  private handleScroll = throttle(() => {
    const { prevScrollpos } = this.state;

    if (location.pathname.endsWith('/map')) {
      this.setState({ visible: true });
      return;
    }

    const currentScrollPos = window.pageYOffset;
    const visible          = prevScrollpos > currentScrollPos;

    if (currentScrollPos > 20) {
      this.setState({
                      prevScrollpos: currentScrollPos,
                      visible,
                    });
    } else {
      this.setState({ visible: true });
    }
  }, 300);

  public componentDidMount(): void {
    // Wait for the initial scroll event was fired to always show menue on refresh, even when scrolled
    setTimeout(() => window.addEventListener('scroll', this.handleScroll), 500);

    this.setState({ activeRoute: location.pathname });
  }

  public componentWillUnmount(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  public componentDidUpdate(): void {
    if (location.pathname !== this.state.activeRoute) {
      this.setState({
                      activeRoute: location.pathname,
                      visible:     true,
                    });
    }
  }

  public render(): React.ReactNode {
    const { classes }              = this.props;
    const { activeRoute, visible } = this.state;
    let hideFilter                 = false;

    if (!activeRoute) {
      return null;
    }

    if (activeRoute.includes('details') || activeRoute.includes('error')) {
      return null;
    }

    // CORONA
    let currentRoutes = companyRoutes;

    if (activeRoute.includes('news')) {
      currentRoutes = newsRoutes;
    }

    if (activeRoute.includes('company')) {
      currentRoutes = companyRoutes;
      // CORONA
    }
    if (activeRoute.includes('market')) {
      currentRoutes = marketRoutes;
      hideFilter    = true;
    }

    return (
      <Paper elevation={0} className={clsx(classes.topNav, { hidden: !visible })}>
        <MuiBottomNavigation
          className={classes.muiBottomNavigation}
          value={activeRoute}
          showLabels
        >
          <MuiBottomNavigationAction
            classes={{ selected: classes.selected }}
            value={currentRoutes.list}
            onClick={() => Router.push(currentRoutes.list)}
            icon={
              <Link href={currentRoutes.list}>
                <FourSquareIcon selected={activeRoute === currentRoutes.list}/>
              </Link>
            }
            label={locale.search.tabs.list}
          />

          <MuiBottomNavigationAction
            classes={{ selected: classes.selected }}
            value={currentRoutes.map}
            onClick={() => Router.push(currentRoutes.map)}
            icon={
              <Link href={currentRoutes.map}>
                <MapIcon/>
              </Link>
            }
            label={locale.search.tabs.map}
          />

          {hideFilter === false && (
            <MuiBottomNavigationAction
              classes={{ selected: classes.selected }}
              value={CUSTOMER_DEAL_ROUTES.filterViewPath}
              label={locale.search.tabs.filter}
              onClick={() => Router.push(CUSTOMER_DEAL_ROUTES.filterViewPath)}
              icon={
                <Link href={CUSTOMER_DEAL_ROUTES.filterViewPath} prefetch={false}>
                  <FilterIcon/>
                </Link>
              }
            />)}
        </MuiBottomNavigation>
      </Paper>
    );
  }
}

export const TopNavigation = withStyles(styles)(_TopNavigation);
