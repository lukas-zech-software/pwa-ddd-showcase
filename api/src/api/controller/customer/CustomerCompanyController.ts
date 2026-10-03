import { IApiCompany, ICompanyUrlContext }              from '@my-old-startup/common/interfaces';
import { ICustomerCompanyContract }                     from '@my-old-startup/common/interfaces/contracts';
import { CUSTOMER_DEAL_ROUTES }                         from '@my-old-startup/common/routes/ApiRoutes';
import { inject, injectable }                           from 'inversify';
import { CompanyAdapter }                               from '../../../adapter/CompanyAdapter';
import { keys }                                         from '../../../container/inversify.keys';
import { CompanyFactory }                               from '../../../ddd/factories/CompanyFactory';
import { CompanyRepository }                            from '../../../ddd/repository/CompanyRepository';
import { AccessLevel }                                  from '../../../enum/AccessLevel';
import { ControllerResult, Get, IWebRouteHandlerInput } from '../../routing/webRouteDecorator';

@injectable()
export class CustomerCompanyController implements ICustomerCompanyContract {
  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @inject(keys.ICompanyFactory)
  private companyFactory: CompanyFactory;

  @Get(CUSTOMER_DEAL_ROUTES.getCompany, AccessLevel.PUBLIC)
  public async getForId(input: IWebRouteHandlerInput<void, ICompanyUrlContext>): ControllerResult<IApiCompany> {
    const company = await this.companyRepository.findById(input.url.companyId);
    return {
      body: CompanyAdapter.entityToApi(company),
    };
  }
}
