import { IApiContactForm } from '@my-old-startup/common/interfaces/IApiContactForm';
import { CONTACT_ROUTES }  from '@my-old-startup/common/routes/ApiRoutes';
import { requestService }  from '@my-old-startup/frontend-common/services/RequestService';

class ContactFacade {
  public async sendToSupport(formData: IApiContactForm): Promise<void> {
    return requestService.sendToApi<void, IApiContactForm>(CONTACT_ROUTES.sendSupportEmail, formData);
  }

  public async sendToFeedback(formData: IApiContactForm): Promise<void> {
    return requestService.sendToApi<void, IApiContactForm>(CONTACT_ROUTES.sendFeedbackEmail, formData);
  }
}

export const contactFacade = new ContactFacade();
