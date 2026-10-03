import { CDN_BASE_URL }            from '@my-old-startup/common/enums/constants';
import { IApiCompany }             from '@my-old-startup/common/interfaces/IApiCompany';
import { OpeningHoursWeek }        from '@my-old-startup/common/interfaces/openingHours';
import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import { locale as commonLocale }  from '@my-old-startup/frontend-common/locales';
import { capitalize, getHourText } from '@my-old-startup/frontend-common/utils/format';
import * as React                  from 'react';
import { getCompanySeoUrl }        from '../../../../common/utils/UrlUtils';

type Props = {
  company: IApiCompany;
};

function convertOpeningHours(openingHours: OpeningHoursWeek | undefined): any[] | undefined {
  if (openingHours === undefined) {
    return;
  }

  // TODO: support multiple opening ranges
  return Object.keys(openingHours).map(key => {
    const dayKey = key as keyof OpeningHoursWeek;
    const currentDay = openingHours[dayKey];

    const result: any = {
      '@type':     'OpeningHoursSpecification',
      'dayOfWeek': `http://schema.org/${capitalize(dayKey)}`,
    };

    if (currentDay !== undefined && currentDay.length !== 0) {

      result.opens = currentDay[0].from;
      result.closes = currentDay[0].to;

      if (currentDay.length > 1) {
        result.closes = currentDay[currentDay.length - 1].to;
      }
    }

    result.opens = getHourText(result.opens);
    result.closes = getHourText(result.closes);

    return result;
  });
}

export function CompanyMetaData(props: Props): JSX.Element {
  const company = props.company,
        { id, contact: { title, city } } = company,
        seoUrl = getCompanySeoUrl(
          {
            id,
            title,
            city,
          },
          CUSTOMER_COMPANY_ROUTES.companyDetails,
        ),
        telephone = (company.contact.telephone || '').toString().replace(/^0/, ''),
        openingHours = convertOpeningHours(props.company.details.openingHours),
        jsonLd = {
          '@context': 'http://schema.org',
          '@type':    'FoodEstablishment',
          '@id':      seoUrl,
          'name':     company.contact.title,
          'image':    {
            '@type':          'ImageObject',
            'description':    `The logo of ${company.contact.title}`,
            'contentUrl':     `${CDN_BASE_URL}${company.images.logo}`,
            'url':            `${CDN_BASE_URL}${company.images.logo}`,
            'encodingFormat': 'image/jpg',
          },
          'address': {
            '@type':           'PostalAddress',
            'streetAddress':   company.contact.address,
            'addressLocality': company.contact.city,
            'postalCode':      company.contact.zipCode,
            'addressCountry':  'DE',
          },
          'geo': {
            '@type':     'GeoCoordinates',
            'latitude':  company.location.lat,
            'longitude': company.location.lng,
          },
          'url':                       company.contact.website || seoUrl,
          'telephone':                 `+49-${telephone}`,
          'openingHoursSpecification': openingHours,
          'menu':                      `${CDN_BASE_URL}${company.images.menuDocument}`,
          'acceptsReservations':       'True',
          'servesCuisine':             commonLocale.company.types[company.contact.type],
          'priceRange':                '$$',
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
  );
}
