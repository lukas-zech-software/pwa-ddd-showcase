import { ApiSetDealAccountRequest } from '../common';
import { IApiDealAccount }          from '../IApiDealAccount';
import { ICompanyUrlContext }       from '../urlContexts';
import { ApiRequest, ApiResponse }  from './index';

export type IHubDealAccountContract = {
  getAll(): ApiResponse<IApiDealAccount[]>;

  setDealAccount(request: ApiRequest<ApiSetDealAccountRequest, ICompanyUrlContext>): ApiResponse<void>;
};
