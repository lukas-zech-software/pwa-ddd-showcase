import { sanitize }     from 'class-sanitizer';
import { plainToClass } from 'class-transformer';
import { validate }     from 'class-validator';
import { ErrorCode }    from '../../../../common/error/ErrorCode';
import { ApiDeal }      from '../../../../common/validation';
import { ApiError }     from '../../common/ApiError';

/**
 * Validate the provided object by the validation decorators on the provided class
 */
export async function validateInstance<T, I extends T>(data: I, constructor: new () => T): Promise<void> {
  const entityInstance = plainToClass(constructor, data);

  sanitize(entityInstance);

  const validationResult = await validate(entityInstance, { forbidUnknownValues: true, skipMissingProperties: false });

  if (validationResult.length > 0) {
    for (const validationError of validationResult) {
      if (validationError.target instanceof ApiDeal) {
        throw new ApiError(JSON.stringify(validationResult), ErrorCode.WEB_SERVER_INVALID_DEAL);
      }
    }
    throw new ApiError(JSON.stringify(validationResult), ErrorCode.WEB_SERVER_INVALID_USER_INPUT);
  }
}
