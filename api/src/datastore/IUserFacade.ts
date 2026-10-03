import { IUser }       from '../ddd/interfaces';
import { IBaseFacade } from './IBaseFacade';

/**
 * Facade to access user data via API
 */
export type IUserFacade = {
  /**
   * Get the user data for the user authentication id
   * Throws if user is not yet registered
   *
   * @param {number} authId The users authentication id to get the user data for
   * @returns {Promise<IUser>} Resolves with user data
   */
  getByAuthId(authId: string): Promise<IUser>;

  /**
   * Get the user data for the user authentication id or undefined if user is not yet registered
   * Use this only to get user on login
   *
   * @param {number} authId The users authentication id to get the user data for
   * @returns {Promise<IUser>} Resolves with user data
   */
  tryFindByAuthId(authId: string): Promise<IUser | undefined>;
} & IBaseFacade<IUser>;
