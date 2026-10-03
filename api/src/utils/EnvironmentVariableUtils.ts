import { ErrorCode } from '../../../common/error/ErrorCode';
import { ApiError }  from '../common/ApiError';

/**
 * Utils for retrieving environment variables
 */
export class EnvironmentVariableUtils {
  /**
   * Tries to get a environment variable with the provided name
   * Throws if variable is not set
   * @param {string} name The name of the variable to retrieve
   * @param {any} defaultValue The default that should be returned if no env was found
   * @returns {string} The value of the variable to retrieve
   */
  public static get(name: string, defaultValue?: any): string {

    const value = process.env[name] || defaultValue;

    if (value !== undefined) {
      return value;
    }

    throw new ApiError(`Required environment variable [${name}] not set and no default provided`,
                       ErrorCode.GENERAL_INTERNAL_ERROR);
  }

}
