import { Grid }               from '@material-ui/core';
import { IApiMarket }        from '@my-old-startup/common/interfaces/IApiMarket';
import * as React             from 'react';
import { DistanceShare }      from '../common/DistanceShare';
import { MarketContact }     from './MarketContact';
import { MarketShareButton } from './MarketShareButton';

type Props = {
  market: IApiMarket;
};

export const MarketDistanceShare = (props: Props): JSX.Element => {
  const { market} = props;

  return (
    <DistanceShare
      title={market.title}
      isCompany
      shareButton={(
        <MarketShareButton market={market}/>
      )}>
      <Grid container>
        <Grid item xs={9}>
          <MarketContact market={market}/>
        </Grid>
      </Grid>
    </DistanceShare>

  );
};
