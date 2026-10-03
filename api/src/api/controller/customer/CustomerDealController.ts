import { TimeInMs }              from '@my-old-startup/common/datetime';
import {
  ApiFilterSearchRequest,
  ApiSearchCompanyRequest,
  ApiSearchDealRequest,
  ApiSearchDealResponse,
  ApiSearchResponse,
  ApiSearchResponseMinimal,
}                                from '@my-old-startup/common/interfaces';
import { ICustomerDealContract } from '@my-old-startup/common/interfaces/contracts';
import { CUSTOMER_DEAL_ROUTES }  from '@my-old-startup/common/routes/ApiRoutes';
import {
  inject,
  injectable,
}                                from 'inversify';
import { CompanyAdapter }        from '../../../adapter/CompanyAdapter';
import { DealAdapter }           from '../../../adapter/DealAdapter';
import { keys }                  from '../../../container/inversify.keys';
import { CompanyFacade }         from '../../../datastore/CompanyFacade';
import { CompanyRepository }     from '../../../ddd/repository/CompanyRepository';
import {
  CustomerSearchService,
  SearchDealResponse,
}                                from '../../../ddd/services/CustomerSearchService';
import { AccessLevel }           from '../../../enum/AccessLevel';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
}                                from '../../routing/webRouteDecorator';

@injectable()
export class CustomerDealController implements ICustomerDealContract {
  @inject(keys.ICustomerSearchService)
  private customerSearchService: CustomerSearchService;

  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @inject(keys.ICompanyFacade)
  private companyFacade: CompanyFacade;

  @Get(CUSTOMER_DEAL_ROUTES.getForId, AccessLevel.PUBLIC)
  public async getForId(
    input: IWebRouteHandlerInput<void, ApiSearchDealRequest>,
  ): ControllerResult<ApiSearchDealResponse> {
    const searchResult = await this.customerSearchService.getDealsForId(
      input.url,
    );

    if (searchResult.company === undefined || searchResult.deal === undefined) {
      return {
        status: 404,
      };
    }

    return {
      body: {
        company: CompanyAdapter.entityToPublicApi(searchResult.company),
        deal:    DealAdapter.entityToApi(searchResult.deal),
      },
    };
  }

  @Get(CUSTOMER_DEAL_ROUTES.getTop, AccessLevel.PUBLIC)
  public async getTop(): ControllerResult<ApiSearchDealResponse[]> {
    const searchResults = await this.customerSearchService.getTopDeals();

    return {
      body: searchResults.map((x: SearchDealResponse) => ({
        company: CompanyAdapter.entityToPublicApi(x.company),
        deal:    DealAdapter.entityToApi(x.deal),
      })),
    };
  }

  @Post(CUSTOMER_DEAL_ROUTES.getForFilter, AccessLevel.PUBLIC)
  public async getForFilter(
    input: IWebRouteHandlerInput<ApiFilterSearchRequest>,
  ): ControllerResult<ApiSearchResponse> {
    const searchResult = await this.customerSearchService.getDealsForFilter(
      input.body.filter,
    );

    return {
      body: DealAdapter.customerSearchResultToApi(searchResult),
    };
  }

  @Post(CUSTOMER_DEAL_ROUTES.getForFilterMinimal, AccessLevel.PUBLIC)
  public async getMinimal(
    input: IWebRouteHandlerInput<ApiFilterSearchRequest>,
  ): ControllerResult<ApiSearchResponseMinimal> {
    const searchResult = await this.customerSearchService.getGeoSearchResult(
      input.body.filter,
    );

    return { body: DealAdapter.customerSearchResultToApiMinimal(searchResult) };
  }

  @Post(CUSTOMER_DEAL_ROUTES.getThisWeeksDealsByCompany, AccessLevel.PUBLIC)
  public async getThisWeeksDealsByCompany(
    input: IWebRouteHandlerInput<ApiSearchCompanyRequest>,
  ): ControllerResult<ApiSearchResponse> {
    const timeSearchRange = TimeInMs.ONE_WEEK;

    const searchResult = await this.customerSearchService.getDealsForCompanyAndDate(
      input.body.companyId,
      {
        validFrom: Date.now() - TimeInMs.ONE_WEEK,
        validTo:   Date.now() + timeSearchRange,
      },
    );

    return {
      body: DealAdapter.customerSearchResultToApi(searchResult),
    };
  }
}
