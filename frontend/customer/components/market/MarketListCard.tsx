import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IApiMarket }               from '@my-old-startup/common/interfaces';
import { CUSTOMER_MARKET_ROUTES }   from '@my-old-startup/common/routes/FrontendRoutes';
import { WithRouterProps }          from 'next/dist/client/with-router';
import { withRouter }               from 'next/router';
import * as React                   from 'react';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { Paragraphs }               from '../common/Paragraphs';
import { VisibilitySensor }         from '../common/VisibilitySensor';
import { MarketCardButtons }        from './MarketCardButtons';
import { MarketDetailsMediaHeader } from './MarketDetailsMediaHeader';
import { MarketDistanceShare }      from './MarketDistanceShare';

const styles = (theme: Theme) => createStyles(
  {
    card:        {
      margin:    theme.spacing(2),
      marginTop: 0,
    },
    lowerAction: {
      paddingTop: 0,
    },
    actionRoot:  {
      paddingTop:   theme.spacing(2),
      paddingLeft:  theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
);

type Props = {
  market: IApiMarket;
  distance?: number;
} & WithStyles<typeof styles> & WithRouterProps;

class _MarketListCard extends React.Component<Props> {

  public componentDidMount(): void {
    void this.props.router.prefetch(CUSTOMER_MARKET_ROUTES.marketDetailsPath);
  }

  public render(): React.ReactNode {
    const { classes, market, distance = 0 } = this.props;

    return (
      <VisibilitySensor onChange={visible => {
        if (!visible) {
          return;
        }

        customerAnalyticsService.marketListImpression({ market });
      }}
      >
        <Card
          className={classes.card}
          elevation={4}>

          <MarketDetailsMediaHeader market={market}/>

          <CardActions classes={{ root: classes.actionRoot }}>
            <MarketDistanceShare market={market}/>
          </CardActions>

          <CardContent>
            <Paragraphs text={market.description}/>
          </CardContent>

          <CardActions className={classes.lowerAction}>
            <MarketCardButtons market={market}/>
          </CardActions>
        </Card>
      </VisibilitySensor>
    );
  }
}

export const MarketListCard = withRouter(withStyles(styles)(_MarketListCard));
