/**
 * HTTP Request methods used for a route
 */
export enum HttpRequestMethod {
  /**
   * Probe resource on server
   */
  HEAD = 'HEAD',

  /**
   * Request data from the resource
   */
  GET = 'GET',

  /**
   * Submit data to be processed by the resource
   */
  POST = 'POST',

  /**
   * Upload a resource
   */
  PUT = 'PUT',

  /**
   * Delete a resource
   */
  DELETE = 'DELETE',
}
