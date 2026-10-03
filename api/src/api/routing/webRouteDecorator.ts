import { Request, Response } from 'express';
import 'reflect-metadata';
import { XRoute }              from '../../../../common/routes/ApiRoutes';
import { ROUTE_META_DATA_KEY } from '../../common/constants';
import { AccessLevel }         from '../../enum/AccessLevel';
import { IAuthInfo }           from '../interfaces/ISessionData';

/**
 * Web route types for the web route decorators
 */
export enum WebRouteType {
  GET = 'get',
  POST = 'post',
  UPLOAD = 'upload',
  PUT = 'put',
  DELETE = 'delete',
}

export type IWebRouteHandlerInput<TBody = void, TUrl = void, TQuery = void> = {
  body: TBody;
  url: TUrl;
  query: TQuery;
  /**
   * Path to the temporary files
   */
  files: { name: string; path: string }[];
};

/**
 * A route handler in a controller
 * Accepts the custom context and optinally body,url or query models
 */
export type IWebRouteHandler<TResult = void, TBody = void, TUrl = void, TQuery = void> = (
  input: IWebRouteHandlerInput<TBody, TUrl, TQuery>,
  authInfo: IAuthInfo,
  request: Request,
  response: Response,
) => ControllerResult<TResult>;

/**
 * The signature of the WebRouteDecorator
 *
 * @param target The prototype of the class
 * @param propertyKey The name of the method
 * @param descriptor The property descriptor for the decorated method
 */
export type IWebRouteDecoratorFn<TResult = void, TBody = void, TUrl = void, TQuery = void> = (
  target: Record<string, any>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<IWebRouteHandler<TResult, TBody, TUrl, TQuery>>,
) => void;

export type IWebRouteController = {
  [index: string]: IWebRouteHandler<void>;
};

export type IConstructorFn<T> = new(...params: any[]) => T;

export type ControllerResult<T = void> = Promise<IWebRouteHandlerResult<T> | void>;

export type IWebRouteHandlerResult<T = void> = {
  /**
   * The content for the response body or an error message
   */
  body?: T;
  /**
   * The status code to send
   * Defaults to 200 if successfull and 500 in case of error
   */
  status?: number;

  /**
   * HTTP header to send with the response
   */
  header?: { [index: string]: string };
};

/**
 * Option for input data validation
 */
export type IValidationOptions<TBody = void, TUrl = void, TQuery = void> = {
  /**
   * The class to validate the request body with
   */
  bodyModel?: IConstructorFn<TBody>;

  /**
   * The class to validate the request url with
   */
  urlModel?: IConstructorFn<TUrl>;

  /**
   * The class to validate the request query string with
   */
  queryModel?: IConstructorFn<TQuery>;
};

/**
 * Describes a web route with the handler to invoke
 */
export type IWebRouteDecoratorMetaData<TBody = void, TUrl = void, TQuery = void> = {
  /** The file name of the controller */
  route: string;

  /** The type of the route. One of {@link WebRouteType} */
  webRouteType: string;

  /** The access level for this route. One of {@link AccessLevel} */
  accessLevel: AccessLevel;

  /** Optional parameters for the route */
  webRouteOptions?: IWebRouteOptions;

  /** The name of the class that contains the route handler */
  className: string;

  /** The name of the route handler function */
  handlerName: string;

  /** The options for validation */
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>;
};

export type IUploadOptions = {
  /**
   * Used by WebRouteType.UPLOAD to filter file extensions
   */
  allowedFileExtensions?: string[];

  /**
   * name of the form fields the uploads are stored in
   */
  uploadFormFields: string[];

  /**
   * Used by WebRouteType.UPLOAD to determine the maximum size of the uploaded file
   */
  maxFileSize?: number;
};

/**
 * DTO for WebRoutes that need optional parameters
 */
export type IWebRouteOptions = {
  /**
   * Route priority
   * If two route have conflicting urls, use this to give one a higher priority
   * eg.
   * /api/v1/apps/-/ResolvePossibleParents -> needs higher priority
   *
   * /api/v1/apps/:localIdentifier/ResolvePossibleParents
   *
   * {@see https://stackoverflow.com/questions/31493190/express-parameterized-route-conflict}
   */
  priority?: number;

  uploadOptions?: IUploadOptions;

  /**
   * If the route expects only a partial object e.g. on an update, set this to true
   */
  validatePartial?: boolean;
};

