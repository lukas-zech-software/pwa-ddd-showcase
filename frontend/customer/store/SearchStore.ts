import { ApiSearchResponseMinimal } from '@my-old-startup/common/interfaces/common';
import {
  action,
  computed,
  observable,
}                                   from 'mobx';
import {
  IApiCompanyMinimal,
  IApiCompanyMinimalTransport,
  IApiMarket,
}                                   from '../../../common/interfaces';
import {
  CompanySearchResultMinimal,
  DealSearchResult,
}                                   from '../common/types';

class MinimalAdapter {
  public static transportToMinimal(transport: IApiCompanyMinimalTransport): IApiCompanyMinimal {
    return {
      id:       transport.id,
      distance:       transport.distance,
      corona:   {
        offersReopen:     !!transport.corona[0],
        offersDelivery:   !!transport.corona[1],
        offersTakeAway:   !!transport.corona[2],
        offersCoupons:    !!transport.corona[3],
        acceptsDonations: !!transport.corona[4],
        openRestrictions: {
          indoor:               transport.openRestrictions[0],
          outdoor:              transport.openRestrictions[1],
          reservationNecessary: transport.openRestrictions[2],
          phoneReservations:    transport.openRestrictions[3],
          maxPersonCount:       transport.openRestrictions[4],
          maxStayTime:          transport.openRestrictions[5],
        },
      },
      images:   {
        logo:       transport.logo,
        background: transport.background,
      },
      contact:  {
        type:                     transport.type,
        title:                    transport.title,
        address:                  transport.address,
        city:                     transport.city,
        zipCode:                  transport.zip,
        telephone:                transport.tel,
        secondaryTelephone:       transport.tel2,
        secondaryTelephoneReason: transport.tel2Reason,
      },
      location: {
        lat: transport.lat,
        lng: transport.lng,
      },
    };
  }
}

/**
 * Currently is the same as the response, but that might change
 */
export type SerializedSearchStore = ApiSearchResponseMinimal;
export type CoronaFilter = {
  showReopen: boolean;
  showDelivery: boolean;
  showTakeAway: boolean;
  showCoupons: boolean;
  showRetail: boolean;
  showDonations: boolean;
}

export class SearchStore {
  private hydrated: boolean = false;
  @observable
  public selectedResultId: string | undefined         = undefined;

  @observable
  public isOffline: boolean = false;

  @observable
  private _currentSortedDealResults: DealSearchResult[] = [];

  @observable
  private _currentSortedNewsResults: DealSearchResult[] = [];

  @observable
  private _currentSortedCompanyResults: CompanySearchResultMinimal[]   = [];
  @observable
  private _currentFilteredCompanyResults: CompanySearchResultMinimal[] = [];

  @observable
  private _currentSortedMarketResults: IApiMarket[] = [];

  /**
   * The last Response that was the source of this store.
   * Used to serialise it later
   */
  private _currentResponse: ApiSearchResponseMinimal | undefined;

  // Flag to check if the store has loaded results at least once
  @observable
  private _hasLoadedOnce = false;
  @computed
  public get hasLoadedOnce(): boolean {
    return this._hasLoadedOnce;
  }

  @observable
  private _isLoading = false;

  @observable
  private _isSearchOpen = false;

  @observable
  public coronaFilter: CoronaFilter = {
    showReopen:    true,
    showDelivery:  true,
    showTakeAway:  true,
    showCoupons:   true,
    showDonations: true,
    showRetail:    true,
  };

//CORONA
  @computed
  public get currentCompanyResults(): CompanySearchResultMinimal[] {
    return this._currentFilteredCompanyResults;
  }

  @computed
  public get isSearchOpen(): boolean {
    return this._isSearchOpen;
  }

  @action
  public setIsSearchOpen(value: boolean): void {
    this._isSearchOpen = value;
  }

  @computed
  public get isLoading(): boolean {
    return this._isLoading;
  }

  @action
  public setLoading(value: boolean): void {
    this._isLoading = value;
  }

  @computed
  public get currentDealResults(): DealSearchResult[] {
    return this._currentSortedDealResults;
  }

  @computed
  public get currentNewsResults(): DealSearchResult[] {
    return this._currentSortedNewsResults;
  }

//CORONA
  // @computed
  // public get currentCompanyResults(): CompanySearchResult[] {
  //   return this._currentSortedCompanyResults;
  // }

