import { injectable }         from 'inversify';
import { IDealAccountFacade } from '../../src/datastore/IDealAccountFacade';
import { IDealAccount }       from '../../src/ddd/interfaces';
import { AutoSpy }            from '../utils/autoSpy';
import { BaseFacadeMock }     from './BaseFacadeMock';

@AutoSpy()
@injectable()
export class DealAccountFacadeMock extends BaseFacadeMock<IDealAccount> implements IDealAccountFacade {
  public mockData: IDealAccount[] = [{
    id:             'id',
    companyId:      'companyId',
    created:        0,
    updated:        0,
    dealsRemaining: 16,
  }];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getByCompanyId(companyId: string): Promise<IDealAccount> {
    return this.mockData[0];
  }
}
