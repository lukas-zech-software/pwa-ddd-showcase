import { Type }           from 'class-transformer';
import {
  IsDefined,
  ValidateNested,
}                         from 'class-validator';
import { IApiUser }       from '../interfaces';
import { ApiUserContact } from './ApiUserContact';

/**
 * The validation class for user data
 */
export class ApiUser implements IApiUser {
// NOTE: Do nat valid username or email as this might block signing up

  public userName: string;

  public emailAddress: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiUserContact)
  public contact: ApiUserContact;
}
