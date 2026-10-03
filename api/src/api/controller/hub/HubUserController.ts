import { IApiCompany, IApiUser, IHubApiUser }                 from '@my-old-startup/common/interfaces';
import { IUrlAuthUserContext, IUrlUserContext }               from '@my-old-startup/common/interfaces/contracts';
import { HUB_USER_ROUTES }                                    from '@my-old-startup/common/routes/ApiRoutes';
import { ApiUser }                                            from '@my-old-startup/common/validation';
import { inject, injectable }                                 from 'inversify';
import { CompanyAdapter }                                     from '../../../adapter/CompanyAdapter';
import { UserAdapter }                                        from '../../../adapter/UserAdapter';
import { keys }                                               from '../../../container/inversify.keys';
import { UserFactory }                                        from '../../../ddd/factories/UserFactory';
import { CompanyRepository }                                  from '../../../ddd/repository/CompanyRepository';
import { UserRepository }                                     from '../../../ddd/repository/UserRepository';
import { AccessLevel }                                        from '../../../enum/AccessLevel';
import { IAuthInfo }                                          from '../../interfaces/ISessionData';
import { ControllerResult, Get, IWebRouteHandlerInput, Post } from '../../routing/webRouteDecorator';

@injectable()
export class HubUserController {
  @inject(keys.IUserRepository)
  private userRepository: UserRepository;

  @inject(keys.IUserFactory)
  private userFactory: UserFactory;

  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @Get(HUB_USER_ROUTES.getAll, AccessLevel.BACKOFFICE)
  public async getAll(): ControllerResult<IHubApiUser[]> {
    const users = await this.userRepository.getAll();

    return {
      body: users.map((user) => UserAdapter.entityToHubApi(user)),
    };
  }

  @Post(HUB_USER_ROUTES.update, AccessLevel.BACKOFFICE, { bodyModel: ApiUser })
  public async update(input: IWebRouteHandlerInput<IApiUser, IUrlUserContext>): ControllerResult<void> {
    const user = await this.userRepository.findById(input.url.userId);

    user.setData(UserAdapter.apiToEntity(input.body));

    await user.update();
  }

  @Post(HUB_USER_ROUTES.delete, AccessLevel.BACKOFFICE)
  public async delete(input: IWebRouteHandlerInput<void, IUrlUserContext>): ControllerResult<void> {
    const user = await this.userRepository.findById(input.url.userId);

    await user.delete();
  }

  @Get(HUB_USER_ROUTES.restaurants, AccessLevel.BACKOFFICE)
  public async getRestaurantsForOwner(input: IWebRouteHandlerInput<void, IUrlAuthUserContext>,
                                      authInfo: IAuthInfo): ControllerResult<IApiCompany[]> {
    const companies = await this.companyRepository.findByOwner(input.url.userAuthId);

    return {
      body: companies.map((c) => CompanyAdapter.entityToHubApi(c, authInfo.authUser.authId)),
    };
  }
}
