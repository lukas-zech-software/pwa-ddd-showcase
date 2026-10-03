import {
  ApiFacadeResponse,
  ApiRequest,
}                                     from '@my-old-startup/common/interfaces/contracts';
import { IMarketUrlContext }          from '@my-old-startup/common/interfaces/urlContexts';
import { CUSTOMER_MARKET_ROUTES }     from '@my-old-startup/common/routes/ApiRoutes';
import { unauthorizedRequestService } from '@my-old-startup/frontend-common/services/UnauthorizedRequestService';
import {
  ApiMarketResponse,
  ApiSearchMarketResponse,
  IApiMarket,
} from '../../../common/interfaces';
import { getRoute }                   from '../common/routeUtils';

class CustomerMarketFacade {
  public async getForId(input: ApiRequest<void, IMarketUrlContext>): ApiFacadeResponse<IApiMarket> {
    const result = await unauthorizedRequestService.getFromApi<ApiMarketResponse>(
      getRoute(CUSTOMER_MARKET_ROUTES.getForId, input.url),
    );

    return result ? result.market : undefined;
  }
  public async getForfilter(): ApiFacadeResponse<IApiMarket[]> {
    //const result = await unauthorizedRequestService.sendToApi<ApiSearchMarketResponse>(
    //  getRoute(CUSTOMER_MARKET_ROUTES.getForFilter),
    //);

    return []// result ? result.markets : undefined;
  }
}

export const customerMarketFacade = new CustomerMarketFacade();
