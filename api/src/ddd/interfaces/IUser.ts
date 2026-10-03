import { AccessLevel }     from '../../enum/AccessLevel';
import { IBaseDataObject } from './IBaseDataObject';

/**
 * Information stored only for business contact
 */
export type IUserContact = {
  contactFirstName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

/**
 * Properties only visible in Hub
 */
export type IHubUser = {
  /**
   * Timestamp when the user last logged in
   */
  lastLogin: number;
};

/**
 * All properties of a user that may updated via API
 */
export type IPublicUser = {
  /**
   * The displayed user name
   */
  displayName: string;

  /**
   * The email address of the user
   * Must be unique
   */
  email: string;
} & IUserContact;

/**
 * All authentication data that is provided by 0Auth call
 */
export type I0AuthUser = {
  /**
   * Unique identifier for authentication
   * SUB property provided by used AUTH0 strategy
   */
  authId: string;

  /**
   * Access level of the user
   * Custom property provided by used AUTH0 strategy
   * Not stored in the DB
   */
  accessLevel: AccessLevel;
};

/**
 * All properties of a user including internal that MUST NOT be sent via API
 * This object is stored in the DB
 */
export type IUser = Pick<I0AuthUser, 'authId'> & IPublicUser & IHubUser & IBaseDataObject;
