import { ApiSetDealAccountRequest, IApiDealAccount, ICompanyUrlContext } from '@my-old-startup/common/interfaces';
import { IHubDealAccountContract }
  from '@my-old-startup/common/interfaces/contracts';
import { HUB_DEAL_ACCOUNT_ROUTES }                            from '@my-old-startup/common/routes/ApiRoutes';
import { inject, injectable }                                 from 'inversify';
import { DealAccountAdapter }                                 from '../../../adapter/DealAccountAdapter';
import { keys }                                               from '../../../container/inversify.keys';
import { DealAccountRepository }                              from '../../../ddd/repository/DealAccountRepository';
import { IDealAccountService }                                from '../../../ddd/services/IDealAccountService';
import { AccessLevel }                                        from '../../../enum/AccessLevel';
import { ControllerResult, Get, IWebRouteHandlerInput, Post } from '../../routing/webRouteDecorator';

@injectable()
export class HubDealAccountController implements IHubDealAccountContract {
  @inject(keys.IDealAccountRepository)
  private dealAccountRepository: DealAccountRepository;

  @inject(keys.IDealAccountService)
  private dealAccountService: IDealAccountService;

  @Get(HUB_DEAL_ACCOUNT_ROUTES.getAll, AccessLevel.BACKOFFICE)
  public async getAll(): ControllerResult<IApiDealAccount[]> {
    const accounts = await this.dealAccountRepository.getAll();

    return {
      body: accounts.map((account) => DealAccountAdapter.entityToApi(account)),
    };
  }

  @Post(HUB_DEAL_ACCOUNT_ROUTES.setDealAccount, AccessLevel.BACKOFFICE)
  // eslint-disable-next-line @typescript-eslint/tslint/config
  public async setDealAccount(input: IWebRouteHandlerInput<ApiSetDealAccountRequest, ICompanyUrlContext>): ControllerResult<void> {
    await this.dealAccountService.setDealsRemaining(input.url.companyId, input.body.dealsRemaining);
  }
}
