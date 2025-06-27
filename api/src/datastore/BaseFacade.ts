import {
  CollectionReference,
  FieldValue,
  Firestore,
}                                 from '@google-cloud/firestore';
import { injectable }             from 'inversify';
import { ICacheService }          from '../cache/ICacheService';
import { IBaseDataObject }        from '../ddd/interfaces';
import { throwIfEntityUndefined } from '../utils/EntityUtils';
import { IBaseFacade }            from './IBaseFacade';
import WhereFilterOp = FirebaseFirestore.WhereFilterOp;

/**
 * Remove undefined values before saving the object
 * @param object
 */
function deleteUndefined(object: any): void {
  Object.keys(object).forEach(key => {
    if (object[key] === undefined) {
      delete object[key];
    }
  });
}

/**
 * When updating, all undefined values should be deleted on the DB as well
 * @param object
 */
function setUndefinedToValueDelete(object: any): void {
  Object.keys(object).forEach(key => {
    if (object[key] === undefined) {
      object[key] = FieldValue.delete();
    }
  });
}

@injectable()
export abstract class BaseFacade<T extends IBaseDataObject> implements IBaseFacade<T> {
  protected db: Firestore;

  protected constructor(
    isProduction: boolean,
    googleCloudProjectId: string,
    protected cacheService: ICacheService<T>,
  ) {
    this.db = new Firestore({ projectId: googleCloudProjectId });
  }

  public getId(baseDocumentId?: string): string {
    const ref = this.getCollection(baseDocumentId).doc();
    return ref.id;
  }

  public async get(id: string, baseDocumentId?: string): Promise<T> {
    let cached = await this.cacheService.get(
      id,
      this.getCachePrefix(baseDocumentId),
    );

    if (cached === undefined) {
      const result = await this
        .getCollection(baseDocumentId)
        .doc(id)
        .get();
      cached       = [result.data() as T];

      await this.cacheService.set(
        id,
        cached,
        this.getCachePrefix(baseDocumentId),
      );
    }

    return cached[0];
  }

  public async create(data: T, baseDocumentId?: string): Promise<T> {
    // clone data to remove all non enumerable data that should not be stored
    const rawData = Object.assign({}, data);

    deleteUndefined(rawData);

    throwIfEntityUndefined(rawData);

    rawData.created = Date.now();
    rawData.updated = Date.now();

    const result = await this.getCollection(baseDocumentId).add(rawData);

    rawData.id = result.id;

    await this.getCollection(baseDocumentId)
      .doc(rawData.id)
      .set(rawData);

    await this.clearCache(rawData);

    // TODO: prefill cache?
    // debug('CREATE', data);

    return Object.assign(data, rawData);
  }

  public async update(data: T, baseDocumentId?: string): Promise<T> {
    // clone data to remove all non enumerable data that should not be stored
    data = Object.assign({}, data);
    setUndefinedToValueDelete(data);

    data.updated = Date.now();

    await this.getCollection(baseDocumentId)
      .doc(data.id)
      .update(data);
    await this.clearCache(data);

    // TODO: prefill cache?
    // console.debug('UPDATE', data);

    return data;
  }

  public async remove(id: string, baseDocumentId?: string): Promise<void> {
    const data = await this.get(id, baseDocumentId);
    await this.getCollection(baseDocumentId)
      .doc(id)
      .delete();

    return this.clearCache(data);
  }

  public async getAll(baseDocumentId: string = 'X'): Promise<T[]> {
    const cacheKey = `all_${baseDocumentId}`;

    let cached = await this.cacheService.get(
      cacheKey,
      this.getCachePrefix(baseDocumentId),
    );

    if (cached === undefined) {
      const documents = await this.getCollection(baseDocumentId).get();

      cached = documents.docs.map(x => x.data() as T);
      await this.cacheService.set(
        cacheKey,
        cached,
        this.getCachePrefix(baseDocumentId),
      );
    }

    return cached;
  }

  protected async runQuery<K extends keyof T>(
    filter: IQueryFilter<T, K>[],
    baseDocumentId?: string,
  ): Promise<T[]> {
    const collection = filter.reduce(
      (col, { key, operator, value }) => col.where(key as string, operator, value),
      this.getCollection(baseDocumentId),
    );

    const result = await collection.get();

    return result.docs.map(x => x.data() as T);
  }

  protected async runCachedQuery<K extends keyof T>(
    filter: IQueryFilter<T, K>[],
    baseDocumentId?: string,
  ): Promise<T[]> {
    const cacheKey = filter
      .map(({ key, operator, value }) => key + operator + JSON.stringify(value))
      .join('-');

    let cached = await this.cacheService.get(
      cacheKey,
      this.getCachePrefix(baseDocumentId),
    );

    if (cached === undefined) {
      cached = await this.runQuery(filter);
      await this.cacheService.set(
        cacheKey,
        cached,
        this.getCachePrefix(baseDocumentId),
      );
    }

    return cached;
  }

  protected async clearCache(data: T, baseDocumentId?: string): Promise<void> {
    await this.cacheService.remove(
      data.id,
      this.getCachePrefix(baseDocumentId),
    );
  }

  public abstract getCachePrefix(baseDocumentId?: string): string;

  protected abstract getCollection(
    baseDocumentId?: string,
  ): CollectionReference;

}

export type IQueryFilter<T, K extends keyof T> = {
  key: K;
  operator: WhereFilterOp;
  value: T[K];
};
