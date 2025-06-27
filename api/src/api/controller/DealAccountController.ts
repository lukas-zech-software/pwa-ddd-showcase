import { IApiDealAccount, ICompanyUrlContext }          from '@my-old-startup/common/interfaces';
import { inject, injectable }                           from 'inversify';
import { COMPANY_ROUTES }                               from '../../../../common/routes/ApiRoutes';
import { DealAccountAdapter }                           from '../../adapter/DealAccountAdapter';
import { keys }                                         from '../../container/inversify.keys';
import { Company }                                      from '../../ddd/entities/Company';
import { IRepository }                                  from '../../ddd/repository/IRepository';
import { IDealAccountService }                          from '../../ddd/services/IDealAccountService';
import { AccessLevel }                                  from '../../enum/AccessLevel';
import { throwIfCurrentUserDoesNotBelongToCompany }     from '../../utils/EntityUtils';
import { IAuthInfo }                                    from '../interfaces/ISessionData';
import { ControllerResult, Get, IWebRouteHandlerInput } from '../routing/webRouteDecorator';

export type IDealAccountContract = {
  get(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDealAccount>;
};

@injectable()
export class DealAccountController implements IDealAccountContract {
  @inject(keys.ICompanyRepository)
  private companyRepository: IRepository<Company>;

  @inject(keys.IDealAccountService)
  private dealAccountService: IDealAccountService;

  @Get(COMPANY_ROUTES.dealAccount, AccessLevel.COMPANY)
  public async get(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDealAccount> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const account = await this.dealAccountService.getAccountForCompany(
      input.url.companyId,
    );

    return {
      body: DealAccountAdapter.entityToApi(account),
    };
  }
}
