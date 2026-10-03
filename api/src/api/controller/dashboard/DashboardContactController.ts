/* eslint-disable @typescript-eslint/no-unused-vars */
import { IApiContactForm }                               from '@my-old-startup/common/interfaces';
import { CONTACT_ROUTES }                                from '@my-old-startup/common/routes/ApiRoutes';
import { inject, injectable }                            from 'inversify';
import { keys }                                          from '../../../container/inversify.keys';
import { MailFactory }                                   from '../../../ddd/factories/MailFactory';
import { AccessLevel }                                   from '../../../enum/AccessLevel';
import { IAuthInfo }                                     from '../../interfaces/ISessionData';
import { ControllerResult, IWebRouteHandlerInput, Post } from '../../routing/webRouteDecorator';

@injectable()
export class DashboardContactController {

  @inject(keys.IMailFactory)
  private mailFactory: MailFactory;

  @Post(CONTACT_ROUTES.sendSupportEmail, AccessLevel.COMPANY)
  public async sendToSupport(input: IWebRouteHandlerInput<IApiContactForm, void>,
                             authInfo: IAuthInfo): ControllerResult<void> {

    const { contactEmail, subject, body } = input.body;

    const supportEmail = await this.mailFactory.create({
      template: 'contact/support',
      from:     contactEmail,
      to:       'support@my-old-startups-domain.de',
      data:     { subject, body },
    });

    await supportEmail.send();
  }

  @Post(CONTACT_ROUTES.sendFeedbackEmail, AccessLevel.COMPANY)
  public async sendToFeedback(input: IWebRouteHandlerInput<IApiContactForm, void>,
                              authInfo: IAuthInfo): ControllerResult<void> {

    const { contactEmail, subject, body } = input.body;

    const feedbackEmail = await this.mailFactory.create({
      template: 'contact/feedback',
      from:     contactEmail,
      to:       'feedback@my-old-startups-domain.de',
      data:     { subject, body },
    });

    await feedbackEmail.send();
  }
}
