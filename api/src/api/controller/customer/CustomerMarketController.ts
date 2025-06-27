import {
  ApiMarketRequest,
  ApiMarketResponse,
  ApiSearchMarketResponse,
}                                 from '@my-old-startup/common/interfaces';
import { CUSTOMER_MARKET_ROUTES } from '@my-old-startup/common/routes/ApiRoutes';
import {
  inject,
  injectable,
}                                 from 'inversify';
import { MarketAdapter }          from '../../../adapter/MarketAdapter';
import { keys }                   from '../../../container/inversify.keys';
import { IMarketFacade }          from '../../../datastore/IMarketFacade';
import { AccessLevel }            from '../../../enum/AccessLevel';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
}                                 from '../../routing/webRouteDecorator';

@injectable()
export class CustomerMarketController {
  @inject(keys.IMarketFacade)
  private marketFacade: IMarketFacade;

  @Get(CUSTOMER_MARKET_ROUTES.getForId, AccessLevel.PUBLIC)
  public async getForId(
    input: IWebRouteHandlerInput<void, ApiMarketRequest>,
  ): ControllerResult<ApiMarketResponse> {
    const searchResult = await this.marketFacade.get(input.url.marketId);

    if (searchResult === undefined) {
      return {
        status: 404,
      };
    }

    return {
      body: {
        market: MarketAdapter.entityToApi(searchResult),
      },
    };
  }

  @Post(CUSTOMER_MARKET_ROUTES.getForFilter, AccessLevel.PUBLIC)
  public async getForFilter(): ControllerResult<ApiSearchMarketResponse> {
    const searchResult = await this.marketFacade.getByDateRange();

    return {
      body: {
        markets: searchResult.map(MarketAdapter.entityToApi),
      },
    };
  }
}
