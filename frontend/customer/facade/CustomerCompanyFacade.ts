import { ApiFacadeResponse, ApiRequest } from '@my-old-startup/common/interfaces/contracts';
import { ICustomerCompanyContract }      from '@my-old-startup/common/interfaces/contracts/ICustomerCompanyContract';
import { IApiCompany }                   from '@my-old-startup/common/interfaces/IApiCompany';
import { ICompanyUrlContext }            from '@my-old-startup/common/interfaces/urlContexts';
import { CUSTOMER_DEAL_ROUTES }          from '@my-old-startup/common/routes/ApiRoutes';
import { unauthorizedRequestService }    from '@my-old-startup/frontend-common/services/UnauthorizedRequestService';
import { getRoute }                      from '../common/routeUtils';

class CustomerCompanyFacade implements ICustomerCompanyContract {
  public getForId(
    input: ApiRequest<void, ICompanyUrlContext>,
  ): ApiFacadeResponse<IApiCompany> {
    return unauthorizedRequestService.getFromApi<IApiCompany>(
      getRoute(CUSTOMER_DEAL_ROUTES.getCompany, input.url),
    );
  }
}

export const customerCompanyFacade = new CustomerCompanyFacade();
