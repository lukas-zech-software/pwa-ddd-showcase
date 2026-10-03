import { injectable }          from 'inversify';
import { ErrorCode }           from '../../../../common/error/ErrorCode';
import { ApiError }            from '../../common/ApiError';
import { keys }                from '../../container/inversify.keys';
import { IDealAccountFacade }  from '../../datastore/IDealAccountFacade';
import { IDealAccount }        from '../interfaces';
import { injectNotEnumerable } from '../utils/objectUtils';
// eslint-disable-next-line @typescript-eslint/tslint/config
import moment = require('moment');

@injectable()
export class DealAccount implements IDealAccount {
  public id: string;
  public created: number;
  public updated: number;
  /**
   * The ID of the company this deal account can be used with
   */
  public companyId: string;
  /**
   * The number of deals remaining for this month
   */
  public dealsRemaining: number;
  @injectNotEnumerable(keys.IDealAccountFacade) private dealAccountFacade: IDealAccountFacade;

  public constructor() {
    this.dealsRemaining = this.getDefaultNumberOfDeals();
  }

  public async create(companyId: string): Promise<void> {
    this.companyId = companyId;
    const created  = await this.dealAccountFacade.create(this);

    this.setData(created);
  }

  public async withdraw(): Promise<void> {
    this.throwIfNoneRemaining();

    this.dealsRemaining -= 1;

    const updatedAccount = await this.dealAccountFacade.update(this);

    this.setData(updatedAccount);
  }

  public async reset(to?: number): Promise<void> {
    if (to !== undefined && to === this.dealsRemaining) {
      return;
    } else if (to === undefined && this.dealsRemaining === this.getDefaultNumberOfDeals()) {
      return;
    }

    if (to === undefined || to < 0) {
      this.dealsRemaining = this.getDefaultNumberOfDeals();
    } else {
      this.dealsRemaining = to;
    }

    const updatedAccount = await this.dealAccountFacade.update(this);

    this.setData(updatedAccount);
  }

  public setData(account: IDealAccount): DealAccount {
    Object.assign(this, account);

    return this;
  }

  /// The default number of deals is the number of days left in the month
  private getDefaultNumberOfDeals(): number {
    return moment().daysInMonth() - moment().date() + 1;
  }

  private throwIfNoneRemaining(): void | never {
    if (this.dealsRemaining <= 0) {
      throw new ApiError('No deals available', ErrorCode.WEB_SERVER_INVALID_USER_INPUT);
    }
  }
}
