import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  WithStyles,
  withStyles,
}                                    from '@material-ui/core';
import { IApiMarket }               from '@my-old-startup/common/interfaces/IApiMarket';
import * as React                    from 'react';
import { customerAnalyticsService }  from '../../services/customerAnalyticsService';
import { MapCardHeader }             from '../common/MapCardHeader';
import { VisibilitySensor }          from '../common/VisibilitySensor';
import { MarketCardButtons }        from './MarketCardButtons';
import { MarketDetailsMediaHeader } from './MarketDetailsMediaHeader';
import { MarketDistanceShare }      from './MarketDistanceShare';

const styles = (theme: Theme) =>
  // noinspection JSSuspiciousNameCombination
  createStyles({
                 root:        {
                   margin:                       '8px auto',
                   width:                        'calc(100% - 16px)',
                   [theme.breakpoints.up('md')]: {
                     maxWidth: '35vw',
                   },
                 },
                 contentCard: {
                   marginBottom:  0,
                   paddingBottom: 0,
                   whiteSpace:    'normal',
                 },
               });

type Props = {
  market: IApiMarket;
  onClose: () => void;
} & WithStyles<typeof styles>;

class _MarketMapCard extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, market, onClose } = this.props;

    return (
      <VisibilitySensor onChange={visible => {
        if (!visible) {
          return;
        }

        customerAnalyticsService.marketMapImpression({ market });
      }}
      >
        <Card elevation={1} className={classes.root}>
          <MapCardHeader onClose={onClose}/>

          <MarketDetailsMediaHeader
            market={market}
          />

          <CardContent className={classes.contentCard}>
            <MarketDistanceShare market={market}/>
          </CardContent>

          <CardActions>
            <MarketCardButtons market={market}/>
          </CardActions>
        </Card>
      </VisibilitySensor>
    );
  }
}

export const MarketMapCard = withStyles(styles)(_MarketMapCard);
