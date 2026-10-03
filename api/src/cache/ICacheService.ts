export type ICacheService<T> = {
  clearAll(): Promise<void>;

  removePrefix(prefix: string): Promise<void>;

  remove(key: string, prefix: string): Promise<void>;

  has(key: string, prefix: string): Promise<boolean>;

  get(key: string, prefix: string): Promise<T[] | undefined>;

  set(key: string, value: T[], prefix: string): Promise<void>;
};
