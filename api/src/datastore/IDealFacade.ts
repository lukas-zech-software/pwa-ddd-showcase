import { DealTags }    from '@my-old-startup/common/enums';
import { IDeal }       from '../ddd/interfaces';
import { IBaseFacade } from './IBaseFacade';

/**
 * Facade to access deal data via API
 */
export type IDealFacade = {
  /**
   * Get a specific deal for a specific company
   *
   * @param {number} companyId Id of the company
   * @param {number} dealId Id of the deal
   * @returns {Promise<IDeal>} Resolves with a specific deal for a specific company
   */
  get(dealId: string, companyId: string): Promise<IDeal>;

  getAll(companyId: string): Promise<IDeal[]>;

  /**
   * Get all static deals of the company
   * @param companyId
   */
  getStatic(companyId: string): Promise<IDeal[]>;

  create(entity: IDeal, companyId: string): Promise<IDeal>;

  update(entity: IDeal, companyId: string): Promise<IDeal>;

  remove(dealId: string, companyId: string): Promise<void>;

  /**
   * Get the deals for a specific company
   *
   * @param {number} companyId Id of the company
   * @returns {Promise<IDeal>} Resolves with all deals for a specific company
   */
  getForCompany(companyId: string): Promise<IDeal[]>;

  /**
   * Get the deals for the provided timestamp range
   *
   * @param {number} companyId Id of the company
   * @param {number} validFrom Timestamp for validFrom
   * @param {number} validTo Timestamp for validTo
   * @returns {Promise<IDeal>} Resolves with all deals for the provide range
   */
  getByDateRange(companyId: string, validFrom: number, validTo: number, tags?: DealTags[]): Promise<IDeal[]>;
} & IBaseFacade<IDeal>;
