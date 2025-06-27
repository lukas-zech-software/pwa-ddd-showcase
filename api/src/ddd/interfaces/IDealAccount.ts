import { IBaseDataObject } from './IBaseDataObject';

export type IDealAccount = {
  id: string;
  companyId: string;
  dealsRemaining: number;
} & IBaseDataObject;
