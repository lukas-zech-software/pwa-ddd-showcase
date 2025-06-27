import { IApiCompany }             from '../IApiCompany';
import { ICompanyUrlContext }      from '../urlContexts';
import { ApiRequest, ApiResponse } from './';

export type ICustomerCompanyContract = {
  getForId(input: ApiRequest<void, ICompanyUrlContext>): ApiResponse<IApiCompany>;
};
