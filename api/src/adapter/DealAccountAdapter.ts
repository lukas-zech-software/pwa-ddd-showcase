import { IApiDealAccount } from '@my-old-startup/common/interfaces';
import { IDealAccount }    from '../ddd/interfaces';

export class DealAccountAdapter {
  public static entityToApi(account: IDealAccount): IApiDealAccount {
    return {
      id:             account.id,
      companyId:      account.companyId,
      dealsRemaining: account.dealsRemaining,
    };
  }
}
