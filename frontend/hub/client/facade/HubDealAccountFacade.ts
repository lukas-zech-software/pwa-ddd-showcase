import { IApiDealAccount }         from '@my-old-startup/common/interfaces/IApiDealAccount';
import { ICompanyUrlContext }      from '@my-old-startup/common/interfaces/urlContexts';
import { HUB_DEAL_ACCOUNT_ROUTES } from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }          from '@my-old-startup/frontend-common/services/RequestService';
import { routeService }            from '../services/HubRouteService';

class HubDealAccountFacade {
  public async getAll(): Promise<IApiDealAccount[]> {
    const result = await requestService.getFromApi<IApiDealAccount[]>(HUB_DEAL_ACCOUNT_ROUTES.getAll);

    return result || [];
  }

  public async setDealAccount(context: ICompanyUrlContext, dealsRemaining: number): Promise<void> {
    const route = routeService.getRoute(HUB_DEAL_ACCOUNT_ROUTES.setDealAccount, context);
    return requestService.sendToApi(route, { dealsRemaining });
  }
}

export const hubDealAccountFacade = new HubDealAccountFacade();
