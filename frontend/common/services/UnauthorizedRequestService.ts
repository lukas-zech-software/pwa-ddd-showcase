import { FrontendError }     from '@my-old-startup/common/error/FrontendError';
import { HttpRequestMethod } from '@my-old-startup/common/http/HttpRequestMethod';
import { HttpStatusCode }    from '@my-old-startup/common/http/HttpStatusCode';
import { IErrorResponse }    from '@my-old-startup/common/interfaces/IErrorResponse';
import { XRoute }            from '@my-old-startup/common/routes/ApiRoutes';
import 'isomorphic-fetch';
import { logService }        from './LogService';

export class UnauthorizedRequestService {

  public async sendToApi<T = void, D = void>(route: string, data?: D): Promise<T | undefined> {
    const url    = this.getBaseUrl();
    url.pathname = route;

    return this.tryToFetch<T>(url.toString(),
                              {
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                method:  HttpRequestMethod.POST.toString(),
                                body:    JSON.stringify(data),
                                mode:    'cors',
                              },
    );
  }

  public async getFromApi<T, R = {}>(route: XRoute<R>, data?: R): Promise<T | undefined> ;

  public async getFromApi<T>(route: string, data?: string): Promise<T | undefined> {
    const url    = this.getBaseUrl();
    url.pathname = route;

    if (data) {
      url.search = data;
    }

    return this.tryToFetch<T>(url.toString(), {
      mode: 'cors',
    });
  }

  public getBaseUrl(): URL {
    // TODO: inject
    return new URL(process.env.API_URL || 'invalid');
  }

  private async tryToFetch<T>(url: string, init: RequestInit): Promise<T | undefined> {
    let response: Response;

    try {
      // console.log('REQUEST', request, init);
      response = await fetch(url, init);
      // console.log('RESPONSE', url, response);
    } catch (error) {

      const message = `Fetch failed. URL: ${url}`;
      logService.error(message, error);

      // windowService.redirect(FrontendRoutes.Error.toString());
      throw error;
    }

    if (response.status === HttpStatusCode.OK) {
      const bodyString = await response.text();
      if (bodyString && bodyString.length !== 0) {
        return JSON.parse(bodyString);
      }
      return undefined;
    }

    if (response.status === HttpStatusCode.CREATED) {
      return;
    }

    if (response.status === HttpStatusCode.NO_CONTENT) {
      return;
    }

    if (response.status === HttpStatusCode.NOT_AUTHORIZED) {
      logService.error('NOT_AUTHORIZED', undefined, response.status);
      throw new FrontendError('NOT_AUTHORIZED', response.status);
    }

    // everything else is considered an error
    // on all 4xx or 5xx states the body contains the ErrorCode
    const bodyString = await response.text();
    let errorResponse: IErrorResponse | undefined;

    try {
      errorResponse = JSON.parse(bodyString);
    } catch (e) {
      // no error response
    }

    logService.error('Request failed', { body: bodyString }, response.status);

    throw new FrontendError('Request failed', response.status, errorResponse);
  }
}

export const unauthorizedRequestService = new UnauthorizedRequestService();
