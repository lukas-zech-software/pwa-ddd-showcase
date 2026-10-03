import {
  IsEmail,
  MaxLength,
  MinLength,
}                          from 'class-validator';
import { locale }          from '../common/locales';
import { IApiUserContact } from '../interfaces';

export class ApiUserContact implements IApiUserContact {
  @MinLength(2, { message: locale.validationErrors.apiCompany.contact.surname.length })
  @MaxLength(50, { message: locale.validationErrors.apiCompany.contact.surname.length })
  public firstName: string;

  @MinLength(2, { message: locale.validationErrors.apiCompany.contact.lastName.length })
  @MaxLength(50, { message: locale.validationErrors.apiCompany.contact.lastName.length })
  public lastName: string;

  @MinLength(3, { message: locale.validationErrors.apiCompany.contact.telephone.minLength })
  public telephone: string;

  @IsEmail(undefined, { message: locale.validationErrors.apiCompany.contact.email.isEmail })
  @MaxLength(120, { message: locale.validationErrors.apiCompany.contact.email.maxLength })
  public email: string;
}