/**
 * Store the MetaData for each WebRoute
 * @param route The route string
 * @param {string} accessLevel The minimum access level required for accessing this route
 * @param validationOptions [optional] The options used for validation
 * @param webRouteType The type of the request. One of {@link WebRouteType}
 * @param webRouteOptions [optional] Additional parameters for the route
 * @returns The decorator function
 */
function getWebRouteDecoratorFn<TResult = void, TBody = void, TUrl = void, TQuery = void>(
  route: string,
  accessLevel: AccessLevel,
  webRouteType: string,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {

  // NOTE: keep descriptor parameter even when unused to ensure type safety of decorator
  return (
    target: Record<string, any>,
    propertyKey: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: TypedPropertyDescriptor<IWebRouteHandler<TResult, TBody, TUrl, TQuery>>,
  ): void => {

    if (!Reflect.hasOwnMetadata(ROUTE_META_DATA_KEY, target.constructor)) {
      Reflect.defineMetadata(ROUTE_META_DATA_KEY, [], target.constructor);
    }

    const list: IWebRouteDecoratorMetaData<TBody, TUrl, TQuery>[]
            = Reflect.getOwnMetadata(ROUTE_META_DATA_KEY,
                                     target.constructor),
          metaData: IWebRouteDecoratorMetaData<TBody, TUrl, TQuery> = {
            route,
            webRouteType,
            accessLevel,
            webRouteOptions,
            className:   target.constructor.name,
            handlerName: propertyKey,
            validationOptions,
          };

    list.push(metaData);
  };
}

/**
 * WebRoute decorator function for GET requests
 * @param {string} route The route this handler serves
 * @param validationOptions [optional] The options used for validation
 * @param {string} accessLevel The minimum access level required for accessing this route
 * @param webRouteOptions [optional] The options used for the route
 * @returns The decorator function
 */
export function Get<TResult = any, TBody = any, TUrl = any, TQuery = any>(
  route: string,
  accessLevel: AccessLevel,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {
  return getWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery>(
    route, accessLevel, WebRouteType.GET, validationOptions, webRouteOptions,
  );
}

/**
 * WebRoute decorator function for PUT requests
 * @param route The route this handler serves
 * @param {string} accessLevel The minimum access level required for accessing this route
 * @param validationOptions [optional] The options used for validation
 * @param webRouteOptions [optional] The options used for the route
 * @returns The decorator function
 */
export function Put<TResult = any, TBody = any, TUrl = any, TQuery = any>(
  route: string,
  accessLevel: AccessLevel,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {
  return getWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery>(
    route, accessLevel, WebRouteType.PUT, validationOptions, webRouteOptions,
  );
}

/**
 * WebRoute decorator function for POST requests
 * @param route The route this handler serves
 * @param {string} accessLevel The minimum access level required for accessing this route
 * @param validationOptions [optional] The options used for validation
 * @param webRouteOptions [optional] The options used for the route
 * @returns The decorator function
 */
export function Post<TResult = any, TBody = any, TUrl = any, TQuery = any>(
  route: XRoute<TUrl>,
  accessLevel: AccessLevel,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {
  return getWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery>(
    route, accessLevel, WebRouteType.POST, validationOptions, webRouteOptions,
  );
}

export function Upload<TResult = any, TBody = any, TUrl = any, TQuery = any>(
  route: XRoute<TUrl>,
  accessLevel: AccessLevel,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {
  return getWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery>(
    route, accessLevel, WebRouteType.UPLOAD, validationOptions, webRouteOptions,
  );
}

/**
 * WebRoute decorator function for DELETE requests
 * @param route The route this handler serves
 * @param {string} accessLevel The minimum access level required for accessing this route
 * @param validationOptions [optional] The options used for validation
 * @param webRouteOptions [optional] The options used for the route
 * @returns The decorator function
 */
export function Delete<TResult = any, TBody = any, TUrl = any, TQuery = any>(
  route: string,
  accessLevel: AccessLevel,
  validationOptions?: IValidationOptions<TBody, TUrl, TQuery>,
  webRouteOptions?: IWebRouteOptions,
): IWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery> {
  return getWebRouteDecoratorFn<TResult, TBody, TUrl, TQuery>(
    route, accessLevel, WebRouteType.DELETE, validationOptions, webRouteOptions,
  );
}
