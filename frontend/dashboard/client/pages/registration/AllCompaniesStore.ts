import { FrontendError }                     from '@my-old-startup/common/error/FrontendError';
import { IApiCompany }                       from '@my-old-startup/common/interfaces/IApiCompany';
import { CommonRoutes, DashboardRoutes }     from '@my-old-startup/frontend-common/routes';
import { logService }                        from '@my-old-startup/frontend-common/services/LogService';
import { computed, observable, runInAction } from 'mobx';
import { dashboardCompanyFacade }            from '../../facade/DashboardCompanyFacade';
import { routeService }                      from '../../services/CdbRouteService';
import { companyStore }                      from '../../stores/CompanyStore';

class AllCompaniesStore {
  @observable
  private _companies: IApiCompany[] | undefined;

  @computed
  public get companies(): IApiCompany[] | undefined {
    return this._companies;
  }

  public set companies(companies: IApiCompany[] | undefined) {
    this._companies = companies;
  }

  public loadCompanies(): Promise<void> {
    return dashboardCompanyFacade.getOwnCompanies().then((companies = []) => {
      if (companies.length === 0) {
        // User has no companies yet
        routeService.routeTo(DashboardRoutes.Registration);
        return;
      }

      let defaultCompany = companies[0];
      try {

        // default selected company should always be the one found if the url, if it can be found
        const params = routeService.getParameterValues(DashboardRoutes.Dashboard);

        if (params && params.companyId) {
          const fromUrl = companies.find(s => s.id === params.companyId);
          if (fromUrl) {
            defaultCompany = fromUrl;
          }
        }
      } catch (e) {

      }

      runInAction(() => {
        this.companies              = undefined;
        companyStore.currentCompany = undefined;
        runInAction(() => {
          this.companies              = companies;
          companyStore.currentCompany = defaultCompany;
        });
      });

    }).catch((error: FrontendError) => {
      logService.error(error.toString(), error, error.statusCode);
      routeService.routeTo(CommonRoutes.Error);
    });
  }
}

export const allCompaniesStore = new AllCompaniesStore();
