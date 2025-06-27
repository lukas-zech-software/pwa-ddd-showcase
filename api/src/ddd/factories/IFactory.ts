export type IFactory<TData, TEntity extends TData> = {
  create(entity: TData): Promise<TEntity>;
};
