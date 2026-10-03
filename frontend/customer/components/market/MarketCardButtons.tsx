import {
  Button,
  createStyles,
  WithStyles,
  withStyles,
}                                   from '@material-ui/core';
import { IApiMarket }               from '@my-old-startup/common/interfaces';
import { CUSTOMER_MARKET_ROUTES }   from '@my-old-startup/common/routes/FrontendRoutes';
import { locale as commonLocale }   from '@my-old-startup/frontend-common/locales';
import * as React                   from 'react';
import { marketNavigationEvent }    from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import {
  getRoute,
  pushRoute,
}                                   from '../../common/routeUtils';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { openGoogleMapsRoute }      from '../map/mapUtils';

const styles = () => createStyles(
  {
    detailButton: {
      width: '100%',
    },
  },
);

type Props = { market: IApiMarket } & WithStyles<typeof styles>;

const _MarketCardButtons: React.SFC<Props> = (props: Props) => {
  const { market, classes } = props;

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        className={classes.detailButton}
        component={
          // Fuck MUI Typings
          // Possible issue to track: https://github.com/mui-org/material-ui/issues/15695
          'a' as unknown as any
        }
        /*Link for SEO*/
        href={getRoute(CUSTOMER_MARKET_ROUTES.marketDetails, {
          marketId: market.id,
        })}
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          void pushRoute(CUSTOMER_MARKET_ROUTES.marketDetailsPath, CUSTOMER_MARKET_ROUTES.marketDetails, {
            marketId: market.id,
          });
        }}>
        {commonLocale.market.types[market.type]}
      </Button>
      <Button variant="contained"
              size="small"
              color="primary"
              onClick={e => {
                e.stopPropagation();
                const gaEvent = marketNavigationEvent({ market });
                customerAnalyticsService.trackEvent(gaEvent);
                openGoogleMapsRoute(market.location);
              }}
              className={classes.detailButton}>
        {locale.listView.card.toDeal}
      </Button>
    </>
  );
};

export const MarketCardButtons = withStyles(styles)(_MarketCardButtons);
