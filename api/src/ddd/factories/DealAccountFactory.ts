import { Container, inject, injectable } from 'inversify';
import { keys }                          from '../../container/inversify.keys';
import { DealAccount }                   from '../entities/DealAccount';
import { IDealAccount }                  from '../interfaces';
import { IFactory }                      from './IFactory';

@injectable()
export class DealAccountFactory implements IFactory<IDealAccount, DealAccount> {
  @inject(keys.Container)
  private container: Container;

  public async create(): Promise<DealAccount> {
    return this.container.get<DealAccount>(DealAccount);
  }
}
