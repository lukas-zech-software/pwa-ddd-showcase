import { IApiBaseDataObject } from './IApiBaseDataObject';

export type IApiUserContact = {
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
};

export type IApiUser = {
  /**
   * The displayed user name
   */
  userName: string;

  /**
   * The email address of the user
   */
  emailAddress: string;

  contact: IApiUserContact;
};

export type IHubApiUser = {
  authId: string;
  lastLogin: number;

  contact: IApiUserContact;
} & IApiUser & IApiBaseDataObject;
