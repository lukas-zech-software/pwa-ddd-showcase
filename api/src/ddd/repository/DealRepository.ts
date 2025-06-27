import { Container, inject, injectable } from 'inversify';
import { ErrorCode }                     from '../../../../common/error/ErrorCode';
import { ApiError }                      from '../../common/ApiError';
import { keys }                          from '../../container/inversify.keys';
import { IDealFacade }                   from '../../datastore/IDealFacade';
import { Deal }                          from '../entities/Deal';
import { IDeal }                         from '../interfaces';
import { CompanyRepository }             from './CompanyRepository';
import { IDealRepository }               from './IDealRepository';

@injectable()
export class DealRepository implements IDealRepository {
  @inject(keys.Container)
  private container: Container;

  @inject(keys.IDealFacade)
  private dealFacade: IDealFacade;

  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  public async findById(dealId: string, companyId: string): Promise<Deal> {
    const deal = await this.dealFacade.get(dealId, companyId);

    if (deal === undefined) {
      throw new ApiError(`Deal ${dealId} not found`, ErrorCode.WEB_SERVER_NO_DATA_FOUND);
    }

    return this.createInstance(deal);
  }

  /**
   * Get the deals for a specific company
   *
   * @param {number} companyId Id of the company
   * @returns {Promise<Deal>} Resolves with all deals for a specific company
   */
  public async getForCompany(companyId: string): Promise<Deal[]> {
    const deals = await this.dealFacade.getForCompany(companyId);

    return deals.map((c) => this.createInstance(c));
  }

  /**
   * Get a unique id for a new deal
   *
   * @param {number} companyId Id of the company
   * @returns {Promise<Deal>} Resolves with all deals for a specific company
   */
  public getIdForNewDeal(companyId: string): string {
    return this.dealFacade.getId(companyId);
  }

  /**
   * Delete the provided deal
   */
  public async remove(dealId: string, companyId: string): Promise<void> {
    return this.dealFacade.remove(dealId, companyId);
  }

  /**
   * Get the deals for the provided time range
   *
   * @param {string} companyId The id of the company to get the deals for
   * @param {number} validFrom Timestamp for validFrom
   * @param {number} validTo Timestamp for validTo
   * @returns {Promise<Deal>} Resolves with all deals for the provide range
   */
  public async getByDateRange(companyId: string, validFrom: number, validTo: number): Promise<Deal[]> {
    const deals = await this.dealFacade.getByDateRange(companyId, validFrom, validTo);

    return deals.map((c) => this.createInstance(c));
  }

  public async getAllOfMonth(timestamp: number): Promise<Deal[]> {
    const date         = new Date(timestamp), y = date.getFullYear(), m = date.getMonth();
    const firstOfMonth = new Date(y, m, 1).getTime();
    const lastOfMonth  = new Date(y, m + 1, 0).getTime();

    const allCompanies = await this.companyRepository.getAll();

    const allDeals: Deal[] = [];

    for (const company of allCompanies) {
      const deals = await this.dealFacade.getByDateRange(company.id, firstOfMonth, lastOfMonth);

      allDeals.push(...deals.map((c) => this.createInstance(c)));
    }

    return allDeals;
  }

  private createInstance(deal: IDeal): Deal {
    return this.container.get<Deal>(Deal).setData(deal);
  }
}
