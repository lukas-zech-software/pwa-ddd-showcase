import { IApiDealAccount } from '@my-old-startup/common/interfaces/IApiDealAccount';
import { COMPANY_ROUTES }  from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }  from '@my-old-startup/frontend-common/services/RequestService';
import { routeService }    from '../services/CdbRouteService';

class DashboardDealAccountFacade {
  public async getDealAccount(companyId: string): Promise<IApiDealAccount | undefined> {
    const route = routeService.getRoute(COMPANY_ROUTES.dealAccount, { companyId });
    return requestService.getFromApi<IApiDealAccount>(route);
  }
}

export const dashboardDealAccountFacade = new DashboardDealAccountFacade();
