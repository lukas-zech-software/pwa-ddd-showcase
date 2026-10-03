/**
 * DTO for session data
 */
import { I0AuthUser } from '../../ddd/interfaces';

/**
 * authentication info for a request
 */
export type IAuthInfo = {
  /**
   * User from the authorization token
   */
  authUser: I0AuthUser;
};
