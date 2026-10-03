import {
  IApiCompany,
  IApiCompanyMinimal,
}                                  from '@my-old-startup/common/interfaces/IApiCompany';
import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import * as React                  from 'react';
import { getCompanySeoUrl }        from '../../../../common/utils/UrlUtils';
import { ShareButton }             from '../common/ShareButton';

type Props = { company: IApiCompany | IApiCompanyMinimal };

const _CompanyShareButton: React.SFC<Props> = (props: Props) => {
  const { company } = props;

  const { id, contact: { title, city } } = company;

  let text         = `Finde ${title} bei my-old-startups-domain.de`;
  const apiCompany = company as IApiCompany;
  if (apiCompany.details) {
    text = apiCompany.details.description || '';
  }

  const companySeoUrl = getCompanySeoUrl({
                                           id,
                                           title,
                                           city,
                                         }, CUSTOMER_COMPANY_ROUTES.companyDetails);

  return (
    <ShareButton title={company.contact.title}
                 text={text}
                 url={'https://app.my-old-startups-domain.de' + companySeoUrl}
                 type="company"
                 company={company}
    />
  );
};

export const CompanyShareButton = (_CompanyShareButton);
