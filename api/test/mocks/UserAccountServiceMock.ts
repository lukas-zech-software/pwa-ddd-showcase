import { injectable }          from 'inversify';
import { IUser, IUserContact } from '../../src/ddd/interfaces';
import { IUserAccountService } from '../../src/ddd/services/IUserAccountService';

@injectable()
export class UserAccountServiceMock implements IUserAccountService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async throwIfUserDoesNotExist(authId: string): Promise<void | never> {
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async updateContactData(authId: string, contactData: IUserContact): Promise<IUser> {
    return {
      id:               'id',
      authId:           'authId',
      displayName:      'test',
      email:            'test@example.com',
      contactFirstName: 'test',
      contactName:      'McTesterson',
      contactPhone:     '12345',
      contactEmail:     'test@example.com',
      created:          0,
      updated:          0,
      lastLogin:          0,
    };
  }
}
