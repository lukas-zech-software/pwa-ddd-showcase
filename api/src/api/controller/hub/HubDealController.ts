import { IApiAggregateDeal }      from '@my-old-startup/common/interfaces';
import { HUB_DEAL_ROUTES }        from '@my-old-startup/common/routes/ApiRoutes';
import { inject, injectable }     from 'inversify';
import { DealAdapter }            from '../../../adapter/DealAdapter';
import { keys }                   from '../../../container/inversify.keys';
import { DealRepository }         from '../../../ddd/repository/DealRepository';
import { AccessLevel }            from '../../../enum/AccessLevel';
import { ControllerResult, Post } from '../../routing/webRouteDecorator';

@injectable()
export class HubDealController {
  @inject(keys.IDealRepository)
  private dealRepository: DealRepository;

  @Post(HUB_DEAL_ROUTES.getAllForCurrentMonth, AccessLevel.BACKOFFICE)
  public async getAllForCurrentMonth(): ControllerResult<IApiAggregateDeal[]> {
    const deals = await this.dealRepository.getAllOfMonth(Date.now());

    return {
      body: deals.map((deal) => DealAdapter.entityToApiAggregate(deal)),
    };
  }
}
