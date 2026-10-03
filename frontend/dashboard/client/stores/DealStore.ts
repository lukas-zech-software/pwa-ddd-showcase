import {
  IApiCompany,
  IApiDeal,
}                               from '@my-old-startup/common/interfaces';
import { globalMessageService } from '@my-old-startup/frontend-common/services/GlobalMessageService';
import {
  action,
  computed,
  observable,
}                               from 'mobx';
import { locale }               from '../common/locales';
import { dashboardDealFacade }  from '../facade/DashboardDealFacade';

class DealStore {

  @observable
  private _isLoading = false;

  @observable
  private _allDeals: IApiDeal[] = [];

  @computed
  public get allDeals(): IApiDeal[] | undefined {
    if (this._isLoading) {
      return undefined;
    }

    return this._allDeals;
  }

  /**
   * All deals in the past - published and unpublished — sorted in descending validFrom order
   * Returns undefined if deals are loading.
   */
  @computed
  public get dealsArchive(): IApiDeal[] | undefined {
    if (this._isLoading) {
      return undefined;
    }

    return this._allDeals
      .filter((deal) => deal.date.validTo < Date.now().valueOf() && deal.isStatic !== true)
      .sort((a, b) => b.date.validFrom - a.date.validFrom);
  }

  @computed
  public get dealsUpcoming(): IApiDeal[] | undefined {
    if (this._isLoading) {
      return undefined;
    }

    return this._allDeals
      .filter((deal) => deal.date.validTo >= Date.now().valueOf() || deal.isStatic === true)
      .sort((a, b) => a.date.validFrom - b.date.validFrom);
  }

  @computed
  public get drafts(): IApiDeal[] | undefined {
    if (this._isLoading) {
      return undefined;
    }

    return this._allDeals
      .filter((deal) => deal.published === null)
      .sort((a, b) => b.date.validFrom - a.date.validFrom);
  }

  @computed
  public get nextPublishedDeals(): IApiDeal[] | undefined {
    if (this._isLoading) {
      return undefined;
    }

    return this._allDeals
      .filter((deal) => deal.published !== null && deal.date.validTo > Date.now())
      .sort((a, b) => b.date.validFrom - a.date.validFrom);
  }

  /**
   * Will return the "hottest deal", currently just the most recent published deal
   */
  @computed
  public get hotDeal(): IApiDeal | undefined {
    return this._allDeals
      .filter((deal) =>
                deal.published && deal.date.validTo < Date.now().valueOf())
      .sort((a, b) => a.date.validTo < b.date.validTo ? 1 : -1)[0];
  }

  @action
  public setAllDeals(deals: IApiDeal[]): void {
    this._allDeals = deals;
  }

  @action
  public addDeal(newDeal: IApiDeal): void {
    const existingIndex = this._allDeals.findIndex((deal) => deal.id === newDeal.id);

    // A deal with the same id already exists
    if (existingIndex !== -1) {
      this._allDeals[existingIndex] = newDeal;
      return;
    }

    this._allDeals.push(newDeal);
  }

  @action
  public deleteDeal(dealToDelete: IApiDeal): void {
    const allDeals = this._allDeals;

    this._allDeals = allDeals.filter((deal) => deal.id !== dealToDelete.id);
  }

  @action
  public fetchAllDeals(company: IApiCompany): void {
    // If the company is not created in the database, it will have no `id` and also no deals to fetch
    if (company.id === undefined) {
      return;
    }

    this._isLoading = true;

    dashboardDealFacade.getDeals({ companyId: company.id })
      .then((maybeDeals) => {
        this._allDeals = maybeDeals || [];
      })
      .catch(() => {
        globalMessageService.pushMessage({
                                           message: locale.dashboard.dealsPage.messages.dealsFetchFailed(company),
                                           variant: 'error',
                                         });
      })
      .finally(() => this._isLoading = false);
  }
}

export const dealStore = new DealStore();
