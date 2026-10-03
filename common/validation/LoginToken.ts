import { IsDefined }   from 'class-validator';
import { ILoginToken } from '../interfaces';

/**
 * The validation class for login id token
 */
export class LoginToken implements ILoginToken {

  /** @inheritDoc */
  @IsDefined()
  public idToken: string;
}
