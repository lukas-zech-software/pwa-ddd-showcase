/**
 * Generic error for the business logic
 */
import { BusinessErrorCode } from './BusinessErrorCode';

export class BusinessError extends Error {
  /**
   * Constructs an BusinessError
   * @param {string} message The message describing what went wrong
   * @param {ErrorCode} code The error code which categorizes the error
   */
  constructor(message: string, public code: BusinessErrorCode) {
    super(message);
  }

  /** @inheritDoc */
  public toString(): string {
    return `${super.toString()} (error code ${this.code})`;
  }
}
