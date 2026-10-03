import { CompanyFilter }          from '@my-old-startup/common/interfaces/common';
import { IS_SERVER }              from '@my-old-startup/frontend-common/constants';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }             from '@my-old-startup/frontend-common/services/LogService';
import { toJS }                   from 'mobx';
import error                      from 'next/error';
import Router                     from 'next/router';
import { CUSTOMER_COMMON_ROUTES } from '../../../common/routes/FrontendRoutes';
import { locale }                 from '../common/locales';
import { mapService }             from '../components/map/MapService';
import { customerDealFacade }     from '../facade/CustomerDealFacade';
import { customerMarketFacade }   from '../facade/CustomerMarketFacade';
import { filterStore }            from '../store/FilterStore';
import { locationStore }          from '../store/LocationStore';
import { searchStore }            from '../store/SearchStore';

const searchTextRegexp = new RegExp('searchText=(.+)&?');

function getSearchText(): string | undefined {
  if (IS_SERVER === false) {
    const match = window.location.search.match(searchTextRegexp);
    if (match) {
      try {
        return decodeURIComponent(match[1]);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return undefined;
}

class SearchService {
  public isMapExtendedSearch: boolean = false;
  private isSearchRunning: boolean    = false;

  constructor() {

    if (IS_SERVER) {
      return;
    }

    if (window.location.pathname.includes('/list')) {
      return;
    }

    const searchText = getSearchText();

    if (searchText) {
      this.isSearchRunning = true;
      void this.searchByText(searchText, true);
    }

  }

  private async searchFull(filter: CompanyFilter): Promise<void> {
    const [response, marketResponse] = await Promise.all([
                                                           customerDealFacade.getMinimal({ body: { filter: toJS(filter) } }),
                                                           // CORONA
                                                           //customerMarketFacade.getForfilter(),
                                                         ]);

    if (response === undefined) {
      globalMessageService.pushMessage({
                                         message: locale.error.defaultErrorMessage,
                                         variant: 'error',
                                       });
      logService.error('No search result', error);
      return;
    }

    searchStore.setSearchResponse(response);

  }

  public async search(init: boolean = false): Promise<void> {
    if (searchStore.isOffline) {
      return;
    }

    if (this.isSearchRunning && init === false) {
      return;
    }

    this.isSearchRunning = true;
    this.isMapExtendedSearch = false;

    if (mapService && mapService.isMounted) {
      setTimeout(() => {
        // trigger update async
        mapService.update();
      }, 0);
      // wait for update to trigger bounds_changed to get current bounds
      const bounds = await mapService.getBounds();
      if (bounds) {
        locationStore.location.bounds = bounds;
      }
    }

    const filter: CompanyFilter = {
      ...filterStore.filter,
      ...locationStore.location,
    };

    try {
      searchStore.setLoading(true);

      await this.searchFull(filter);

      searchStore.setLoading(false);
      // CORONA
      //if (marketResponse) {
      //  searchStore.setCurrentMarketResults(marketResponse);
      //}
    } catch (error) {
      if (error.statusCode === 404) {
        searchStore.setLoading(false);
        globalMessageService.pushMessage({
                                           message: locale.error.nothingFound,
                                           variant: 'warning',
                                         });
        return;
      }

      globalMessageService.pushMessage({
                                         message: locale.error.defaultErrorMessage,
                                         variant: 'error',
                                       });
      logService.error('Search failed', error);
      if (!IS_SERVER) {
        void Router.push(CUSTOMER_COMMON_ROUTES.error);
        filterStore.stopInterval();
      }
    }

    this.isSearchRunning = false;
  }

  public searchMarketsAsync(): void {
    customerMarketFacade.getForfilter().then((marketResponse) => {
      if (marketResponse) {
        searchStore.setCurrentMarketResults(marketResponse);
      }
    }).catch((err) => {
      logService.error('Error while getting markets ' + err);
    });
  }

  public async searchByText(searchText: string, init: boolean = false): Promise<void> {
    try {
      await locationStore.setLocation({ address: searchText });
      return this.search(init);
    } catch (error) {

    }
  }

  public async searchByLocation(): Promise<void> {
    try {
      await locationStore.setToUserLocation();
      return this.search();
    } catch (error) {

    }

  }

}

export const searchService = new SearchService();
