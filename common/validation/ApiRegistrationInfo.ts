import { Type }                 from 'class-transformer';
import {
  IsDefined,
  ValidateNested,
}                               from 'class-validator';
import { IApiRegistrationInfo } from '../interfaces';
import {
  ApiCompanyContact,
  ApiCompanyCorona,
  ApiCompanyDetails,
} from './ApiCompany';
import { ApiUserContact }       from './ApiUserContact';

export class ApiRegistrationInfo implements IApiRegistrationInfo {
  @IsDefined()
  @ValidateNested()
  @Type(() => ApiCompanyContact)
  public companyContact: ApiCompanyContact;

  public companyDetails: ApiCompanyDetails;

  public companyCorona: ApiCompanyCorona;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiUserContact)
  public user: ApiUserContact;
}
