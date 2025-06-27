import { IApiDeal } from './IApiDeal';

export type BulkDealError = {
  deal: IApiDeal;
  error: string;
};
