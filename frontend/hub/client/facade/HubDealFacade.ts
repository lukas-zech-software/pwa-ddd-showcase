import { IApiAggregateDeal } from '@my-old-startup/common/interfaces/IApiDeal';
import { HUB_DEAL_ROUTES }   from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }    from '@my-old-startup/frontend-common/services/RequestService';

class HubDealFacade {
  public async getAllForCurrentMonth(): Promise<IApiAggregateDeal[]> {
    const result = await requestService.sendToApi<IApiAggregateDeal[]>(HUB_DEAL_ROUTES.getAllForCurrentMonth);

    return result || [];
  }
}

export const hubDealFacade = new HubDealFacade();
