import { ErrorCode } from '../error/ErrorCode';

export type IErrorResponse<T = {}> = {
  errorCode: ErrorCode;
  data: T;
};
