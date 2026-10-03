// eslint-disable-next-line max-classes-per-file
import * as Cookie          from 'js-cookie';
import { CookieAttributes } from 'js-cookie';
import { TimeInMs }         from '../../../common/datetime';
import { IS_PRODUCTION }    from '../constants';

export type IStorageService<T> = {
  set(key: string, data: string|undefined, options?: T): void;

  get(key: string): string | null;

  has(key: string): boolean;

  remove(key: string): void;
};

/**
 * A simple storage implementation to store the data in local storage
 */
class StorageService implements IStorageService<void> {
  public set(key: string, data: string): void {
    localStorage.setItem(key, data);
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}

type CookieOptions = {
  timeoutInHours: number;
};

/**
 * A simple storage implementation to store the data in cookies
 */
class CookieService implements IStorageService<CookieOptions> {

  public set(key: string, data: string, options?: CookieOptions): void {
    Cookie.set(key, data, this.getOptions(options ? options.timeoutInHours : 8));
  }

  public get(key: string): string | null {
    return Cookie.get(key) || null;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public remove(key: string): void {
    Cookie.remove(key, this.getOptions());
  }

  private getOptions(timeoutHours = 8): CookieAttributes {
    const options: CookieAttributes = {
      expires: new Date(Date.now() + TimeInMs.ONE_HOUR * timeoutHours),
    };

    if (IS_PRODUCTION === true) {
      //options.domain = 'app' + process.env.BASE_DOMAIN;
      options.secure = true;
    }

    return options;
  }
}

class DummyStorageService implements IStorageService<void> {
  public set(): void {
    // nothing
  }

  public get(): string | null {
    return null;
  }

  public has(): boolean {
    return false;
  }

  public remove(): void {
    // nothing
  }
}

const USE_LOCAL_STORAGE = (function() {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
})();

export const storageService: IStorageService<void> = USE_LOCAL_STORAGE
  ? new StorageService()
  : new DummyStorageService();

export const cookieService: IStorageService<CookieOptions> = typeof window !== 'undefined'
  ? new CookieService()
  : new DummyStorageService();
