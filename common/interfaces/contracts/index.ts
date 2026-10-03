// TODO: Add contracts for all facades / controller
export * from './ICustomerCompanyContract';
export * from './ICustomerDealContract';
export * from './IHubCompanyContract';
export * from './IHubDealAccountContract';

export type IUrlUserContext = {
  userId: string;
};

export type ApiRequest<TBody = void, TUrl = void, TQuery = void> = {
  body?: TBody;
  url?: TUrl;
  query?: TQuery;
  /**
   * Path to the temporary files
   */
  files?: { name: string; path: string }[];
};

export enum Tier {
  Frontend,
  Backend,
}

export type ApiResponse<T = void> = ApiFacadeResponse<T> | ControllerResponse<T>;
export type ApiFacadeResponse<T = void> = Promise<ApiResult<Tier.Frontend, T> | void>;
export type ControllerResponse<T = void> = Promise<ApiResult<Tier.Backend, T> | void>;

/**
 * Workaround for typescript not recognizing promise aliases
 * @see https://stackoverflow.com/questions/45902881/ts1055-when-using-async-await-using-a-type-alias
 */
export const ApiFacadeResponse  = Promise;
export const ControllerResponse = Promise;

export type ApiResult<R extends Tier, T = void> =
  R extends Tier.Frontend ? T :
    {
    /**
     * The content for the response body or an error message
     */
      body?: T;
    };
