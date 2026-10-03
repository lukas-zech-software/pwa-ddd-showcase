import { HttpRequestMethod }     from '@my-old-startup/common/http/HttpRequestMethod';
import { CUSTOMER_CACHE_ROUTES } from '@my-old-startup/common/routes/ApiRoutes';
import { injectable }            from 'inversify';
import fetch                     from 'node-fetch';
import { CACHE_CLEAR_SECRET }    from '../common/constants';

type ApiName = 'customer' | 'dashboard' | 'hub';

const baseApiUrl = process.env.BASE_DOMAIN;

export interface ICacheBreakService {
  clearAll(): Promise<void>;

  clearCompany(companyId: string): Promise<void>;
}

@injectable()
export class CacheBreakService implements ICacheBreakService {

  private async send(route: string): Promise<void> {
    let baseRoute = `https://api-customer${baseApiUrl}`;

    if (baseApiUrl === undefined) {
      baseRoute = 'http://localhost:8380';
    }

    const result = await fetch(baseRoute + route, {
                  method:  HttpRequestMethod.POST.toString(),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body:    JSON.stringify({ key: CACHE_CLEAR_SECRET }),
                },
    );

    console.log('Sent cache clear request', baseRoute + route, result.status);
  }

  public async clearAll(): Promise<void> {
    await this.send(CUSTOMER_CACHE_ROUTES.clearAll);
  }

  public async clearCompany(companyId: string): Promise<void> {
    await this.send(CUSTOMER_CACHE_ROUTES.clearCompany.replace(':companyId', companyId));
  }
}
