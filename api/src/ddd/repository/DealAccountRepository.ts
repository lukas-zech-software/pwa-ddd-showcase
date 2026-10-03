import { Container, inject, injectable } from 'inversify';
import { ErrorCode }                     from '../../../../common/error/ErrorCode';
import { ApiError }                      from '../../common/ApiError';
import { keys }                          from '../../container/inversify.keys';
import { ICompanyFacade }                from '../../datastore/ICompanyFacade';
import { IDealAccountFacade }            from '../../datastore/IDealAccountFacade';
import { DealAccount }                   from '../entities/DealAccount';
import { IDealAccount }                  from '../interfaces';
import { IRepository }                   from './IRepository';

@injectable()
export class DealAccountRepository implements IRepository<DealAccount> {
  @inject(keys.Container)
  private container: Container;

  @inject(keys.IDealAccountFacade)
  private dealAccountFacade: IDealAccountFacade;

  @inject(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;

  public async findById(id: string): Promise<DealAccount> {
    const account = await this.dealAccountFacade.get(id);

    if (account === undefined) {
      throw new ApiError(`DealAccount ${id} not found`, ErrorCode.WEB_SERVER_NO_DATA_FOUND);
    }

    return this.createInstance(account);
  }

  public async findByCompany(companyId: string): Promise<DealAccount> {
    const account = await this.dealAccountFacade.getByCompanyId(companyId);

    if (account === undefined) {
      throw new ApiError(`DealAccount for company ${companyId} not found`, ErrorCode.WEB_SERVER_NO_DATA_FOUND);
    }

    return this.createInstance(account);
  }

  public async getAll(): Promise<DealAccount[]> {
    const accounts = await this.dealAccountFacade.getAll();

    return accounts.map((a) => this.createInstance(a));
  }

  private createInstance(dealAccount: IDealAccount): DealAccount {
    return this.container.get<DealAccount>(DealAccount).setData(dealAccount);
  }
}
