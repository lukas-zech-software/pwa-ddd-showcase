import { injectable }    from 'inversify';
import { ICacheService } from './ICacheService';

@injectable()
export class MemoryCacheService<T> implements ICacheService<T> {
  private cache: Map<string, any> = new Map();

  public async clearAll(): Promise<void> {
    this.cache = new Map();
  }

  public async removePrefix(prefix: string): Promise<void> {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  public async remove(key: string, prefix = ''): Promise<void> {
    this.cache.delete(prefix + key);
  }

  public async has(key: string, prefix = ''): Promise<boolean> {
    return this.cache.has(prefix + key);
  }

  public async get<T1 = T>(key: string, prefix = ''): Promise<T1 | undefined> {
    return this.cache.get(prefix + key);
  }

  public async set<T1 = T>(key: string, value: T1, prefix = ''): Promise<void> {
    if (!value) {
      // eslint-disable-next-line no-console
      console.warn('Cannot cache empty value on key', key);
      return;
    }
    this.cache.set(prefix + key, value);
  }
}
