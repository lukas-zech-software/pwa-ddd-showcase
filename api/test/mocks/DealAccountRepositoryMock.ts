import { injectable }             from 'inversify';
import { DealAccount }            from '../../src/ddd/entities/DealAccount';
import { IDealAccountRepository } from '../../src/ddd/repository/IDealAccountRepository';
import { AutoSpy }                from '../utils/autoSpy';
import { BaseRepositoryMock }     from './BaseRepositoryMock';

@AutoSpy()
@injectable()
export class DealAccountRepositoryMock extends BaseRepositoryMock<DealAccount> implements IDealAccountRepository {
  public mockData: DealAccount[] = [
    ({
      id:             'id',
      companyId:      'companyId',
      dealsRemaining: 10,
      created:        0,
      updated:        0,
    } as DealAccount),
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findByCompany(companyId: string): Promise<DealAccount> {
    return this.mockData[0];
  }

  public async getAll(): Promise<DealAccount[]> {
    return this.mockData;
  }
}
