/**
 * Different type the API can be used
 * TODO: Probably refactor to different applications?
 */
export enum ApiType {
  /**
   * API for public customers
   * No permissions at all
   * Only published and active deals
   */
  CUSTOMER = 'CUSTOMER',
  /**
   * API for the company dashboard
   * Checks for logged in Company
   * Allows creating and editing of all deals
   */
  DASHBOARD = 'DASHBOARD',
  /**
   * API for the admin hub
   * Checks for admin users
   * Allows everything
   */
  HUB = 'HUB',
}
