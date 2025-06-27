import {
  ApiSearchResponse,
  ApiSearchResponseMinimal,
  ApiSearchResult,
  IApiAggregateDeal,
  IApiDeal,
}                               from '@my-old-startup/common/interfaces';
import { IGeoSearchResult }     from '../api/interfaces/geo';
import {
  ICompany,
  IDeal,
  ISearchResult,
}                               from '../ddd/interfaces';
import { CustomerSearchResult } from '../ddd/services/CustomerSearchService';
import { CompanyAdapter }       from './CompanyAdapter';

export class DealAdapter {
  public static entitySearchResultToApi(searchResult: ISearchResult): ApiSearchResult {
    return {
      distance: searchResult.distance,
      company:  CompanyAdapter.entityToApi(searchResult.company),
      deals:    searchResult.deals.map(DealAdapter.entityToApi),
    };
  }

  public static customerSearchResultToApi(searchResult: CustomerSearchResult): ApiSearchResponse {
    return {
      results:  searchResult.results.map(deal => DealAdapter.entitySearchResultToApi(deal)),
      location: searchResult.location,
    };
  }

  public static customerSearchResultToApiMinimal(result: IGeoSearchResult<ICompany & { distance?: number }>): ApiSearchResponseMinimal {
    return {
      location: result.location,
      results:  result.companies.map(x => CompanyAdapter.entityToTransportApi(x)),
    };
  }

  public static entityToApi(deal: IDeal): IApiDeal {
    const apiDeal: IApiDeal = {
      id:           deal.id,
      published:    deal.published,
      isStatic:     deal.isStatic,
      skipHolidays: deal.skipHolidays,
      staticDays:   deal.staticDays,
      type:         deal.type,
      specialType:  deal.specialType,
      image:        deal.image,

      value: {
        originalValue: deal.originalValue,
        discountValue: deal.discountValue,
      },

      description: {
        title:       deal.title,
        description: deal.description,
      },
      details:     {
        tags:                deal.tags,
        minimumPersonCount:  deal.minimumPersonCount,
        reservationRequired: deal.reservationRequired,
      },
      date:        {
        validFrom: deal.validFrom,
        validTo:   deal.validTo,
      },
    };

    if (deal.location) {
      apiDeal.location = {
        location: deal.location as any,
        address:  deal.address as any,
      };
    }

    return apiDeal;
  }

  public static entityToApiAggregate(deal: IDeal): IApiAggregateDeal {
    return {
      id:            deal.id,
      originalValue: deal.originalValue,
      discountValue: deal.discountValue,
      tags:          deal.tags,
      validFrom:     deal.validFrom,
      validTo:       deal.validTo,
    };
  }

  public static apiToEntity(apiDeal: IApiDeal): Partial<IDeal> {
    const deal: Partial<IDeal> = {
      id:                  apiDeal.id,
      isStatic:            apiDeal.isStatic,
      skipHolidays:        apiDeal.skipHolidays,
      staticDays:          apiDeal.staticDays,
      image:               apiDeal.image,
      type:                apiDeal.type,
      specialType:         apiDeal.specialType,
      originalValue:       apiDeal.value.originalValue,
      discountValue:       apiDeal.value.discountValue,
      title:               apiDeal.description.title,
      description:         apiDeal.description.description,
      validFrom:           apiDeal.date.validFrom,
      validTo:             apiDeal.date.validTo,
      tags:                apiDeal.details.tags,
      minimumPersonCount:  apiDeal.details.minimumPersonCount,
      reservationRequired: apiDeal.details.reservationRequired,
    };

    if (apiDeal.location) {
      deal.location = apiDeal.location.location;
      deal.address  = apiDeal.location.address;
    }

    return deal;
  }
}
