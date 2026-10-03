import { CollectionReference } from '@google-cloud/firestore';
import {
  inject,
  injectable,
}                              from 'inversify';
import { ErrorCode }           from '../../../common/error/ErrorCode';
import { ICacheService }       from '../cache/ICacheService';
import { ApiError }            from '../common/ApiError';
import { keys }                from '../container/inversify.keys';
import { IUser }               from '../ddd/interfaces';
import { BaseFacade }          from './BaseFacade';
import { IUserFacade }         from './IUserFacade';

@injectable()
export class UserFacade extends BaseFacade<IUser> implements IUserFacade {
  constructor(
    @inject(keys.IsProduction) isProduction: boolean,
    @inject(keys.GoogleCloudProjectId) googleCloudProjectId: string,
    @inject(keys.ICacheService) cacheService: ICacheService<IUser>,
  ) {
    super(isProduction, googleCloudProjectId, cacheService);
  }

  public async create(data: IUser): Promise<IUser> {
    // authId must always be lowercase
    data.authId = data.authId.toLocaleLowerCase();

    return super.create(data);
  }

  public async getByAuthId(authId: string): Promise<IUser> {
    const user = await this.tryFindByAuthId(authId);

    if (user === undefined) {
      throw new ApiError(
        'User not registered',
        ErrorCode.WEB_SERVER_NO_DATA_FOUND,
      );
    }

    // TODO: remove these once legacy users without contact detils are migrated
    if (user.contactFirstName === undefined) {
      user.contactFirstName = '';
    }
    if (user.contactName === undefined) {
      user.contactName = '';
    }
    if (user.contactPhone === undefined) {
      user.contactPhone = '';
    }
    if (user.contactEmail === undefined) {
      user.contactEmail = '';
    }

    return user;
  }

  public async tryFindByAuthId(authId: string): Promise<IUser | undefined> {
    const lowerCaseAuthId = authId.toLocaleLowerCase();

    const results = await this.runCachedQuery([
      { key:      'authId',
        operator: '==',
        value:    lowerCaseAuthId,
      },
    ]);

    return results[0];
  }

  public getCachePrefix(): string {
    return `users_`;
  }

  protected getCollection(): CollectionReference {
    return this.db.collection('users');
  }
}
