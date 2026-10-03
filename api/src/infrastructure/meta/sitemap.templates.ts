import { Cities, EnumUtils }       from '@my-old-startup/common/enums';
import { CUSTOMER_COMPANY_ROUTES } from '../../../../common/routes/FrontendRoutes';
import { getCompanySeoUrl }        from '../../../../common/utils/UrlUtils';
import { ICompany }                from '../../ddd/interfaces';

const cities =[
  'Köln',
  'Düsseldorf',
  'Dortmund',
  'Essen',
  'Duisburg',
  'Bochum',
  'Wuppertal',
  'Bielefeld',
  'Bonn',
  'Münster',
];

function getStaticContentTags(): string {
  return `<url>
              <loc>https://app.my-old-startups-domain.de/company/list</loc>
              <changefreq>daily</changefreq>
              <priority>0.5</priority>
          </url>
          <url>
              <loc>https://app.my-old-startups-domain.de/company/map</loc>
              <changefreq>daily</changefreq>
              <priority>0.6</priority>
          </url>
          <url>
              <loc>https://app.my-old-startups-domain.de/company/filter</loc>
              <changefreq>monthly</changefreq>
              <priority>0.5</priority>
          </url>`;
}

function getCityTags(): string {
  return cities
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map((city: any) => `<url>
              <loc>https://app.my-old-startups-domain.de/company/list/${city}</loc>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
          </url>`)
    .join('');
}

function getCompanyTag(baseUrl: string, company: ICompany): string {
  const lastModified = new Date(company.updated);

  return `<url>
              <loc>${baseUrl}${getCompanySeoUrl(
  company,
  CUSTOMER_COMPANY_ROUTES.companyDetails,
)}</loc>
              <lastmod>${lastModified.toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.8</priority>
          </url>`;
}

export function getSitemapRoot(
  baseUrl: string,
  companies: ICompany[],
): string {
  return `<?xml version="1.0" encoding="utf-8"?>
          <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
             ${getStaticContentTags()}
             ${getCityTags()}
             ${companies
    .map((c) => getCompanyTag(baseUrl, c))
    .join('')}
          </urlset>`;
}
