import { injectable }    from 'inversify';
import { ICacheService } from './ICacheService';

@injectable()
export class FakeCacheService<T> implements ICacheService<T> {
  public async clearAll(): Promise<void> {
  }

  public async removePrefix(): Promise<void> {
  }

  public async remove(): Promise<void> {
  }

  public async has(): Promise<boolean> {
    return false;

  }

  public async get<T1 = T>(): Promise<T1 | undefined> {
    return undefined;
  }

  public async set<T1 = T>(): Promise<void> {
  }
}
