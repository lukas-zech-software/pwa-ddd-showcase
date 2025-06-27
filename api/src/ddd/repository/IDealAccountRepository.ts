import { DealAccount } from '../entities/DealAccount';
import { IRepository } from './IRepository';

export type IDealAccountRepository = {
  findByCompany(companyId: string): Promise<DealAccount>;

  getAll(): Promise<DealAccount[]>;
} & IRepository<DealAccount>;
