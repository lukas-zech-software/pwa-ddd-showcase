import { Container, inject, injectable } from 'inversify';
import { keys }                          from '../../container/inversify.keys';
import { Deal }                          from '../entities/Deal';
import { IDeal }                         from '../interfaces';
import { IFactory }                      from './IFactory';

@injectable()
export class DealFactory implements IFactory<IDeal, Deal> {
  @inject(keys.Container)
  private container: Container;

  public async create(): Promise<Deal> {
    return this.container.get<Deal>(Deal);
  }
}
