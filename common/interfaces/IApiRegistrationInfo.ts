import {
  IApiCompanyContact,
  IApiCompanyCorona,
  IApiCompanyDetails,
} from './IApiCompany';
import { IApiUserContact }    from './IApiUser';

export type IApiRegistrationInfo = {
  companyContact: IApiCompanyContact;
  companyDetails: IApiCompanyDetails;
  companyCorona: IApiCompanyCorona;
  user: IApiUserContact;
};
