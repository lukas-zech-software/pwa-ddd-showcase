/**
 * Facade to access company data via API
 */
import { CompanyFilter }    from '@my-old-startup/common/interfaces';
import { IGeoSearchResult } from '../api/interfaces/geo';
import {
  ICompany,
  ISearchResult,
}                           from '../ddd/interfaces';
import { IBaseFacade }      from './IBaseFacade';

export interface ICompanyFacade extends IBaseFacade<ICompany> {
  /**
   * Get all companies the provided user owns
   * @param ownerAuthId
   */
  getAllForUser(ownerAuthId: string): Promise<ICompany[]>;

  /**
   * Get company by mail
   * Necessary to check doublets on application
   */
  getByMail(email: string): Promise<ICompany>;

  /**
   * Geo location search for company around given address
   */
  geoSearchByAddress(filter: CompanyFilter): Promise<IGeoSearchResult<ICompany>>;

  /**
   * Geo location search for company around given coordinates
   */
  geoSearchByCoordinates(filter: CompanyFilter): Promise<IGeoSearchResult<ICompany>>;

  /**
   * Geo location search for company in given bounds
   */
  geoSearchByAreaBounds(filter: CompanyFilter): Promise<IGeoSearchResult<ICompany>>;

  /**
   * Find food truck deals for the provided coordinates
   * @param filter
   * @param validFrom
   * @param validTo
   */
  geoSearchFoodTruckDeals(
    filter: CompanyFilter,
    validFrom: number,
    validTo: number,
  ): Promise<ISearchResult[]>;

  /**
   * Try to find doublets by zipCode and Name
   * @param company
   */
  tryFindDoublets(company: ICompany): Promise<ICompany | undefined>;
}
