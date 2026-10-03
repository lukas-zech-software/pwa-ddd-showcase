import { DateFilter }        from '@my-old-startup/common/enums';
import { ErrorCode }         from '@my-old-startup/common/error/ErrorCode';
import {
  ApiSearchDealRequest,
  CompanyFilter,
  ILocation,
  Timestamp,
}                            from '@my-old-startup/common/interfaces';
import { getPercent }        from '@my-old-startup/common/utils/deals';
import { calculateDistance } from '@my-old-startup/common/utils/geoUtils';
import {
  inject,
  injectable,
}                            from 'inversify';
import * as moment           from 'moment';
import { IGeoSearchResult }  from '../../api/interfaces/geo';
import { ApiError }          from '../../common/ApiError';
import { keys }              from '../../container/inversify.keys';
import { ICompanyFacade }    from '../../datastore/ICompanyFacade';
import { IDealFacade }       from '../../datastore/IDealFacade';
import {
  ICompany,
  IDeal,
  ISearchResult,
}                            from '../interfaces';

export type DateRange = {
  validFrom: Timestamp;
  validTo: Timestamp;
};

export type CustomerSearchResult = {
  results: ISearchResult[];
  location: ILocation;
};

export type SearchCompanyResponse = {
  company: ICompany;
};

export type SearchDealResponse = SearchCompanyResponse & {
  deal: IDeal;
};

export function dateFilterToTimestamp(dateFilter: DateFilter): DateRange {
  switch (dateFilter) {
    case DateFilter.TODAY:
      return {
        validFrom: +moment().startOf('day'),
        validTo:   +moment().endOf('day'),
      };
    case DateFilter.TOMORROW:
      return {
        validFrom: +moment()
          .add(1, 'days')
          .startOf('day'),
        validTo:   +moment()
          .add(1, 'days')
          .endOf('day'),
      };
    case DateFilter.REST_OF_WEEK:
      return {
        validFrom: +moment()
          .add(2, 'days')
          .startOf('day'),
        validTo:   +moment()
          .add(7, 'days')
          .endOf('day'),
      };
    case DateFilter.WHOLE_WEEK:
      return {
        validFrom: +moment().startOf('day'),
        validTo:   +moment()
          .add(7, 'days')
          .endOf('day'),
      };
    default:
      throw new Error('Invalid DateFilter: ' + dateFilter);
  }
}

// TODO: Refactor Deal Querying ...
@injectable()
export class CustomerSearchService {
  @inject(keys.IDealFacade)
  private dealFacade: IDealFacade;

