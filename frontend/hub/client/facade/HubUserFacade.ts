import { IUrlAuthUserContext, IUrlUserContext } from '@my-old-startup/common/interfaces/contracts/IHubCompanyContract';
import { IHubApiCompany }                       from '@my-old-startup/common/interfaces/IApiCompany';
import { IHubApiUser }                          from '@my-old-startup/common/interfaces/IApiUser';
import { HUB_USER_ROUTES }                      from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }                       from '@my-old-startup/frontend-common/services/RequestService';
import { routeService }                         from '../services/HubRouteService';

class HubUserFacade {
  public async getAll(): Promise<IHubApiUser[]> {
    const result = await requestService.getFromApi<IHubApiUser[]>(HUB_USER_ROUTES.getAll);

    return result || [];
  }

  public async delete(context: IUrlUserContext): Promise<void> {
    const route = routeService.getRoute(HUB_USER_ROUTES.delete, context);
    return requestService.sendToApi(route);
  }

  public async getRestaurantsForOwner(context: IUrlAuthUserContext): Promise<IHubApiCompany[] | undefined> {
    const route = routeService.getRoute(HUB_USER_ROUTES.restaurants, context);
    return requestService.getFromApi<IHubApiCompany[]>(route);
  }
}

export const hubUserFacade = new HubUserFacade();
