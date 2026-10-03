import {
  inject,
  injectable,
}                           from 'inversify';
import { ErrorCode }        from '../../../../common/error/ErrorCode';
import { ApiError }         from '../../common/ApiError';
import { keys }             from '../../container/inversify.keys';
import { I0AuthUser }       from '../../ddd/interfaces';
import { AccessLevel }      from '../../enum/AccessLevel';
import { IJwtTokenService } from './JwtTokenService';

export type IAuthenticationService = {
  /**
   * Validates the authentifaction token and returns the user id from it
   *
   * @param {string | undefined} tokenHeader
   * @return {Promise<User | undefined>}
   */
  getAuthenticatedUserId(tokenHeader: string | undefined): Promise<I0AuthUser>;
};

@injectable()
export class AuthenticationService implements IAuthenticationService {
  @inject(keys.IJwtTokenService)
  private jwtTokenService: IJwtTokenService;

  public async getAuthenticatedUserId(tokenHeader: string | undefined): Promise<I0AuthUser> {
    if (tokenHeader === undefined) {
      throw new ApiError('No token provided', ErrorCode.WEB_SERVER_INVALID_SECURE_TOKEN);
    }

    const parts = tokenHeader.split(' ');

    if (parts[0] !== 'Bearer') {
      throw new ApiError('Only Bearer tokens accepted', ErrorCode.WEB_SERVER_INVALID_SECURE_TOKEN);
    }

    const token = await this.jwtTokenService.verify(parts[1]);

    return {
      // old users still have the old audience in their data
      accessLevel: token['http://my-old-startups-domain.de/accessLevel'] || token['http://my-old-startup.de/accessLevel'] || AccessLevel.USER,
      authId:      token.sub,
    };
  }
}
