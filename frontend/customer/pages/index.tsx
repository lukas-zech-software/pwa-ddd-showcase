import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import Router                      from 'next/router';
import * as React                  from 'react';

export default class Pages extends React.Component {
  public static async getInitialProps({ res }: any): Promise<{}> {
    if (res) {
      res.writeHead(302, {
        Location: CUSTOMER_COMPANY_ROUTES.companyMapViewPath,
      });
      res.end();
    } else {
      void Router.push(CUSTOMER_COMPANY_ROUTES.companyMapViewPath);
    }
    return {};
  }
}
