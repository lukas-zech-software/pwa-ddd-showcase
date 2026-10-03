import { IApiDeal }         from '@my-old-startup/common/interfaces';
import { BulkDealError }    from '@my-old-startup/common/interfaces/BulkDealError';
import { ICompanyInstance } from '../interfaces';

export type IDealService = {
  bulkPublish(
    company: ICompanyInstance,
    deals: IApiDeal[],
  ): Promise<BulkDealError[]>;
};
