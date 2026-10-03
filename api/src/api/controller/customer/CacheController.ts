import { HttpStatusCode }        from '@my-old-startup/common/http/HttpStatusCode';
import { ApiSearchResponse }     from '@my-old-startup/common/interfaces';
import { CUSTOMER_CACHE_ROUTES } from '@my-old-startup/common/routes/ApiRoutes';
import {
  inject,
  injectable,
}                                from 'inversify';
import { ICacheService }         from '../../../cache/ICacheService';
import { CACHE_CLEAR_SECRET }    from '../../../common/constants';
import { keys }                  from '../../../container/inversify.keys';
import { ICompanyFacade }        from '../../../datastore/ICompanyFacade';
import { AccessLevel }           from '../../../enum/AccessLevel';
import {
  ControllerResult,
  IWebRouteHandlerInput,
  Post,
}                                from '../../routing/webRouteDecorator';

@injectable()
export class CacheController {
  @inject(keys.ICacheService)
  private cacheService: ICacheService<any>;
  @inject(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;

  @Post(CUSTOMER_CACHE_ROUTES.clearAll, AccessLevel.PUBLIC)
  public async clearAll(
    input: IWebRouteHandlerInput<{ key: string }>,
  ): ControllerResult<ApiSearchResponse> {

    if (input.body.key !== CACHE_CLEAR_SECRET) {
      return {
        status: HttpStatusCode.NOT_AUTHORIZED,
      };
    }

    await this.cacheService.clearAll();
    console.log('Clear cache ALL');

    return {
      status: HttpStatusCode.NO_CONTENT,
    };
  }

  @Post(CUSTOMER_CACHE_ROUTES.clearCompany, AccessLevel.PUBLIC)
  public async getForFilter(
    input: IWebRouteHandlerInput<{ key: string }, { companyId: string }>,
  ): ControllerResult<ApiSearchResponse> {

    if (input.body.key !== CACHE_CLEAR_SECRET) {
      return {
        status: HttpStatusCode.NOT_AUTHORIZED,
      };
    }

    if (!input.url.companyId) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
      };
    }

    await this.cacheService.remove(input.url.companyId, this.companyFacade.getCachePrefix());

    console.log('Clear cache for company', input.url.companyId);

    return {
      status: HttpStatusCode.NO_CONTENT,
    };
  }
}
