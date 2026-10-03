import {
  BottomNavigation as MuiBottomNavigation,
  Button,
  createStyles,
  FormControlLabel,
  FormGroup,
  Grid,
  Paper,
  Switch,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import {
  CUSTOMER_COMPANY_ROUTES,
  CUSTOMER_DEAL_ROUTES,
  CUSTOMER_MARKET_ROUTES,
  CUSTOMER_NEWS_ROUTES,
}                      from '@my-old-startup/common/routes/FrontendRoutes';
import { IS_PWA }      from '@my-old-startup/frontend-common/constants';
import { observer }    from 'mobx-react';
import * as React      from 'react';
import { locale }      from '../../common/locales';
import { searchStore } from '../../store/SearchStore';

const styles = (theme: Theme) => {
  const iOSFix = IS_PWA ? 9 : 0;

  return createStyles(
    {
      label:     {
        width:   100,
        display: 'block',
      },
      selected:  {
        color:     theme.palette.secondary.main + ' !important',
        'button&': {
          borderTop: `2px solid ${theme.palette.secondary.main}`,
        },
      },
      bottomNav: {
        height: `100%`,
        width:  '100%',
      },
      button:    {
        marginTop: 2,
      },
      row:       {
        justifyContent: 'center',
      },
      container: {
        width: 'auto',
      },
    },
  );
};

type State = {
  activeRoute: string | undefined
};

type Props = WithStyles<typeof styles>;

@observer
class _BottomNavigation extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      activeRoute: undefined,
    };
  }

  public componentDidMount(): void {
    this.setState({ activeRoute: location.pathname });
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    if (location.pathname !== this.state.activeRoute) {
      this.setState({ activeRoute: location.pathname });

    }
  }

  public render(): React.ReactNode {
    const { classes }   = this.props;
    let { activeRoute } = this.state;
    let isMap           = false;

    let links = {
      news:      CUSTOMER_NEWS_ROUTES.newsListViewPath,
      deals:     CUSTOMER_DEAL_ROUTES.dealListViewPath,
      companies: CUSTOMER_COMPANY_ROUTES.companyListViewPath,
      markets:   CUSTOMER_MARKET_ROUTES.marketListViewPath,
    };

    if (activeRoute !== undefined) {
      isMap = activeRoute.includes('map');

      if (isMap) {
        links = {
          news:      CUSTOMER_NEWS_ROUTES.newsMapViewPath,
          deals:     CUSTOMER_DEAL_ROUTES.dealMapViewPath,
          companies: CUSTOMER_COMPANY_ROUTES.companyMapViewPath,
          markets:   CUSTOMER_MARKET_ROUTES.marketMapViewPath,
        };
      }

      if (activeRoute.startsWith(CUSTOMER_DEAL_ROUTES.dealBasePath)) {
        activeRoute = CUSTOMER_DEAL_ROUTES.dealBasePath;
      }
      if (activeRoute.startsWith(CUSTOMER_NEWS_ROUTES.newsBasePath)) {
        activeRoute = CUSTOMER_NEWS_ROUTES.newsBasePath;
      }
      if (activeRoute.startsWith(CUSTOMER_COMPANY_ROUTES.companyBasePath)) {
        activeRoute = CUSTOMER_COMPANY_ROUTES.companyBasePath;
      }
      if (activeRoute.startsWith(CUSTOMER_MARKET_ROUTES.marketBasePath)) {
        activeRoute = CUSTOMER_MARKET_ROUTES.marketBasePath;
      }
    }

    return (
      <Paper elevation={0} className={classes.bottomNav}>
        <MuiBottomNavigation
          value={activeRoute}
          >
          <Grid container justify="center" className={classes.container}>
            <Grid item xs={12}>
              <FormGroup row className={classes.row}>
                <Button className={classes.button}>
                  <FormControlLabel
                    control={<Switch checked={searchStore.coronaFilter.showReopen}
                                     onChange={(_, showReopen) => searchStore.setCoronaFilter({
                                                                                                  ...searchStore.coronaFilter,
                                                                                                  showReopen,
                                                                                                })}
                                     name="showReopen"/>}
                    label={locale.search.tabs.reopen}
                  />
                </Button>
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormGroup row className={classes.row} style={{float:'right'}}>
                <Button className={classes.button}>
                  <FormControlLabel
                    classes={{ label: classes.label }}
                    control={<Switch checked={searchStore.coronaFilter.showDelivery}
                                     onChange={(_, showDelivery) => searchStore.setCoronaFilter({
                                                                                                  ...searchStore.coronaFilter,
                                                                                                  showDelivery,
                                                                                                })}
                                     name="showDelivery"/>}
                    label={locale.search.tabs.delivery}
                  />
                </Button>
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormGroup row className={classes.row} style={{float:'left'}}>
                <Button className={classes.button}>
                  <FormControlLabel
                    classes={{ label: classes.label }}
                    control={<Switch checked={searchStore.coronaFilter.showTakeAway}
                                     onChange={(_, showTakeAway) => searchStore.setCoronaFilter({
                                                                                                  ...searchStore.coronaFilter,
                                                                                                  showTakeAway,
                                                                                                })}
                                     name="showTakeAway"/>}
                    label={locale.search.tabs.takeAway}
                  />
                </Button>
              </FormGroup>
            </Grid>
          </Grid>
        </MuiBottomNavigation>
      </Paper>
    );
  }
}

export const BottomNavigation = withStyles(styles)(_BottomNavigation);
