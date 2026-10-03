import { HttpStatusCode } from '@my-old-startup/common/http/HttpStatusCode';
import { IS_SERVER }      from '../constants';
import { storageService } from './StorageService';

export type LogError = {
  message: string;
  details?: {} | string;
  timestamp: number;
  statusCode?: HttpStatusCode;
};

interface global {
  window: { stackdriverErrorHandler: { report: (e: any) => void } }
}

const LAST_ERROR_KEY = 'last_error';

export class LogService {
  private readonly consoleError: typeof console.error;

  constructor() {
    const consoleError = this.consoleError = console.error;
    console.error      = (...args:any[]) => {
      consoleError(...args);
      this.reportErrorToStackdriver(arguments[0], arguments);
    };
  }

  private reportErrorToStackdriver(message: string, details: any) {
    if (IS_SERVER) {
      return;
    }

    const stackdriverErrorHandler = (window as any).stackdriverErrorHandler;
    if (stackdriverErrorHandler) {
      stackdriverErrorHandler.report(new Error(`${message}: [${JSON.stringify(details)}]`));
    }
  }

  public error(message: string, details?: {} | string, statusCode?: HttpStatusCode): void {
    const logError: LogError = {
      message,
      details,
      statusCode,
      timestamp: Date.now(),
    };

    storageService.set(LAST_ERROR_KEY, JSON.stringify(logError));
    // eslint-disable-next-line no-console
    this.consoleError(logError.message, logError.details);
    this.reportErrorToStackdriver(logError.message, logError.details);
  }

  public info(message: string, details?: {} | string): void {
    // eslint-disable-next-line no-console
    console.info(message, details);
  }

  public getLastError(): LogError | undefined {
    const lastErrorString = storageService.get(LAST_ERROR_KEY);
    if (lastErrorString !== null) {
      return JSON.parse(lastErrorString);
    }
  }
}

export const logService = new LogService();
