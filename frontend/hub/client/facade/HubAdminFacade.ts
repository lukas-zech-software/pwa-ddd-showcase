import { DEACTIVATE_GOOGLE_ANALYTICS } from '@my-old-startup/common/routes/ApiRoutes';
import { globalMessageService }        from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { requestService }              from '@my-old-startup/frontend-common/services/RequestService';

class HubAdminFacade {
  public async deactivateGoogleAnalytics(): Promise<void> {
    try {
      await requestService.getFromApi<void>(DEACTIVATE_GOOGLE_ANALYTICS);
      globalMessageService.pushMessage({
        message: 'Google Analytics disable cookie set',
        variant: 'success',
      });
    } catch (error) {
      globalMessageService.pushMessage({
        message: error,
        variant: 'error',
      });
    }
  }
}

export const hubAdminFacade = new HubAdminFacade();
