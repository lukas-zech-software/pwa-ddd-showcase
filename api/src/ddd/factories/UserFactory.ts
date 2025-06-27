import { Container, inject, injectable } from 'inversify';
import { keys }                          from '../../container/inversify.keys';
import { User }                          from '../entities/User';
import { IPublicUser, IUser }            from '../interfaces';
import { IFactory }                      from './IFactory';

@injectable()
export class UserFactory implements IFactory<IUser, User> {
  @inject(keys.Container)
  private container: Container;

  public async create(user: IPublicUser): Promise<User> {
    return this.container.get<User>(User).setData(user);
  }
}
