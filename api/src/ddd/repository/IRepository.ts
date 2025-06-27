export type IRepository<TEntity> = {
  findById(id: string): Promise<TEntity>;
};
