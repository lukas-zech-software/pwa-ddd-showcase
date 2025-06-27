import {
  ApiFilterSearchRequest,
  ApiSearchCompanyRequest,
  ApiSearchResponse,
  ApiSearchResponseMinimal,
} from '../common';
import { ApiRequest, ApiResponse }                                            from './';

export type ICustomerDealContract = {
  getForFilter(searchRequest: ApiRequest<ApiFilterSearchRequest>): ApiResponse<ApiSearchResponse>;
  getMinimal (searchRequest: ApiRequest<ApiFilterSearchRequest>): ApiResponse<ApiSearchResponseMinimal>;
  getThisWeeksDealsByCompany(searchRequest: ApiRequest<ApiSearchCompanyRequest>): ApiResponse<ApiSearchResponse>;
};
