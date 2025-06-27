import { Container, inject, injectable } from 'inversify';
import { ErrorCode }                     from '../../../../common/error/ErrorCode';
import { ApiError }                      from '../../common/ApiError';
import { keys }                          from '../../container/inversify.keys';
import { IUserFacade }                   from '../../datastore/IUserFacade';
import { User }                          from '../entities/User';
import { IRepository }                   from './IRepository';

@injectable()
export class UserRepository implements IRepository<User> {
  @inject(keys.Container)
  private container: Container;

  @inject(keys.IUserFacade)
  private userFacade: IUserFacade;

  public async getAll(): Promise<User[]> {
    const users = await this.userFacade.getAll();

    return users.map((user) => this.container.get<User>(User).setData(user));
  }

  public async findByAuthId(authId: string): Promise<User> {
    const user = await this.userFacade.getByAuthId(authId);

    return this.container.get<User>(User).setData(user);
  }

  public async tryFindByAuthId(authId: string): Promise<User | undefined> {
    const user = await this.userFacade.tryFindByAuthId(authId);

    if (user === undefined) {
      return undefined;
    }

    return this.container.get<User>(User).setData(user);
  }

  public async findById(id: string): Promise<User> {
    const user = await this.userFacade.get(id);

    if (user === undefined) {
      throw new ApiError('User not found', ErrorCode.WEB_SERVER_INVALID_USER_INPUT);
    }

    return this.container.get<User>(User).setData(user);
  }
}
