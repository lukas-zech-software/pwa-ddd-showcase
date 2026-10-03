/**
 * Generic error for the Api
 */
import { ErrorCode } from '../../../common/error/ErrorCode';

export class ApiError extends Error {
  /**
   * Constructs an ApiError
   * @param {string} message The message describing what went wrong
   * @param {ErrorCode} code The error code which categorizes the error
   * @param {any} data Data to be send along with the error
   */
  constructor(message: string, public code: ErrorCode, public data?: any) {
    super(message);
  }
}
