import { inject, injectable }  from 'inversify';
import { keys }                from '../../container/inversify.keys';
import { IUserFacade }         from '../../datastore/IUserFacade';
import { IUser, IUserContact } from '../interfaces';
import { IUserAccountService } from './IUserAccountService';

@injectable()
export class UserAccountService implements IUserAccountService {

  @inject(keys.IUserFacade)
  private userFacade: IUserFacade;

  public async throwIfUserDoesNotExist(authId: string): Promise<void | never> {
    await this.userFacade.getByAuthId(authId);
  }

  public async updateContactData(authId: string, contactData: IUserContact): Promise<IUser> {
    const user = await this.userFacade.getByAuthId(authId);

    return this.userFacade.update(Object.assign(user, contactData));
  }
}
