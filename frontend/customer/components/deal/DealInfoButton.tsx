import { IconButton }              from '@material-ui/core';
import { InfoOutlined }            from '@material-ui/icons';
import * as React                  from 'react';
import {
  IApiCompany,
  IApiDeal,
} from '../../../../common/interfaces';
import { CUSTOMER_COMPANY_ROUTES } from '../../../../common/routes/FrontendRoutes';
import {
  getRoute,
  pushRoute,
}                                  from '../../common/routeUtils';

type Props = {
  company: IApiCompany;
  deal: IApiDeal;
};

export const DealInfoButton: React.SFC<Props> = (props: Props) => {
  const { company, deal } = props;

  return (
    <IconButton
      aria-label="News Info"
      component={
        // Fuck MUI Typings
        // Possible issue to track: https://github.com/mui-org/material-ui/issues/15695
        'a' as unknown as any
      }
      /*Link for SEO*/
      href={getRoute(CUSTOMER_COMPANY_ROUTES.dealDetails, {
        dealId:    deal.id,
        companyId: company.id,
      })}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        void pushRoute(CUSTOMER_COMPANY_ROUTES.newsDetailsPath, CUSTOMER_COMPANY_ROUTES.dealDetails, {
          dealId:    deal.id,
          companyId: company.id,
        });
      }}
    >
      <InfoOutlined/>
    </IconButton>
  );
};
