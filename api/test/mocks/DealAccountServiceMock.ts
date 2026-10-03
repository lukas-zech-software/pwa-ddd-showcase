/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable }          from 'inversify';
import { IDealAccount }        from '../../src/ddd/interfaces';
import { IDealAccountService } from '../../src/ddd/services/IDealAccountService';
import { AutoSpy }             from '../utils/autoSpy';

@AutoSpy()
@injectable()
export class DealAccountServiceMock implements IDealAccountService {
  private mockData: IDealAccount = {
    id:             'id',
    companyId:      'companyId',
    created:        0,
    updated:        0,
    dealsRemaining: 10,
  };

  public async getAccountForCompany(companyId: string): Promise<IDealAccount> {
    return this.mockData;
  }

  public async useDeal(dealId: string, companyId: string): Promise<void> {
    return;
  }

  public async setDealsRemaining(companyId: string, count?: number): Promise<void> {
    return;
  }
}
