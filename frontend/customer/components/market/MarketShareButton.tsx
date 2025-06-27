import { IApiMarket }             from '@my-old-startup/common/interfaces/IApiMarket';
import { CUSTOMER_MARKET_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import * as React                  from 'react';
import { getRoute }                from '../../common/routeUtils';
import { ShareButton }             from '../common/ShareButton';

type Props = { market: IApiMarket };

const _MarketShareButton: React.SFC<Props> = (props: Props) => {
  const { market } = props;

  return (
    <ShareButton title={market.title}
                 text={market.description || ''}
                 url={'https://app.my-old-startups-domain.de' + getRoute(CUSTOMER_MARKET_ROUTES.marketDetails, {
                   marketId: market.id,
                 })}
                 type="company"
    />
  );
};

export const MarketShareButton = (_MarketShareButton);
