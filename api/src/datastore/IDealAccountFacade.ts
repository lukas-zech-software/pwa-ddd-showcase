import { IDealAccount } from '../ddd/interfaces';
import { IBaseFacade }  from './IBaseFacade';

export type IDealAccountFacade = {
  getByCompanyId(companyId: string): Promise<IDealAccount>;
} & IBaseFacade<IDealAccount>;
