import { IUser, IUserContact } from '../interfaces';

/**
 * Service to get information about registered users
 */
export type IUserAccountService = {
  throwIfUserDoesNotExist(authId: string): Promise<void | never>;

  updateContactData(authId: string, contactData: IUserContact): Promise<IUser>;
};