  @inject(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;

  public async getDealsForId(
    request: ApiSearchDealRequest,
  ): Promise<SearchDealResponse> {
    const deal    = await this.dealFacade.get(request.dealId, request.companyId);
    const company = await this.companyFacade.get(request.companyId);

    return {
      deal,
      company,
    };
  }

  public async getTopDeals(): Promise<SearchDealResponse[]> {
    const results = await this.getDealsForFilter(
      {
        address: '',
        date:    DateFilter.WHOLE_WEEK,
      },
    );

    const companyMap = new Map<string, SearchDealResponse[]>();

    results.results.forEach(
      (current) => {
        if (current.deals.length === 0) {
          return;
        }
        if (companyMap.has(current.company.id) === false) {
          companyMap.set(current.company.id, []);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        companyMap.get(current.company.id)!.push(
          {
            // take the best deal of this  company
            deal:    current.deals.sort(
              (a, b) =>
                getPercent(b.discountValue, b.originalValue) -
                getPercent(a.discountValue, a.originalValue),
            )[0],
            company: current.company,
          },
        );
      },
    );

    const topDeals = Array.from(companyMap.values()).map(([deal1]) => deal1);

    // take the best 4 deals of all companies, sorted by date
    return topDeals
      .sort(
        (a, b) =>
          getPercent(b.deal.discountValue, b.deal.originalValue) -
          getPercent(a.deal.discountValue, a.deal.originalValue),
      )
      .sort((a, b) => a.deal.validFrom - b.deal.validFrom)
      .slice(0, 4);
  }

  public async getDealsForFilter(
    filter: CompanyFilter,
  ): Promise<CustomerSearchResult> {
    let geoSearchResult = await this.getGeoSearchResult(filter);

    const date = dateFilterToTimestamp(filter.date);
    this.setDateRangeBoundaries(date);

    const results = await this.getDealsForGeoSearchResult(
      geoSearchResult,
      date.validFrom,
      date.validTo,
    );

    return results;
  }

  public async getGeoSearchResult(filter: CompanyFilter): Promise<IGeoSearchResult<ICompany & { distance?: number }>> {
    if (filter === undefined) {
      throw new ApiError('No filter supplied', ErrorCode.WEB_SERVER_INVALID_USER_INPUT);
    }
    let geoSearchResult: IGeoSearchResult<ICompany & { distance?: number }>;
    if (filter.bounds !== undefined) {
      geoSearchResult = await this.companyFacade.geoSearchByAreaBounds(filter);
    } else if (filter.coordinates !== undefined) {
      geoSearchResult = await this.companyFacade.geoSearchByCoordinates(filter);
    } else {
      geoSearchResult = await this.companyFacade.geoSearchByAddress(filter);
      filter          = Object.assign(filter, geoSearchResult.location);
    }
    geoSearchResult.companies = geoSearchResult.companies.filter(
      (company) => !!company.offersReopen || !!company.offersDelivery || !!company.offersTakeAway || !!company.offersCoupons || !!company.acceptsDonations,
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    // never return the company of a food truck
    // geoSearchResult.companies = geoSearchResult.companies.filter(x => x.type !== CompanyType.FOODTRUCK);

    // Compound Query: Firestore cannot do multiple OR queries
    // filter found companies by type if type filter was provided
    // TODO: Combine all queries in a single service?
    if (filter.companyTypes !== undefined && filter.companyTypes.length !== 0) {
      geoSearchResult.companies = geoSearchResult.companies.filter(
        (company) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          filter.companyTypes!.includes(company.type),
      );
    }

    if (filter.dealTags !== undefined && filter.dealTags.length !== 0) {
      geoSearchResult.companies = geoSearchResult.companies.filter(
        (company) => {
          const tags = company.tags || [];
          return filter.dealTags!.some(x => tags.some(y => x === y));
        },
      );
    }

    if (filter.coordinates) {
      console.time('distance');
      geoSearchResult.companies.forEach((company) => {
        company.distance = calculateDistance(company, filter.coordinates!);
        company.distance = Math.round(company.distance * 100) / 100;
      });
      geoSearchResult.companies.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      console.timeEnd('distance');
    }

    return geoSearchResult;
  }

  public async getDealsForCompanyAndDate(
    companyId: string,
    date: DateRange,
  ): Promise<CustomerSearchResult> {
    const company = await this.companyFacade.get(companyId);

    this.setDateRangeBoundaries(date);
// CORONA
    // const deals = await this.dealFacade.getByDateRange(
    //   companyId,
    //   date.validFrom,
    //   date.validTo,
    // );

    return {
      // FIXME: Get correct location here?
      location: null as any,
      results:  [
        {
          distance: 0,
          company,
          deals:    [],
        },
      ],
    };
  }

  /**
   * Limit the date range to the allow min and max values
   * @param date
   */
  private setDateRangeBoundaries(date: DateRange): void {
    // Cannot query earlier than today
    const minDate = +moment().startOf('day');
    if (date.validFrom < minDate) {
      date.validFrom = minDate;
    }

    // Cannot query later than end next week
    const maxDate = +moment()
      .startOf('week')
      .add(2, 'week');
    if (date.validTo > maxDate) {
      date.validTo = maxDate;
    }
  }

  private async getDealsForGeoSearchResult(
    geoSearchResult: IGeoSearchResult<ICompany> | undefined,
    validFrom: number,
    validTo: number,
  ): Promise<CustomerSearchResult> {
    if (geoSearchResult === undefined) {

      return {
        results:  [],
        location: {
          address:     '',
          city:        '',
          coordinates: {
            lat: 0,
            lng: 0,
          },
          zipCode:     '',
        },
      };
    }

    const promises: Promise<ISearchResult>[] = [];
    geoSearchResult.companies.forEach(
      (company) =>
        promises.push(
         // CORONA this.dealFacade
         // CORONA   .getByDateRange(company.id, validFrom, validTo)
          Promise.resolve()
            .then((): ISearchResult => {
              const distance        = calculateDistance(
                geoSearchResult.location.coordinates,
                company,
              );
              const distanceRounded =
                      distance === 0 ? 0 : Math.round(distance * 100) / 100;
              return {
                distance: distanceRounded,
                company,
                deals:[], // CORONA
              };
            }),
        ),
    );

    const results = await Promise.all(promises);
    results.sort((a, b) => a.distance - b.distance);

    return {
      results,
      location: geoSearchResult.location,
    };
  }
}
