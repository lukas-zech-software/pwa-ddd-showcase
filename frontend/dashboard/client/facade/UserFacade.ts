import { IApiUser }       from '@my-old-startup/common/interfaces/IApiUser';
import { USER_ROUTES }    from '@my-old-startup/common/routes/ApiRoutes';
import { requestService } from '@my-old-startup/frontend-common/services/RequestService';

class UserFacade {

  public async update(user: IApiUser): Promise<void> {
    return requestService.sendToApi<void, IApiUser>(USER_ROUTES.update, user);
  }

  public async resendVerificationEmail(): Promise<void> {
    return requestService.sendToApi<void>(USER_ROUTES.resendVerificationEmail);
  }
}

export const userFacade = new UserFacade();
