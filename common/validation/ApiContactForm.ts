import { Equals, IsBoolean, IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { locale }                                                       from '../common/locales';
import { IApiContactForm }                                              from '../interfaces';

export class ApiContactForm implements IApiContactForm {

  @IsEmail(undefined, { message: locale.validationErrors.apiUser.emailAddress.isEmail })
  @MaxLength(120, { message: locale.validationErrors.apiUser.emailAddress.maxLength })
  public contactEmail: string;

  @IsOptional()
  @MaxLength(120, { message: locale.validationErrors.apiContactForm.subject.maxLength })
  public subject: string;

  @MinLength(10, { message: locale.validationErrors.apiContactForm.body.minLength })
  @MaxLength(1000, { message: locale.validationErrors.apiContactForm.body.maxLength })
  public body: string;

  @IsBoolean({ message: locale.validationErrors.apiContactForm.hasAcceptedTerms.isBoolean })
  @Equals(true, { message: locale.validationErrors.apiContactForm.hasAcceptedTerms.equals })
  public hasAcceptedTerms: boolean;
}
