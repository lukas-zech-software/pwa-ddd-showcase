import { inject, injectable }    from 'inversify';
import { keys }                  from '../../container/inversify.keys';
import { DealAccount }           from '../entities/DealAccount';
import { DealAccountFactory }    from '../factories/DealAccountFactory';
import { IDealAccount }          from '../interfaces';
import { DealAccountRepository } from '../repository/DealAccountRepository';
import { IDealAccountService }   from './IDealAccountService';

@injectable()
export class DealAccountService implements IDealAccountService {

  @inject(keys.IDealAccountRepository)
  private repository: DealAccountRepository;

  @inject(keys.IDealAccountFactory)
  private factory: DealAccountFactory;

  public async getAccountForCompany(companyId: string): Promise<IDealAccount> {
    return await this.repository.findByCompany(companyId);
  }

  public async useDeal(dealId: string, companyId: string): Promise<void> {
    const dealAccount = await this.repository.findByCompany(companyId);
    await dealAccount.withdraw();
  }

  /**
   * Either sets an existing deal account, or falls back to creating a new deal account
   * @param companyId the company the deal account belongs to
   * @param count an optional count of how many deals to set, defaults to days remaining in the month (inclusive)
   */
  public async setDealsRemaining(companyId: string, count?: number): Promise<void> {
    let dealAccount: DealAccount;

    try {
      dealAccount = await this.repository.findByCompany(companyId);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Deal account for company ${companyId} not found, creating a default account...`);
      dealAccount = await this.factory.create();
      await dealAccount.create(companyId);
      dealAccount = await this.repository.findByCompany(companyId);
    }

    return dealAccount.reset(count);
  }
}
