import { IApiUser }       from '@my-old-startup/common/interfaces/IApiUser';
import { USER_ROUTES }    from '@my-old-startup/common/routes/ApiRoutes';
import { requestService } from '../services/RequestService';

class LoginFacade {
  public async logIn(user: IApiUser): Promise<void> {
    return requestService.sendToApi<void, IApiUser>(USER_ROUTES.login, user);
  }

  public async getOwnUser(): Promise<IApiUser> {
    const user = await requestService.getFromApi<IApiUser>(USER_ROUTES.own);

    if (user === undefined) {
      throw new Error('Could not get user');
    }

    return user;
  }
}

export const loginFacade = new LoginFacade();
