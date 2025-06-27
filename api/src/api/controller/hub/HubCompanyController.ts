import { ICompanyUrlContext, IHubApiCompany }                 from '@my-old-startup/common/interfaces';
import { CACHE_BASE, COMPANY_ROUTES }                         from '@my-old-startup/common/routes/ApiRoutes';
import { inject, injectable }                                 from 'inversify';
import { TestDb }                                             from '../../../../test/data/db/TestDb';
import { CompanyAdapter }    from '../../../adapter/CompanyAdapter';
import { ICacheService }     from '../../../cache/ICacheService';
import { keys }              from '../../../container/inversify.keys';
import { ICompanyFacade }    from '../../../datastore/ICompanyFacade';
import { CompanyFactory }    from '../../../ddd/factories/CompanyFactory';
import { CompanyRepository } from '../../../ddd/repository/CompanyRepository';
import { AccessLevel }       from '../../../enum/AccessLevel';
import { IAuthInfo }         from '../../interfaces/ISessionData';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
}                            from '../../routing/webRouteDecorator';

@injectable()
export class HubCompanyController {
  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @inject(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;

  @inject(keys.ICompanyFactory)
  private companyFactory: CompanyFactory;

  @inject(keys.ICacheService)
  private cacheService: ICacheService<void>;

  //@inject(TestDb)
  //private testDb: TestDb;

  @Get(COMPANY_ROUTES.all, AccessLevel.BACKOFFICE)
  public async getAll(
    input: never,
    authInfo: IAuthInfo,
  ): ControllerResult<IHubApiCompany[]> {
    const companies = await this.companyFacade.getAll();

    return {
      body: companies.map((company) =>
                            CompanyAdapter.entityToHubApi(company, authInfo.authUser.authId),
      ),
    };
  }

  @Post(COMPANY_ROUTES.approve, AccessLevel.BACKOFFICE, {})
  public async approve(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    return company.approve();
  }

  @Post(COMPANY_ROUTES.actAsOwner, AccessLevel.BACKOFFICE, {})
  public async actAsOwner(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    company.addOwner(authInfo.authUser.authId);
    return company.update();
  }

  @Post(COMPANY_ROUTES.stopActingAsOwner, AccessLevel.BACKOFFICE, {})
  public async stopActingAsOwner(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    await company.removeOwner(authInfo.authUser.authId);
    return company.update();
  }

  @Post(COMPANY_ROUTES.delete, AccessLevel.BACKOFFICE, {})
  public async delete(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    return company.delete();
  }

  @Post(COMPANY_ROUTES.clone, AccessLevel.BACKOFFICE, {})
  public async clone(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IHubApiCompany> {
    const company       = await this.companyRepository.findById(input.url.companyId);
    const clonedCompany = await this.companyFactory.create();

    clonedCompany.setData(company);

    clonedCompany.addOwner(authInfo.authUser.authId);

    await clonedCompany.create();

    return {
      body: CompanyAdapter.entityToHubApi(clonedCompany, authInfo.authUser.authId),
    };
  }

/*
  @Post(COMPANY_ROUTES.testData, AccessLevel.BACKOFFICE, {})
  public async testData(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
  ): ControllerResult<void> {
    const company  = await this.companyRepository.findById(input.url.companyId);
    const allDeals = await company.getDeals();

    for (const deal of allDeals) {
      await company.removeDeal(deal);
    }

    const todayMorning = new Date();
    todayMorning.setHours(8);
    todayMorning.setMinutes(0);
    todayMorning.setSeconds(0, 0);
    let date = todayMorning.getTime() - TimeInMs.ONE_DAY;
    for (let i = 0; i < 10; i++) {
      await this.testDb.addTestDeals(company, date);
      date = date + TimeInMs.ONE_DAY;
    }
  }*/

  @Post(CACHE_BASE, AccessLevel.BACKOFFICE, {})
  public async resetCache(): ControllerResult<void> {
    await this.cacheService.clearAll();
  }
}
