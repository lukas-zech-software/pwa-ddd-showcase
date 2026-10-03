import {
  IApiDeal,
  IApiDealId,
  IBulkApiDeal,
  ICompanyUrlContext,
  IDealUrlContext,
}                                                   from '@my-old-startup/common/interfaces';
import { BulkDealError }                            from '@my-old-startup/common/interfaces/BulkDealError';
import { DEAL_ROUTES }                              from '@my-old-startup/common/routes/ApiRoutes';
import { DEFAULT_DEAL_IMAGE }                       from '@my-old-startup/common/routes/default_urls';
import {
  ApiDeal,
  BulkApiDeal,
}                                                   from '@my-old-startup/common/validation';
import {
  inject,
  injectable,
}                                                   from 'inversify';
import { DealAdapter }                              from '../../../adapter/DealAdapter';
import { keys }                                     from '../../../container/inversify.keys';
import { CompanyFacade }                            from '../../../datastore/CompanyFacade';
import { CompanyRepository }                        from '../../../ddd/repository/CompanyRepository';
import { IDealService }                             from '../../../ddd/services/IDealService';
import { AccessLevel }                              from '../../../enum/AccessLevel';
import { throwIfCurrentUserDoesNotBelongToCompany } from '../../../utils/EntityUtils';
import { IAuthInfo }                                from '../../interfaces/ISessionData';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
  Upload,
}                                                   from '../../routing/webRouteDecorator';

export type IDealContract = {
  publish(
    input: IWebRouteHandlerInput<void, IDealUrlContext>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ...params: any[],
  ): ControllerResult<IApiDeal>;
};

@injectable()
export class DashboardDealController implements IDealContract {
  @inject(keys.ICompanyFacade)
  private companyFacade: CompanyFacade;

  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @inject(keys.IDealService)
  private dealService: IDealService;

  @Get(DEAL_ROUTES.getAll, AccessLevel.COMPANY)
  public async getDeals(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal[]> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deals = await company.getDeals();

    return {
      body: deals.map((c) => DealAdapter.entityToApi(c)),
    };
  }

  @Get(DEAL_ROUTES.getId, AccessLevel.COMPANY)
  public async getNewDealId(
    input: IWebRouteHandlerInput<void, IDealUrlContext>): ControllerResult<IApiDealId> {
    const id = this.companyFacade.getId(input.url.companyId);

    return {
      body: { id },
    };
  }

  @Get(DEAL_ROUTES.get, AccessLevel.COMPANY)
  public async get(
    input: IWebRouteHandlerInput<void, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);

    return {
      body: DealAdapter.entityToApi(deal),
    };
  }

  @Post(DEAL_ROUTES.create, AccessLevel.COMPANY, { bodyModel: ApiDeal })
  public async create(
    input: IWebRouteHandlerInput<IApiDeal, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const created = await company.addDeal(DealAdapter.apiToEntity(input.body));

    return {
      body: DealAdapter.entityToApi(created),
    };
  }

  @Post(DEAL_ROUTES.bulkPublish, AccessLevel.COMPANY, {
    bodyModel: BulkApiDeal,
  })
  public async bulkPublish(
    input: IWebRouteHandlerInput<IBulkApiDeal, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<BulkDealError[]> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const errors = await this.dealService.bulkPublish(
      company,
      input.body.deals,
    );

    return {
      status: 200,
      body:   errors,
    };
  }

  @Post(DEAL_ROUTES.delete, AccessLevel.COMPANY)
  public async delete(
    input: IWebRouteHandlerInput<void, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);
    return deal.delete();
  }

  @Post(DEAL_ROUTES.publish, AccessLevel.COMPANY)
  public async publish(
    input: IWebRouteHandlerInput<void, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);
    await deal.publish();

    return {
      body: DealAdapter.entityToApi(deal),
    };
  }

  @Upload(
    DEAL_ROUTES.updateImage,
    AccessLevel.COMPANY,
    {},
    { uploadOptions: { uploadFormFields: ['image'] } },
  )
  public async updateImage(
    input: IWebRouteHandlerInput<IApiDeal, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<string> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);

    try {
      for (const file of input.files) {
        if (file.name === 'image') {
          await deal.updateImage(file.path, company.id);
        }
      }

      await deal.update();

      return {
        body: deal.image,
      };

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not update deal images: ', error);
      return {
        status: 500,
      };
    }
  }

  @Post(DEAL_ROUTES.restoreImage, AccessLevel.COMPANY)
  public async restoreBackground(
    input: IWebRouteHandlerInput<void, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);

    deal.image = DEFAULT_DEAL_IMAGE;

    await deal.update();

    return {
      body: DealAdapter.entityToApi(deal),
    };
  }

  @Post(DEAL_ROUTES.update, AccessLevel.COMPANY, { bodyModel: ApiDeal })
  public async update(
    input: IWebRouteHandlerInput<IApiDeal, IDealUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiDeal> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const deal = await company.getDeal(input.url.dealId);

    const inputDeal = DealAdapter.apiToEntity(input.body);

    await deal.update(inputDeal);

    return {
      body: DealAdapter.entityToApi(deal),
    };
  }
}
