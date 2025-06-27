import { injectable }  from 'inversify';
import {
  TokenExpiredError,
  verify,
}                      from 'jsonwebtoken';
import { ErrorCode }   from '../../../../common/error/ErrorCode';
import { ApiError }    from '../../common/ApiError';
import { AccessLevel } from '../../enum/AccessLevel';

const jwksClient = require('jwks-rsa');

const client = jwksClient({
                            cache:                 true,
                            rateLimit:             true,
                            jwksRequestsPerMinute: 10, // Default values
                            jwksUri:               'https://my-old-startup.eu.auth0.com/.well-known/jwks.json',
                          });

// TODO: Load secret from env vars or PEM file

export type IIdToken = {
  'http://my-old-startup.de/accessLevel': AccessLevel;
  'http://my-old-startups-domain.de/accessLevel': AccessLevel;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  nonce: string;
  sub: string;
  updated_at: string;
};

export type IJwtTokenService = {
  /**
   * Generate a JW token valid from now on
   */

  /*
   generateCustom(id: string, purpose: TokenPurpose, data?: any): Promise<string>;
   */

  /**
   * Verify the provided JW token
   */
  verify(token: string): Promise<IIdToken>;
};

// TODO: Get from env var
const kid     = 'QjNGRUIzN0FCMkJBMUM1OUIzQzU5NkIwNjgwQjM3MDA0MUEwQzEyNg';
const options = {
  audience:   'https://api.my-old-startups-domain.de',
  issuer:     'https://my-old-startup.eu.auth0.com/',
  algorithms: ['RS256'],
};

if (process.env.IS_STAGING === 'true') {
  options.audience = 'https://api.my-old-startup-staging.de';
}

@injectable()
export class JwtTokenService implements IJwtTokenService {
  public verify(token: string): Promise<IIdToken> {
    return new Promise((resolve, reject) => {
      if (token === undefined) {
        reject(new ApiError('No token provided', ErrorCode.WEB_SERVER_INVALID_SECURE_TOKEN));
        return;
      }

      this.getSecret().then((secret) => {
        verify(token, secret, options,
               (error: Error, payload: IIdToken) => {
                 if (error) {
                   if (error instanceof TokenExpiredError) {
                     console.debug(`Expired token`, error);
                     reject(new ApiError('Token expired', ErrorCode.WEB_SERVER_EXPIRED_SECURE_TOKEN));
                     return;
                   }

                   console.debug(`Invalid token`, error);
                   reject(new ApiError('Token not valid', ErrorCode.WEB_SERVER_INVALID_SECURE_TOKEN));
                   return;
                 }
                 resolve(payload);
               });
      }).catch(reject);
    });
  }

  /*

   public generateCustom(id: string, purpose: TokenPurpose, data: any): Promise<string> {
   return new Promise((resolve, reject) => {
   const payload: IIdToken = { id, purpose, data };

   this.getSecret().then((secret) => {
   sign(payload, secret, { expiresIn: '2 day' }, (error: Error, token: string) => {
   if (error) {
   reject(error);
   }

   resolve(token);
   });
   }).catch(reject);
   });
   }*/

  private getSecret(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      client.getSigningKey(kid, (error1: any, key: any) => {
        if (error1) {
          return reject(error1);
        }

        const signingKey: string = key.publicKey || key.rsaPublicKey;

        resolve(signingKey);
      });
    });
  }
}
