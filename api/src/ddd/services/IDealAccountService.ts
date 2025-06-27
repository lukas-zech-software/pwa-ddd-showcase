import { IDealAccount } from '../interfaces';

export type IDealAccountService = {
  getAccountForCompany(companyId: string): Promise<IDealAccount>;

  useDeal(dealId: string, companyId: string): Promise<void>;

  setDealsRemaining(companyId: string, count?: number): Promise<void>;
};
