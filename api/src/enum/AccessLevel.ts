export enum AccessLevel {

  /**
   * Every user not logged in
   */
  PUBLIC = 'PUBLIC',

  /**
   * Every logged in user
   */
  USER = 'USER',

  /**
   * A logged in company user
   */
  COMPANY = 'COMPANY',

  /**
   * A logged in backoffice user
   */
  BACKOFFICE = 'BACKOFFICE',
}
