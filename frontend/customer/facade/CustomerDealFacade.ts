import {
  ApiFilterSearchRequest,
  ApiSearchCompanyRequest,
  ApiSearchDealRequest,
  ApiSearchDealResponse,
  ApiSearchResponse,
  ApiSearchResponseMinimal,
}                                     from '@my-old-startup/common/interfaces/common';
import {
  ApiFacadeResponse,
  ApiRequest,
}                                     from '@my-old-startup/common/interfaces/contracts';
import { ICustomerDealContract }      from '@my-old-startup/common/interfaces/contracts/ICustomerDealContract';
import { CUSTOMER_DEAL_ROUTES }       from '@my-old-startup/common/routes/ApiRoutes';
import { unauthorizedRequestService } from '@my-old-startup/frontend-common/services/UnauthorizedRequestService';
import { getRoute }                   from '../common/routeUtils';

class CustomerDealFacade implements ICustomerDealContract {
  public getById(
    searchRequest: ApiRequest<void, ApiSearchDealRequest>,
  ): ApiFacadeResponse<ApiSearchDealResponse> {
    if (!searchRequest.url) {
      throw new Error('No URL provided: ' + JSON.stringify(searchRequest));
    }

    const { companyId, dealId } = searchRequest.url;

    return unauthorizedRequestService.getFromApi<ApiSearchDealResponse>(
      getRoute(CUSTOMER_DEAL_ROUTES.getForId, { companyId, dealId }),
    );
  }

  public getForFilter(
    searchRequest: ApiRequest<ApiFilterSearchRequest>,
  ): ApiFacadeResponse<ApiSearchResponse> {
    return unauthorizedRequestService
      .sendToApi<ApiSearchResponse, ApiFilterSearchRequest>(CUSTOMER_DEAL_ROUTES.getForFilter, searchRequest.body);
  }


  public getMinimal(
    searchRequest: ApiRequest<ApiFilterSearchRequest>,
  ): ApiFacadeResponse<ApiSearchResponseMinimal> {
    return unauthorizedRequestService
      .sendToApi<ApiSearchResponseMinimal, ApiFilterSearchRequest>(CUSTOMER_DEAL_ROUTES.getForFilterMinimal, searchRequest.body);
  }

  public getTop(): ApiFacadeResponse<ApiSearchDealResponse[]> {
    return unauthorizedRequestService.getFromApi<ApiSearchDealResponse[]>(
      CUSTOMER_DEAL_ROUTES.getTop,
    );
  }

  public async getThisWeeksDealsByCompany(
    searchRequest: ApiRequest<ApiSearchCompanyRequest>,
  ): ApiFacadeResponse<ApiSearchResponse> {
    return unauthorizedRequestService
      .sendToApi<ApiSearchResponse, ApiSearchCompanyRequest>(CUSTOMER_DEAL_ROUTES.getThisWeeksDealsByCompany,
                                                             searchRequest.body);
  }
}

export const customerDealFacade = new CustomerDealFacade();
