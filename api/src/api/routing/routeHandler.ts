import { IErrorResponse }         from '@my-old-startup/common/interfaces';
import {
  NextFunction,
  Request,
  Response,
}                                 from 'express';
import {
  inject,
  injectable,
}                                 from 'inversify';
import 'reflect-metadata';
import { ErrorCode }              from '../../../../common/error/ErrorCode';
import { ApiError }               from '../../common/ApiError';
import { ACCESS_TOKEN_FIELD }     from '../../common/constants';
import { keys }                   from '../../container/inversify.keys';
import { I0AuthUser }             from '../../ddd/interfaces';
import { AccessLevel }            from '../../enum/AccessLevel';
import { HttpResponseCode }       from '../../enum/HttpResponseCode';
import { IAuthenticationService } from '../authentication/AuthenticationService';
import { IAuthInfo }              from '../interfaces/ISessionData';
import { validateInstance }       from './validate';
import {
  IWebRouteDecoratorMetaData,
  IWebRouteHandler,
}                                 from './webRouteDecorator';

/**
 * Maps ApiErrorCodes to HttpResponseCodes
 * @param {ErrorCode} errorCode The code ot the ApiError
 * @return {HttpResponseCode}
 */
function getHttpResponseCode(errorCode: ErrorCode): HttpResponseCode {
  switch (errorCode) {
    case ErrorCode.WEB_SERVER_INVALID_CREDENTIALS:
    case ErrorCode.WEB_SERVER_INVALID_SECURE_TOKEN:
    case ErrorCode.WEB_SERVER_EXPIRED_SECURE_TOKEN:
    case ErrorCode.WEB_SERVER_INVALID_SESSION:
      return HttpResponseCode.NOT_AUTHORIZED;

    case ErrorCode.WEB_SERVER_INVALID_USER_INPUT:
    case ErrorCode.WEB_SERVER_INVALID_FILE_UPLOAD:
    case ErrorCode.WEB_SERVER_INVALID_REQUEST_DATA:
    case ErrorCode.WEB_SERVER_INVALID_DEAL:
    case ErrorCode.WEB_SERVER_DUPLICATE_CREDENTIALS:
    case ErrorCode.WEB_SERVER_UNCALLED_RESET:
    case ErrorCode.WEB_SERVER_SUPERFLUOUS_ACTIVATION:
    case ErrorCode.WEB_SERVER_COUPON_ALREADY_USED:
    case ErrorCode.WEB_SERVER_DUPLICATE_COMPANY:
      return HttpResponseCode.BAD_REQUEST;

    case ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND:
      return HttpResponseCode.NOT_FOUND;

    case ErrorCode.WEB_SERVER_INSUFFICIENT_PERMISSIONS:
      return HttpResponseCode.FORBIDDEN;

    case ErrorCode.WEB_SERVER_NO_DATA_FOUND:
      return HttpResponseCode.NOT_FOUND;

    case ErrorCode.WEB_SERVER_INVALID_HTTP_VERB:
      return HttpResponseCode.METHOD_NOT_ALLOWED;
    default:
      console.debug(
        `Unknown ErrorCode [${errorCode}](${HttpResponseCode[errorCode]}) / defaulting to [500](INTERNAL_SERVER_ERROR)`,
      );
      return HttpResponseCode.INTERNAL_SERVER_ERROR;
  }
}

@injectable()
export class RouteHandler {
  @inject(keys.IAuthenticationService)
  private authenticationService: IAuthenticationService;

  /**
   * Route handler that handles:
   * - validation of input data,
   * - execution of the controller function,
   * - returning of data / error
   */
  public async routeHandler(controllerFn: IWebRouteHandler,
                            metadata: IWebRouteDecoratorMetaData,
                            request: Request,
                            response: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            next: NextFunction): Promise<void> {
    // console.debug(`Executing route [${metadata.webRouteType}]: ${metadata.route}`, request.url);

    let session: IAuthInfo | undefined;

    try {

      // TODO: Extract to middleware
      if (metadata.accessLevel !== AccessLevel.PUBLIC) {

        const authUser = await this.authenticationService.getAuthenticatedUserId(request.header(ACCESS_TOKEN_FIELD));

        this.checkAccess(authUser, metadata);

        session = {
          authUser,
        };
      }

      if (metadata.validationOptions) {
        if (metadata.validationOptions.bodyModel) {
          await validateInstance(request.body, metadata.validationOptions.bodyModel);
        }

        if (metadata.validationOptions.urlModel) {
          await validateInstance(request.params as any, metadata.validationOptions.urlModel);
        }

        if (metadata.validationOptions.queryModel) {
          await validateInstance(request.query, metadata.validationOptions.queryModel);
        }
      }

      let allFiles: { name: string; path: string }[] = [];

      if (request.files) {
        allFiles = Object.values(request.files).map(([x]) => ({ name: x.fieldname, path: x.path }));
      }

      const result = await controllerFn({
        body:  request.body,
        url:   request.params as any,
        query: request.query,
        files: allFiles,
        // session may be undefined if you access it on a public route
      },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        session!,
                                        request,
                                        response,
      ) || {};

      if (result.header) {
        Object.values(result.header).forEach(([name, value]) => {
          response.setHeader(name, value);
        });
      }

      // always send response object with {payload,status,warning,error}

      if (result.body) {
        // eslint-disable-next-line require-atomic-updates
        response.statusCode = result.status || 200;
        response.contentType('application/json');

        response.send(JSON.stringify(result.body));
      } else {
        // eslint-disable-next-line require-atomic-updates
        response.statusCode = result.status || 204;
        response.send();
      }

      // let message = `Successfully executed route [${metadata.webRouteType}] ${metadata.route}`;
      // message += `@${request.url} => ${response.statusCode}`;

      // console.debug(message);

      // TODO: Activate for middleware after request?
      // next();
    } catch (error) {

      // default
      // eslint-disable-next-line require-atomic-updates
      response.statusCode = HttpResponseCode.INTERNAL_SERVER_ERROR;

      let errorResponse: IErrorResponse | undefined;

      let message = `Error on route [${metadata.webRouteType}] ${metadata.route}`;
      message += `@${request.url} => ${HttpResponseCode[response.statusCode]}`;

      if (error instanceof ApiError) {
        // eslint-disable-next-line require-atomic-updates
        response.statusCode = getHttpResponseCode(error.code);
        errorResponse       = {
          errorCode: error.code,
          data:      error.data,
        };
        message += `\n ErrorCode: ${ErrorCode[error.code]}`;

        response.send(errorResponse);
      }

      // eslint-disable-next-line no-console
      console.error(message, error);

      response.end();

      // TODO: Activate for middleware after request?
      // next(error);

    }
  }

  private checkAccess(authUser: I0AuthUser, metaData: IWebRouteDecoratorMetaData): void {
    if (authUser.accessLevel === metaData.accessLevel) {
      // user has correct access level => allowed
      return;
    }
    if (metaData.accessLevel === AccessLevel.USER && authUser.accessLevel === AccessLevel.COMPANY) {
      // companies can also access user routes
      return;
    }

    if (authUser.accessLevel === AccessLevel.BACKOFFICE) {
      // user is admin => allowed
      return;
    }

    const message = `User [${authUser.authId}] is not allowed to access route [${metaData.route}]`;
    throw new ApiError(message, ErrorCode.WEB_SERVER_INSUFFICIENT_PERMISSIONS);
  }
}
