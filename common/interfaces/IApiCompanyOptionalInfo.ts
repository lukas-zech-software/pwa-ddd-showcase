import { IApiCompanyContact } from './IApiCompany';

export type IApiCompanyOptionalInfo = Pick<IApiCompanyContact, 'telephone' | 'email' | 'website'>;
