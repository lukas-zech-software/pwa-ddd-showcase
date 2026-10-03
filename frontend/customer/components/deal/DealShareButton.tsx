import { IApiCompany }             from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }                from '@my-old-startup/common/interfaces/IApiDeal';
import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import * as React                  from 'react';
import { getRoute }                from '../../common/routeUtils';
import { ShareButton }             from '../common/ShareButton';

type Props = {
  company: IApiCompany;
  deal: IApiDeal;
};

export const DealShareButton: React.SFC<Props> = (props: Props) => {
  const { company, deal } = props;

  return (
    <ShareButton title={deal.description.title}
                 text={deal.description.description}
                 url={'https://app.my-old-startups-domain.de' + getRoute(CUSTOMER_COMPANY_ROUTES.dealDetails, {
                   dealId:    deal.id,
                   companyId: company.id,
                 })}
                 deal={deal}
                 company={company}
    />

  );
};
