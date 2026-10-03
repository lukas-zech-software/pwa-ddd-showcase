import { injectable }     from 'inversify';
import { IUserFacade }    from '../../src/datastore/IUserFacade';
import { IUser }          from '../../src/ddd/interfaces';
import { BaseFacadeMock } from './BaseFacadeMock';

@injectable()
export class UserFacadeMock extends BaseFacadeMock<IUser> implements IUserFacade {
  public mockData: IUser[] = [
    {
      id:               'id',
      created:          0,
      updated:          0,
      lastLogin:          0,
      authId:           'authId',
      email:            'email',
      displayName:      'displayName',
      contactFirstName: '',
      contactName:      '',
      contactPhone:     '',
      contactEmail:     '',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getByAuthId(authId: string): Promise<IUser> {
    return this.mockData[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async tryFindByAuthId(authId: string): Promise<IUser | undefined> {
    return this.mockData[0];
  }

}
