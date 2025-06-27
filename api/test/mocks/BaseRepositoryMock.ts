import { injectable }  from 'inversify';
import { IRepository } from '../../src/ddd/repository/IRepository';
import { AutoSpy }     from '../utils/autoSpy';

@AutoSpy()
@injectable()
export abstract class BaseRepositoryMock<TEntity> implements IRepository<TEntity> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findById(id: string): Promise<TEntity> {
    return this.mockData[0];
  }

  public abstract mockData: TEntity[];
}
