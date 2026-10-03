import {
  BulkDealError,
  IApiDeal,
  IApiDealId,
  IBulkApiDeal,
  ICompanyUrlContext,
  IDealUrlContext,
}                         from '@my-old-startup/common/interfaces';
import { DEAL_ROUTES }    from '@my-old-startup/common/routes/ApiRoutes';
import { requestService } from '@my-old-startup/frontend-common/services/RequestService';
import { routeService }   from '../services/CdbRouteService';

class DashboardDealFacade {
  /**
   * Attempts to fetch a single deal by id and company id
   * @param {string} dealId - The ID of the deal to be fetched
   * @param {string} companyId - The company which owns the deal
   */
  public async get(
    dealId: string,
    companyId: string,
  ): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.get, {
      dealId,
      companyId,
    });
    return requestService.getFromApi<IApiDeal>(route);
  }

  public async getDeals(
    context: ICompanyUrlContext,
  ): Promise<IApiDeal[] | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.getAll, context);
    return requestService.getFromApi<IApiDeal[]>(route);
  }

  public async getDealId(
    context: ICompanyUrlContext,
  ): Promise<IApiDealId | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.getId, context);
    return requestService.getFromApi<IApiDealId>(route);
  }

  public async publish(context: IDealUrlContext): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.publish, context);
    return requestService.sendToApi<IApiDeal>(route);
  }

  public async delete(context: IDealUrlContext): Promise<void> {
    const route = routeService.getRoute(DEAL_ROUTES.delete, context);
    return requestService.sendToApi<void>(route);
  }

  public async create(
    deal: IApiDeal,
    companyId: string,
  ): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.create, { companyId });
    return requestService.sendToApi<IApiDeal, IApiDeal>(route, deal);
  }

  public async bulkPublish(
    deals: IApiDeal[],
    companyId: string,
  ): Promise<BulkDealError[] | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.bulkPublish, {
      companyId,
    });
    return requestService.sendToApi<BulkDealError[], IBulkApiDeal>(route, { deals });
  }

  public async updateDeal(
    deal: IApiDeal,
    companyId: string,
  ): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.update, {
      companyId,
      dealId: deal.id,
    });
    return requestService.sendToApi<IApiDeal, IApiDeal>(route, deal);
  }

  public async restoreImage(companyId: string, dealId: string): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.restoreImage, {
      companyId,
      dealId,
    });
    return requestService.sendToApi<IApiDeal>(route);
  }
}

export const dashboardDealFacade = new DashboardDealFacade();
