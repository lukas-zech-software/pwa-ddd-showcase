/**
 * HTTP Response status codes
 * https://github.com/koajs/koa/blob/master/docs/api/response.md
 */

// @formatter:off
export enum HttpResponseCode {
  /** Everything is fine */
  OK = 200,

  /** User was not there before, but is now */
  CREATED = 201,

  /** OK with no body */
  NO_CONTENT = 204,

  /** Malformed request */
  BAD_REQUEST = 400,

  /** Not authorized, user not logged in */
  NOT_AUTHORIZED = 401,

  /** Wrong CSRF token or insufficient access level */
  FORBIDDEN = 403,

  /** Document not found */
  NOT_FOUND = 404,

  /** Client used an unknown HTTP method */
  METHOD_NOT_ALLOWED = 405,

  /** Just because its funny */
  I_AM_A_TEAPOT = 418,

  /** Something went wrong */
  INTERNAL_SERVER_ERROR = 500,
}
