import { IHubApiCompany }     from '@my-old-startup/common/interfaces/IApiCompany';
import { ICompanyUrlContext } from '@my-old-startup/common/interfaces/urlContexts';
import { COMPANY_ROUTES }     from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }     from '@my-old-startup/frontend-common/services/RequestService';
import { FrontendError }      from '../../../../common/error/FrontendError';
import { HttpStatusCode }     from '../../../../common/http/HttpStatusCode';
import { routeService }       from '../services/HubRouteService';

class HubCompanyFacade {
  public async getAll(): Promise<IHubApiCompany[]> {
    const result = await requestService.getFromApi<IHubApiCompany[]>(COMPANY_ROUTES.all);
    return result || [];
  }

  public async approve(context: ICompanyUrlContext): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.approve, context);
    return requestService.sendToApi(route);
  }

  public async delete(context: ICompanyUrlContext): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.delete, context);
    return requestService.sendToApi(route);
  }

  public async testData(context: ICompanyUrlContext): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.testData, context);
    return requestService.sendToApi(route);
  }

  public async actAsOwner(context: ICompanyUrlContext): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.actAsOwner, context);
    return requestService.sendToApi(route);
  }

  public async stopActingAsOwner(context: ICompanyUrlContext): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.stopActingAsOwner, context);
    return requestService.sendToApi(route);
  }

  public async clone(context: ICompanyUrlContext): Promise<IHubApiCompany> {
    const route = routeService.getRoute(COMPANY_ROUTES.clone, context);
    const result = await  requestService.sendToApi<IHubApiCompany>(route);

    if (result===undefined){
      throw new FrontendError('Company could not be cloned', HttpStatusCode.INTERNAL_SERVER_ERROR);
    }

    return result;
  }
}

export const hubCompanyFacade = new HubCompanyFacade();
