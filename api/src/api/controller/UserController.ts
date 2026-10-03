import { IApiUser }         from '@my-old-startup/common/interfaces';
import {
  IUrlUserContext,
  IUserContract,
}                           from '@my-old-startup/common/interfaces/contracts';
import {
  inject,
  injectable,
}                           from 'inversify';
import { USER_ROUTES }      from '../../../../common/routes/ApiRoutes';
import { ApiUser }          from '../../../../common/validation';
import { UserAdapter }      from '../../adapter/UserAdapter';
import { keys }             from '../../container/inversify.keys';
import { UserFactory }      from '../../ddd/factories/UserFactory';
import { UserRepository }   from '../../ddd/repository/UserRepository';
import { AccessLevel }      from '../../enum/AccessLevel';
import { HttpResponseCode } from '../../enum/HttpResponseCode';
import { IAuthInfo }        from '../interfaces/ISessionData';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
}                           from '../routing/webRouteDecorator';

@injectable()
export class UserController implements IUserContract {
  @inject(keys.IUserRepository)
  private userRepository: UserRepository;

  @inject(keys.IUserFactory)
  private userFactory: UserFactory;

  @Get(USER_ROUTES.own, AccessLevel.USER)
  public async getOwnUser(input: IWebRouteHandlerInput<void>, authInfo: IAuthInfo): ControllerResult<IApiUser> {
    const user = await this.userRepository.findByAuthId(authInfo.authUser.authId);

    return {
      body: UserAdapter.entityToApi(user),
    };
  }

  @Post(USER_ROUTES.login, AccessLevel.USER, { bodyModel: ApiUser })
  public async logIn(input: IWebRouteHandlerInput<IApiUser, IUrlUserContext>,
                     authInfo: IAuthInfo): ControllerResult<void> {
    const user = await this.userRepository.tryFindByAuthId(authInfo.authUser.authId);

    if (user === undefined) {
      // If user could not be found, this is the first Auth0 call with this authID so we create a new user
      const newUser = await this.userFactory.create(UserAdapter.newToEntity(authInfo.authUser, input.body));
      await newUser.create();

      return {
        status: HttpResponseCode.CREATED,
      };
    }

    user.lastLogin = Date.now();
    user.update().catch((error) => {
      console.error('Error updating lastLogin', error);
    });

    return {
      status: HttpResponseCode.OK,
    };
  }

  @Post(USER_ROUTES.update, AccessLevel.USER, { bodyModel: ApiUser })
  public async update(input: IWebRouteHandlerInput<IApiUser, IUrlUserContext>,
                      authInfo: IAuthInfo): ControllerResult<void> {
    const user = await this.userRepository.findByAuthId(authInfo.authUser.authId);

    user.setData(UserAdapter.apiToEntity(input.body));

    await user.update();
  }

  @Post(USER_ROUTES.resendVerificationEmail, AccessLevel.USER)
  public async resendVerificationEmail(input: IWebRouteHandlerInput<void, IUrlUserContext>,
                                       authInfo: IAuthInfo): ControllerResult<void> {
    const user = await this.userRepository.findByAuthId(authInfo.authUser.authId);

    await user.resendVerificationEmail();
  }
}
