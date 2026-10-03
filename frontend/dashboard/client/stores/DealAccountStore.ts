import { IApiDealAccount }              from '@my-old-startup/common/interfaces';
import { action, computed, observable } from 'mobx';
import { dashboardDealAccountFacade }   from '../facade/DashboardDealAccountFacade';
import { companyStore }                 from './CompanyStore';

class DealAccountStore {
  @observable
  public dealAccount: IApiDealAccount | undefined;

  @computed
  public get dealsRemaining(): number {
    if (this.dealAccount === undefined) {
      // eslint-disable-next-line no-console
      console.warn('attempted to get deals remaining from an undefined deal account, falling back to 0');
      return 0;
    }

    return this.dealAccount.dealsRemaining;
  }

  @action
  public async refresh(): Promise<void> {
    const company = companyStore.currentCompany;

    if (company === undefined) {
      return;
    }

    this.dealAccount = await dashboardDealAccountFacade.getDealAccount(company.id);
  }
}

export const dealAccountStore = new DealAccountStore();
