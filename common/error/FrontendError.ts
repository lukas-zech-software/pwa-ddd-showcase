import { HttpStatusCode } from '../http/HttpStatusCode';
import { IErrorResponse } from '../interfaces';
import { ErrorCode }      from './ErrorCode';

export class FrontendError extends Error {
  public constructor(message: string, public statusCode: HttpStatusCode, public errorResponse?: IErrorResponse) {
    // eslint-disable-next-line @typescript-eslint/tslint/config
    super(`${message} - ErrorCode ${HttpStatusCode[statusCode]} (${statusCode}) - ${errorResponse ? ErrorCode[errorResponse.errorCode] : ''}`);
  }
}
