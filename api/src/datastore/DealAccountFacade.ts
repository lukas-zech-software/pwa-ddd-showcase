import {
  inject,
  injectable,
}                             from 'inversify';
import { ICacheService }      from '../cache/ICacheService';
import { keys }               from '../container/inversify.keys';
import { IDealAccount }       from '../ddd/interfaces';
import { BaseFacade }         from './BaseFacade';
import { IDealAccountFacade } from './IDealAccountFacade';
import CollectionReference = FirebaseFirestore.CollectionReference;

@injectable()
export class DealAccountFacade extends BaseFacade<IDealAccount>
  implements IDealAccountFacade {
  constructor(
    @inject(keys.IsProduction) isProduction: boolean,
    @inject(keys.GoogleCloudProjectId) googleCloudProjectId: string,
    @inject(keys.ICacheService) cacheService: ICacheService<IDealAccount>,
  ) {
    super(isProduction, googleCloudProjectId, cacheService);
  }

  public async getByCompanyId(companyId: string): Promise<IDealAccount> {
    const results = await this.runCachedQuery(
      [
        {
          key:      'companyId',
          operator: '==',
          value:    companyId,
        },
      ],
    );

    return results[0];
  }

  public getCachePrefix(): string {
    return 'deal_accounts_';
  }

  protected getCollection(): CollectionReference {
    return this.db.collection('dealAccounts');
  }
}
