import { IMarket }     from '../ddd/interfaces/IMarket';
import { IBaseFacade } from './IBaseFacade';

/**
 * Facade to access market data via API
 */
export type IMarketFacade = {
  /**
   * Get the markets for the next
   *
   * @returns {Promise<IMarket>} Resolves with all markets for the provide range
   */
  getByDateRange(): Promise<IMarket[]>;
} & IBaseFacade<IMarket>;
