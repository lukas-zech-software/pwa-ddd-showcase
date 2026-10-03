import { ICompany } from './ICompany';
import { IDeal }    from './IDeal';

export type ISearchResult = {
  distance: number;
  company: ICompany;
  deals: IDeal[];
};