  @action
  public resetCoronaFilter(): void {
    this.coronaFilter = {
      showReopen:    true,
      showDelivery:  true,
      showTakeAway:  true,
      showCoupons:   true,
      showDonations: true,
      showRetail:    true,
    };
  }

  @action
  public setCoronaFilter(filter: CoronaFilter): void {
    this.coronaFilter                  = filter;
    this._currentFilteredCompanyResults = this._currentSortedCompanyResults.filter((company) => {
      const offersNothingButCouponsAndDonation = (
        !company.company.corona.offersReopen
        &&
        !company.company.corona.offersDelivery
        &&
        !company.company.corona.offersTakeAway
      ) && (company.company.corona.offersCoupons || company.company.corona.acceptsDonations);

      // if no filter is set show those who offer nothing but coupons and donation
      if (offersNothingButCouponsAndDonation) {
        return true;
      }

      return (company.company.corona.offersReopen && filter.showReopen)
        ||
        (company.company.corona.offersDelivery && filter.showDelivery)
        ||
        (company.company.corona.offersTakeAway && filter.showTakeAway);
    });
  }

  @computed
  public get currentMarketResults(): IApiMarket[] {
    return this._currentSortedMarketResults;
  }

  @action
  public setCurrentMarketResults(markets: IApiMarket[]): void {
    this._currentSortedMarketResults = markets;
  }

  constructor() {
    this._currentSortedDealResults      = [];
    this._currentSortedCompanyResults   = [];
    this._currentFilteredCompanyResults = [];
    this._currentSortedMarketResults    = [];

  }

  @action
  public setSearchResponse(response: ApiSearchResponseMinimal): void {
    this._hasLoadedOnce   = true;
    this._currentResponse = response;
    //this._currentSortedDealResults = [];
    //this._currentSortedCompanyResults = [];

    const dealResults: Array<DealSearchResult>                    = [];
    const companyResults: Map<string, CompanySearchResultMinimal> = new Map();

    response.results.forEach((company) => {
      companyResults.set(company.id, {
        company: MinimalAdapter.transportToMinimal(company),
      });
    });

    this.setSortedResults(dealResults, companyResults);

    if (this.currentMarketResults.length === 0) {
      //searchService.searchMarketsAsync();
    }
  }

  @action
  public setIsOffline(value: boolean): void {
    this.isOffline = value;
  }

  /**
   * Provide a serialised version of the store, that can be transferred to the client
   */
  public serialise(): SerializedSearchStore | undefined {
    return this._currentResponse;
  }

  /**
   * Rehydrate the current instance of the store with a serialised version
   * @param state
   */
  public hydrate(state: SerializedSearchStore): void {
    if (this.hydrated) {
      return;
    }
    this.hydrated = true;
    this.setSearchResponse(state);
  }

  @action
  private setSortedResults(dealResults: Array<DealSearchResult>, companyResults: Map<string, CompanySearchResultMinimal>,
  ): void {
    // CORONA
    /*const activeDeals: DealSearchResult[]   = [];
    const upcomingDeals: DealSearchResult[] = [];

    dealResults
      .filter(x => isSpecialType(x.deal.type) === false)
      .forEach(x => {
        if (x.deal.date.validFrom <= Date.now()) {
          activeDeals.push(x);
        } else {
          upcomingDeals.push(x);
        }
      });

    activeDeals.sort(
      (a, b) => a.deal.date.validFrom - b.deal.date.validFrom,
    );
    activeDeals.sort((a, b) => a.distance - b.distance);

    upcomingDeals.sort((a, b) => a.distance - b.distance);
    upcomingDeals.sort(
      (a, b) => a.deal.date.validFrom - b.deal.date.validFrom,
    );

    this._currentSortedDealResults = [...activeDeals, ...upcomingDeals];
    // NEWS

    const activeNews: DealSearchResult[]   = [];
    const upcomingNews: DealSearchResult[] = [];

    dealResults
      .filter(x => isSpecialType(x.deal.type) === true)
      .forEach(x => {
        if (x.deal.date.validFrom <= Date.now()) {
          activeNews.push(x);
        } else {
          upcomingNews.push(x);
        }
      });
    this._currentSortedNewsResults    = [...activeNews, ...upcomingNews];
    */

    this._currentSortedCompanyResults = Array.from(companyResults.values());
    //Apply corona filter on new results
    this.setCoronaFilter(this.coronaFilter);
  }
}

export let searchStore = new SearchStore();
