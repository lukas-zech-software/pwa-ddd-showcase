import {
  IApiCompany,
  IApiCompanyContact,
  IApiCompanyCorona,
  IApiCompanyDetails,
  IApiCompanyDishes,
  IApiCompanyImages,
  IApiCompanyOptionalInfo,
  IApiRegistrationInfo,
} from '@my-old-startup/common/interfaces';
import { COMPANY_ROUTES } from '@my-old-startup/common/routes/ApiRoutes';
import { requestService } from '@my-old-startup/frontend-common/services/RequestService';
import { routeService }   from '../services/CdbRouteService';
import { companyStore }   from '../stores/CompanyStore';

class DashboardCompanyFacade {
  /**
   * This breaks lazer boundaires ...
   */
  private onUpdate(): void {
    companyStore.clearDirty();
  }

  public async registerCompany(registrationInfo: IApiRegistrationInfo): Promise<void> {
    await requestService.sendToApi<void, IApiRegistrationInfo>(COMPANY_ROUTES.register, registrationInfo);
  }

  public async getOwnCompanies(): Promise<IApiCompany[] | undefined> {
    return requestService.getFromApi<IApiCompany[]>(COMPANY_ROUTES.own);
  }

  public async getCompany(companyId: string): Promise<IApiCompany | undefined> {
    return requestService.getFromApi<IApiCompany>(COMPANY_ROUTES.get, { companyId });
  }

  public async updateContact(companyContact: IApiCompanyContact, companyId: string): Promise<void> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateContact, { companyId });
    return requestService.sendToApi<void, IApiCompanyContact>(route, companyContact);
  }
  public async updateImages(apiCompanyImages: IApiCompanyImages, companyId: string): Promise<IApiCompanyImages | undefined> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateImages, { companyId });
    return requestService.sendToApi<IApiCompanyImages, IApiCompanyImages>(route, apiCompanyImages);
  }

  public async updateDetails(companyDetails: IApiCompanyDetails, companyId: string): Promise<void> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateDetails, { companyId });
    return requestService.sendToApi<void, IApiCompanyDetails>(route, companyDetails);
  }

  public async updateDishes(companyDishes: IApiCompanyDishes, companyId: string): Promise<void> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateDishes, { companyId });
    return requestService.sendToApi<void, IApiCompanyDishes>(route, companyDishes);
  }

  public async updateCorona(companyDetails: IApiCompanyCorona, companyId: string): Promise<void> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateCorona, { companyId });
    return requestService.sendToApi<void, IApiCompanyCorona>(route, companyDetails);
  }

  public async updateOptional(companyOptionalData: IApiCompanyOptionalInfo,
                              companyId: string): Promise<IApiCompany | undefined> {
    this.onUpdate();
    const route = routeService.getRoute(COMPANY_ROUTES.updateOptional, { companyId });
    return requestService.sendToApi<IApiCompany, IApiCompanyOptionalInfo>(route, companyOptionalData);
  }

  public async restoreMenuDocument(companyId: string): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.restoreMenuDocument, { companyId });
    return requestService.sendToApi<void>(route);
  }

  public async restoreLogo(companyId: string): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.restoreLogo, { companyId });
    return requestService.sendToApi<void>(route);
  }

  public async restoreImage(companyId: string): Promise<void> {
    const route = routeService.getRoute(COMPANY_ROUTES.restoreImage, { companyId });
    return requestService.sendToApi<void>(route);
  }

  public async getHistoryImages(companyId: string): Promise<string[] | undefined> {
    const route = routeService.getRoute(COMPANY_ROUTES.historyImages, { companyId });
    return requestService.getFromApi<string[]>(route);
  }

  public async getStockImages(): Promise<string[] | undefined> {
    return requestService.getFromApi<string[]>(COMPANY_ROUTES.stockImages);
  }
}

export const dashboardCompanyFacade = new DashboardCompanyFacade();
