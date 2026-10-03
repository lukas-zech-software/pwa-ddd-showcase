/* eslint-disable */
declare module '@google-cloud/datastore' {
  interface IAuthOptions {
    projectId?: string;
    keyFilename?: string;
  }

  interface IDatastoreOptions extends IAuthOptions {
    /**
     * Override the default API endpoint used to reach Datastore.
     * This is useful for connecting to your local Datastore server (usually "http://localhost:8080").
     */
    apiEndpoint?: string;
    /** Namespace to isolate transactions to. */
    namespace?: string;
  }

  function datastore<T>(options?: IDatastoreOptions): datastore.IDataset<T>;

  namespace datastore {
    export interface IEntityInstrumentedData {
      name: string;
      value: string | number | boolean | IInt | IDouble | Date | Buffer | any[];
      excludeFromIndexes?: boolean;
    }

    export interface IEntity<TData> {
      key: IKey;
      /**
       * Optional method to explicity use for save.
       */
      method?: 'insert' | 'update' | 'upsert';
      /**
       * Data to save with the provided key. If you provide an array of objects,
       * you must use the explicit syntax: name for the name of the property and value for its value.
       * You may also specify an excludeFromIndexes property, set to true or false.
       */
      data: TData | IEntityInstrumentedData[];
    }

    interface LatLng {
      latitude: number;
      longitude: number;
    }

    /** functions that are shared between both the ITransaction and IDataset interfaces */
    export interface IDatastore<T> {

      /**
       * A symbol to access the Key object from an entity object.
       *
       * @type {symbol}
       */
      KEY: symbol;

      geoPoint(coordinates: LatLng): object;

      /**
       * Generate IDs without creating entities.
       *
       * @param incompleteKey The key object to complete.
       * @param n How many IDs to generate
       * @param callback
       */
      allocateIds(incompleteKey: IKey, n: number, callback: (err: any, keys: IKey[], apiResponse: any) => void): void;

      allocateIds(incompleteKey: IKey, n: number): Promise<[IKey[], any]>;

      /**
       * Delete all entities identified with the specified key(s).
       */
      delete(key: IKey | IKey[], callback: (err: any, apiResponse: any) => void): void;

      delete(key: IKey | IKey[]): Promise<void>;

      /**
       * Retrieve the entities identified with the specified key(s) in the current transaction.
       * Get operations require a valid key to retrieve the key-identified entity from Datastore.
       */
      get(key: IKey, callback: (err: any, entity: T) => void): void;

      get(keys: IKey[], callback: (err: any, entities: T[]) => void): void;

      /**
       * If the callback is omitted, we'll return a Promise.
       * Promise always resolve with arrays even if only a single entity was returned
       */
      get(key: IKey): Promise<T[]>;

      get(keys: IKey[]): Promise<T[]>;

      /**
       * Datastore allows you to query entities by kind, filter them by property filters,
       * and sort them by a property name.
       *
       * Projection and pagination are also supported.
       *
       * If you provide a callback, the query is run,
       * and the results are returned as the second argument to your callback.
       *
       * A third argument may also exist, which is a query object that uses the end cursor
       * from the previous query as the starting cursor for the next query.
       *
       * You can pass that object back to this method to see if more results exist.
       *
       * You may also omit the callback to this function to trigger streaming mode.
       */
      runQuery(q: IQuery<T>, callback: (err: any, entities: T[], info: QueryInfo) => void): void;

      runQuery(q: IQuery<T>): Promise<[T[], QueryInfo]>;

      runQueryStream(q: IQuery<T>): IStream<IEntity<T>>;

    }

    interface QueryInfo {
      endCursor: string | null;
      moreResults: string;
    }

    type KeyPath = string | number | (string | number)[];

    interface KeyOptions {
      path: KeyPath;
      namespace: string;
    }

    export interface IDataset<T> extends IDatastore<T> {

      /**
       * Maps to datastore/dataset#save, forcing the method to be insert.
       */
      insert: IDatasetSaveMethod<T>;

      /**
       * Insert or update the specified object(s).
       */
      save: IDatasetSaveMethod<T>;

      /**
       *  Maps to datastore/dataset#save, forcing the method to be update.
       */
      update: IDatasetSaveMethod<T>;

      /**
       * Maps to datastore/dataset#save, forcing the method to be upsert.
       */
      upsert: IDatasetSaveMethod<T>;

