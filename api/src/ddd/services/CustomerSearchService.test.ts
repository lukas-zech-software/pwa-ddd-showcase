import {
  CompanyType,
  DateFilter,
}                            from '@my-old-startup/common/enums';
import { CompanyFilter }     from '@my-old-startup/common/interfaces';
import { CompanyFacadeMock } from '../../../test/mocks/CompanyFacadeMock';
import { DealFacadeMock }    from '../../../test/mocks/DealFacadeMock';
import { container }         from '../../container/inversify.config';
import { keys }              from '../../container/inversify.keys';
import {
  CustomerSearchResult,
  CustomerSearchService,
  dateFilterToTimestamp,
}                            from './CustomerSearchService';

describe('CustomerSearchService', () => {
  let customerSearchService: CustomerSearchService,
      companyFacadeMock: CompanyFacadeMock,
      dealFacadeMock: DealFacadeMock,
      dateNowMock: any;

  beforeEach(() => {
    customerSearchService = container.get(keys.ICustomerSearchService);
    companyFacadeMock     = container.get(keys.ICompanyFacade);
    dealFacadeMock        = container.get(keys.IDealFacade);
  });

  beforeAll(() => {
    // Always use the same date in tests
    dateNowMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1547596800000);
    // days in month - "now" + 1
  });

  afterAll(() => {
    dateNowMock.mockRestore();
  });

  // This tests the mock ...
  describe('getDealsForFilter', () => {
    test('calls geoSearchByCoordinates and not by geoSearchByAddress if coordinates are set', async () => {
      const filter: CompanyFilter     = {
        date:        DateFilter.TODAY,
        coordinates: {
          lat: 1,
          lng: 2,
        },
      };
      const geoSearchByCoordinatesSpy = spyOn(companyFacadeMock, 'geoSearchByCoordinates').and.callThrough();
      const geoSearchByAddressSpy     = spyOn(companyFacadeMock, 'geoSearchByAddress').and.callThrough();

      await customerSearchService.getDealsForFilter(filter);

      expect(geoSearchByCoordinatesSpy).toHaveBeenCalledWith(filter);
      expect(geoSearchByAddressSpy).not.toHaveBeenCalled();

    });

    test('calls geoSearchByAddress if coordinates are NOT set', async () => {
      const filter: CompanyFilter     = {
        date:       DateFilter.TODAY,
        address: 'test',
      };
      const geoSearchByCoordinatesSpy = spyOn(companyFacadeMock, 'geoSearchByCoordinates').and.callThrough();
      const geoSearchByAddressSpy     = spyOn(companyFacadeMock, 'geoSearchByAddress').and.callThrough();

      await customerSearchService.getDealsForFilter(filter);

      expect(geoSearchByCoordinatesSpy).not.toHaveBeenCalled();
      expect(geoSearchByAddressSpy).toHaveBeenCalledWith(filter);

    });

    test('get deals by date range for each returned company and FoodTrucks only once', async () => {
      const filter: CompanyFilter          = {
        date:       DateFilter.TODAY,
        address: 'test',
      };
      const date                           = dateFilterToTimestamp(filter.date);
      const mockData                       = companyFacadeMock.geoSerachResultMockData;
      const expected: CustomerSearchResult = {
        results:  [
          {
            company:  mockData.companies[0],
            distance: 0,
            deals:    dealFacadeMock.mockData,
          },
          {
            company:  mockData.companies[1],
            distance: 0,
            deals:    [],
          },
          {
            company:  mockData.companies[2],
            distance: 0,
            deals:    dealFacadeMock.mockData,
          },
        ],
        location: mockData.location,
      };

      const getByDateRange = spyOn(dealFacadeMock, 'getByDateRange').and.callThrough();

      const result = await customerSearchService.getDealsForFilter(filter);

      // should not call for FoodTrucks
      expect(getByDateRange).not.toHaveBeenCalledWith(mockData.companies[1].id, date.validFrom, date.validTo);

      expect(getByDateRange).toHaveBeenCalledWith(mockData.companies[0].id, date.validFrom, date.validTo);
      expect(getByDateRange).toHaveBeenCalledWith(mockData.companies[2].id, date.validFrom, date.validTo);

      expect(result.results[0]).toEqual(expected.results[0]);
      expect(result.results[1]).toEqual(expected.results[2]);
      expect(result.results[2]).toEqual(expected.results[1]);
      expect(result.location).toEqual(expected.location);
    });

    test('get deals by date range for each filtered company', async () => {
      const filter: CompanyFilter          = {
        date:         DateFilter.TODAY,
        companyTypes: [CompanyType.BAR],
        address:   'test',
      };
      const date                           = dateFilterToTimestamp(filter.date);
      const mockData                       = companyFacadeMock.geoSerachResultMockData;
      const expected: CustomerSearchResult = {
        results:  [
          {
            company:  mockData.companies[2],
            distance: 0,
            deals:    dealFacadeMock.mockData,
          },
        ],
        location: mockData.location,
      };

      const getByDateRange = spyOn(dealFacadeMock, 'getByDateRange').and.callThrough();

      const result = await customerSearchService.getDealsForFilter(filter);

      expect(getByDateRange).not.toHaveBeenCalledWith(mockData.companies[0].id, date.validFrom, date.validTo);
      expect(getByDateRange).not.toHaveBeenCalledWith(mockData.companies[1].id, date.validFrom, date.validTo);
      expect(getByDateRange).toHaveBeenCalledWith(mockData.companies[2].id, date.validFrom, date.validTo);

      expect(result).toEqual(expected);
    });

    test('calls geoSearchFoodTruckDeals if filtered for type FOODTRUCK', async () => {
      const filter: CompanyFilter = {
        date:         DateFilter.TODAY,
        companyTypes: [CompanyType.FOODTRUCK],
        address:   'test',
      };
      const date                  = dateFilterToTimestamp(filter.date);

      const geoSearchFoodTruckDeals = spyOn(companyFacadeMock, 'geoSearchFoodTruckDeals').and.callThrough();

      await customerSearchService.getDealsForFilter(filter);

      expect(geoSearchFoodTruckDeals).toHaveBeenCalledWith(filter, date.validFrom, date.validTo);

    });
  });
});
