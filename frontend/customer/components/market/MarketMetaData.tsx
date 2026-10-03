import { CDN_BASE_URL }           from '@my-old-startup/common/enums/constants';
import { IApiMarket }             from '@my-old-startup/common/interfaces/IApiMarket';
import { CUSTOMER_MARKET_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import * as React                 from 'react';
import { getCompanySeoUrl }        from '../../../../common/utils/UrlUtils';

type Props = {
  market: IApiMarket;
};

export function MarketMetaData(props: Props): JSX.Element {
  const market        = props.market,
        city          = 'Köln',
        { id, title } = market,
        seoUrl        = getCompanySeoUrl(
          {
            id,
            title,
            city,
          },
          CUSTOMER_MARKET_ROUTES.marketDetails,
        ),
        jsonLd        = {
          '@context':                  'http://schema.org',
          '@type':                     'FoodEstablishment',
          '@id':                       seoUrl,
          'name':                      market.title,
          'image':                     {
            '@type':          'ImageObject',
            'description':    `The logo of ${market.title}`,
            'contentUrl':     `${CDN_BASE_URL}${market.image}`,
            'url':            `${CDN_BASE_URL}${market.image}`,
            'encodingFormat': 'image/jpg',
          },
          'address':                   {
            '@type':           'PostalAddress',
            'streetAddress':   market.address,
            'addressLocality': 'Köln',
            'postalCode':      '50667',
            'addressCountry':  'DE',
          },
          'geo':                       {
            '@type':     'GeoCoordinates',
            'latitude':  market.location.lat,
            'longitude': market.location.lng,
          },
          'url':                       seoUrl,
          'priceRange':                '$$',
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
  );
}
