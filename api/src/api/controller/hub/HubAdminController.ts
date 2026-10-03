import { ANALYTICS_ENABLED_KEY }                        from '@my-old-startup/common/enums';
import { DEACTIVATE_GOOGLE_ANALYTICS }                  from '@my-old-startup/common/routes/ApiRoutes';
import { Request, Response }                            from 'express';
import { injectable }                                   from 'inversify';
import { AccessLevel }                                  from '../../../enum/AccessLevel';
import { IAuthInfo }                                    from '../../interfaces/ISessionData';
import { ControllerResult, Get, IWebRouteHandlerInput } from '../../routing/webRouteDecorator';

@injectable()
export class HubAdminController {
  @Get<string>(DEACTIVATE_GOOGLE_ANALYTICS, AccessLevel.BACKOFFICE)
  public async deactivateGoogleAnalytics(
    input: IWebRouteHandlerInput,
    authInfo: IAuthInfo,
    request: Request,
    response: Response,
  ): ControllerResult<string> {

    const options = {
      maxAge: Date.now() + (10 * 365 * 24 * 60 * 60),
      domain: 'my-old-startups-domain.de',
    };

    response.cookie(ANALYTICS_ENABLED_KEY, 'false', options);

    return {
      status: 200,
      body:   'Google Analytics disable cookie set',
    };
  }

}
