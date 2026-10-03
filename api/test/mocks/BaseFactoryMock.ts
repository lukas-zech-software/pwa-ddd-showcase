import { injectable } from 'inversify';
import { IFactory }   from '../../src/ddd/factories/IFactory';
import { AutoSpy }    from '../utils/autoSpy';

@AutoSpy()
@injectable()
export class FactoryMock<TData, TEntity extends TData>
implements IFactory<TData, TEntity> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async create(entity: TData): Promise<TEntity> {
    throw new Error('FactoryMock.create');
  }
}