      /** Create a query from the current dataset to query the specified kind,
       *  scoped to the namespace provided at the initialization of the dataset.
       */
      createQuery(namespace: string, kind: string): IQuery<T>;

      createQuery(kind: string): IQuery<T>;

      /**
       * Helper to create a Key object, scoped to the dataset's namespace by default.
       * You may also specify a configuration object to define a namespace and path.
       */
      key(path?: KeyPath): IKey;

      key(options: KeyOptions): IKey;

      int(value: any): any;

      /**
       * Run a function in the context of a new transaction.
       *
       * @param fn The function to run in the context of a transaction.
       * @param callback Function used to commit changes.
       */
      runInTransaction(fn: (transaction: ITransaction<T>, done: () => void) => void, callback: (err: any, apiResponse: any) => void): void;
    }

    export interface IDatasetSaveMethod<T> {
      (entity: IEntity<T> | IEntity<T>[], callback: (err: any, apiResponse: any) => void): void;

      (entity: IEntity<T> | IEntity<T>[]): Promise<void>;
    }

    export type ITransactionSaveMethod<T> = (entity: IEntity<T> | IEntity<T>[]) => void;

    export interface IStream<TData> extends NodeJS.ReadableStream {
      on(event: 'error', callback: (err: any) => void): this;

      on(event: 'data', callback: (data: TData) => void): this;

      on(event: 'end', callback: () => void): this;

      on(event: string, callback: Function): this;
    }

    export interface IDouble {
    }

    export interface IInt {
    }

    export interface IKey {
      /**  The ID of the entity. Never equal to zero. Values less than zero are discouraged and will not be supported in the future.
       used for numerical identified entities.   either .id or .key can be set, not both.   */
      id: number;
      /** The name of the entity. A name matching regex "__.*__" is reserved/read-only. A name must not be more than 500 characters. Cannot be "".
       used for named entities.   either .id or .key can be set, not both.
       */
      name: string;
      /** The entity path. An entity path consists of one or more elements composed of a kind and a string or numerical identifier, which identify entities. The first element identifies a root entity, the second element identifies a child of the root entity, the third element a child of the second entity, and so forth. The entities identified by all prefixes of the path are called the element's ancestors. An entity path is always fully complete: ALL of the entity's ancestors are required to be in the path along with the entity identifier itself. The only exception is that in some documented cases, the identifier in the last path element (for the entity) itself may be omitted. A path can never be empty. */
      path: string[];
      /** The kind of the entity. A kind matching regex "__.*__" is reserved/read-only. A kind must not contain more than 500 characters. Cannot be "". */
      kind: string;

      parent: IKey;
    }

    export interface IQuery<T = any> {
      autoPaginate(val: boolean): IQuery;

      end(cursorToken: string): IQuery;

      filter(property: keyof T, operator: string, value: any): IQuery;

      groupBy(properties: string[]): IQuery;

      hasAncestor(key: IKey): IQuery;

      limit(n: number): IQuery;

      offset(n: number): IQuery;

      order(property: keyof T): IQuery;

      select(fieldNames: keyof T | keyof T[]): IQuery;

      start(cursorToken: string): IQuery;
    }

    /** Build a Transaction object. Transactions will be created for you by datastore/dataset. When you need to run a transactional operation, use datastore/dataset#runInTransaction. */
    export interface ITransaction<T> extends IDatastore<T> {

      /** Maps to datastore/dataset#save, forcing the method to be insert. */
      insert: ITransactionSaveMethod<T>;

      /** Insert or update the specified object(s). If a key is incomplete, its associated object is inserted and the original Key object is updated to contain the generated ID.
       This method will determine the correct Datastore method to execute (upsert, insert, update, and insertAutoId) by using the key(s) provided. For example, if you provide an incomplete key (one without an ID), the request will create a new entity and have its ID automatically assigned. If you provide a complete key, the entity will be updated with the data specified.
       By default, all properties are indexed. To prevent a property from being included in all indexes, you must supply an entity's data property as an array.*/
      save: ITransactionSaveMethod<T>;

      /** Maps to datastore/dataset#save, forcing the method to be update.*/
      update: ITransactionSaveMethod<T>;
      /** Maps to datastore/dataset#save, forcing the method to be upsert.*/
      upsert: ITransactionSaveMethod<T>;

      /** Reverse a transaction remotely and finalize the current transaction instance. */
      rollback(callback: (err: any, apiResponse: any) => void): void;
    }
  }

  export = datastore;
}
