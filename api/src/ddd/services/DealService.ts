import { IApiDeal }            from '@my-old-startup/common/interfaces';
import { BulkDealError }       from '@my-old-startup/common/interfaces/BulkDealError';
import { inject, injectable }  from 'inversify';
import { DealAdapter }         from '../../adapter/DealAdapter';
import { keys }                from '../../container/inversify.keys';
import { DealAccountFactory }  from '../factories/DealAccountFactory';
import { ICompanyInstance }    from '../interfaces';
import { IDealAccountService } from './IDealAccountService';
import { IDealService }        from './IDealService';

@injectable()
export class DealService implements IDealService {
  @inject(keys.IDealAccountService)
  private dealAccountService: IDealAccountService;

  @inject(keys.IDealAccountFactory)
  private factory: DealAccountFactory;

  public async bulkPublish(
    company: ICompanyInstance,
    deals: IApiDeal[],
  ): Promise<BulkDealError[]> {
    const errors: BulkDealError[] = [];

    // The first deal was already created to assign the images,
    // it must only be updated and published
    const firstApiDeal = deals.splice(0, 1)[0],
          firstDeal    = await company.getDeal(firstApiDeal.id);

    firstDeal.setData(DealAdapter.apiToEntity(firstApiDeal));
    await firstDeal.publish();

    for (const deal of deals) {
      try {
        // assign new id for each deal
        delete deal.id;

        const created = await company.addDeal(DealAdapter.apiToEntity(deal));
        await created.publish();
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        errors.push({
          deal,
          error: error.message ? error.message : error,
        });
      }
    }

    return errors;
  }
}
