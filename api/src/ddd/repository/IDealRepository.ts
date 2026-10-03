import { Deal } from '../entities/Deal';

export type IDealRepository = {
  findById(dealId: string, companyId: string): Promise<Deal>;

  getForCompany(companyId: string): Promise<Deal[]>;

  getIdForNewDeal(companyId: string): string;

  remove(dealId: string, companyId: string): Promise<void>;
};
