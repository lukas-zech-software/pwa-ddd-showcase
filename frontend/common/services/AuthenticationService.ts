import * as auth0          from 'auth0-js';
import {
  Auth0DecodedHash,
  Auth0UserProfile,
  AuthOptions,
}                          from 'auth0-js';
import { loginFacade }     from '../facades/LoginFacade';
import { DashboardRoutes } from '../routes';
import { logService }      from './LogService';
import { storageService }  from './StorageService';
import { windowService }   from './WindowService';

const storageKey         = 'auth';
const sessionTimeOut     = 7200; // 2 hours
let options: AuthOptions = {
  domain:       'my-old-startup.eu.auth0.com',
  clientID:     'Ozro7hi7E9WZ9ocChvqgCBDlaYvBEOd7', // my-old-startups-domain.de id
  responseType: 'token id_token',
  audience:     'https://api.my-old-startups-domain.de',
  scope:        'openid email profile',
};

if (process.env.IS_STAGING === 'true') {
  options = {
    domain:       'my-old-startup.eu.auth0.com',
    clientID:     'LjAR1aHHa2aBaGMISzs9TGSq6bzjVFQp', // my-old-startup-dev id
    responseType: 'token id_token',
    audience:     'https://api.my-old-startups-domain.de',
    scope:        'openid email profile',
  };
}
function deleteAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie      = cookies[i];
    var eqPos       = cookie.indexOf('=');
    var name        = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

type Session = {
  accessToken: string;
  idToken: string;
  expiresAt: number;
  userProfile: UserProfile;
};

type UserProfile = Auth0UserProfile & {
  // legacy audience
  'http://my-old-startup.de/accessLevel': string;
  'http://my-old-startups-domain.de/accessLevel': string;
};

export class AuthenticationService {
  private auth0: auth0.WebAuth;
  private tokenRenewalTimeout: number | undefined = undefined;

  constructor() {

    this.auth0 = new auth0.WebAuth(
      {
        ...options,
        redirectUri: windowService.location.origin + '/auth_callback?cb=' + Date.now(),
      },
    );

    if (this.isAuthenticated() === true) {
      if (this.tokenRenewalTimeout === undefined) {
        this.scheduleRenewal();
      }
    }
  }

  public getAuthToken(): string | null {
    const session = this.getSession();

    if (session === undefined) {
      return null;
    }

    return session.accessToken;
  }

  public isLoggedInAdmin(): boolean {
    const user = this.getAuthUserProfile();
    if (user === null) {
      return false;
    }

    return (
      user['http://my-old-startup.de/accessLevel'] === 'BACKOFFICE'
      ||
      user['http://my-old-startups-domain.de/accessLevel'] === 'BACKOFFICE'
    );
  }

  public isLoggedInCompany(): boolean {
    const user = this.getAuthUserProfile();
    if (user === null) {
      return false;
    }

    return (
      user['http://my-old-startup.de/accessLevel'] === 'COMPANY'
      ||
      user['http://my-old-startups-domain.de/accessLevel'] === 'COMPANY'
    );
  }

  public getAuthUserProfile(): UserProfile | null {
    const session = this.getSession();

    if (session === undefined) {
      return null;
    }

    return session.userProfile;
  }

  public isAuthenticated(): boolean {
    const session = this.getSession();

    if (session === undefined) {
      return false;
    }

    // Check whether the current time is past the
    // Access Token's expiry time
    const isExpired = new Date().getTime() > (session.expiresAt || 0);

    if (isExpired === true) {
      this.clearSession();
    }

    return isExpired === false;
  }

  public async handleAuthCallback(): Promise<void> {
    try {
      const authResult = await this.parseHash();

      if (authResult === null) {
        throw new Error('No authResult found');
      }

      const idToken     = authResult.idToken;
      const accessToken = authResult.accessToken;

      if (accessToken === undefined) {
        throw new Error('No access token');
      }

      if (idToken === undefined) {
        throw new Error('No id token');
      }

      const userProfile: Auth0UserProfile = authResult.idTokenPayload;

      this.setSession(accessToken, idToken, userProfile, authResult.expiresIn || sessionTimeOut);

      await loginFacade.logIn(
        {
          userName:     userProfile.nickname || userProfile.email || '',
          emailAddress: userProfile.email || '',
          // This is hacky, but contact info is validated by the login endpoint so we need valid values here
          contact:      {
            firstName: 'first',
            lastName:  'last',
            telephone: '12345',
            email:     'unknown@example.com',
          },
        },
      );

    } catch (error) {
      logService.error('Error while handle authentication',  error, error.statusCode);
      throw error;
    }
  }

  public logOut(reload = true): void {
    clearTimeout(this.tokenRenewalTimeout);
    this.clearSession();
    if (reload) {
      window.location.reload();
    }
  }

  /**
   * Logout and also clear the AUTH0 session so the user must provide credentials again
   */
  public logOutHard(): void {
    clearTimeout(this.tokenRenewalTimeout);
    deleteAllCookies();

    this.clearSession();
    this.auth0.logout({ returnTo: windowService.location.origin });
  }

  public renewToken(): Promise<void> {
    return new Promise<void>((resolve, reject): void => {
      this.auth0.checkSession(options, (err, authResult) => {
        if (err) {
          reject('Error while renewing token: ' + JSON.stringify(err));
          return false;
        }

        const idToken     = authResult.idToken;
        const accessToken = authResult.accessToken;

        if (accessToken === undefined) {
          reject('No access token on renewal');
          return false;
        }

        if (idToken === undefined) {
          reject('No id token on renewal');
          return false;
        }

        const userProfile: Auth0UserProfile = authResult.idTokenPayload;

        this.setSession(accessToken, idToken, userProfile, authResult.expiresIn || sessionTimeOut);

        resolve();
      });
    });
  }

  public authorize(): void {
    this.auth0.authorize();
  }

  public signUp(): void {
    this.auth0.authorize({ mode: 'signUp' });
  }

  private parseHash(): Promise<Auth0DecodedHash> {
    return new Promise<Auth0DecodedHash>((resolve, reject): void => {
      this.auth0.parseHash((err, authResult) => {
        window.location.hash = '';

        if (err) {
          // eslint-disable-next-line no-console
          console.error('Error on Auth0 hash', err);
          this.logOut();
          // Happens when people press back button and try to login with the same hash again
          // send to to the login page
          window.location.href = DashboardRoutes.Login;
          reject(err);
          return;
        }

        if (authResult === null) {
          // eslint-disable-next-line no-console
          console.error('No valid authResult received', err);
          reject(err);
          return;
        }

        resolve(authResult);
      });
    });
  }

  private scheduleRenewal(): void {
    const session = this.getSession();

    if (session === undefined) {
      return;
    }

    const expiresAt = session.expiresAt || 0;
    const delay     = expiresAt - Date.now() - (1000 * 60);

    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(
        () => {
          this.renewToken().catch((e) => {
            console.error(e)
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delay) as any;
    }
  }

  private setSession(accessToken: string, idToken: string, userProfile: Auth0UserProfile, expiresIn: number): void {
    // Set the time that the Access Token will expire at
    const expiresAt = (expiresIn * 1000) + new Date().getTime();
    storageService.set(storageKey, JSON.stringify({
                                                    accessToken,
                                                    idToken,
                                                    expiresAt,
                                                    userProfile,
                                                  }));

    this.scheduleRenewal();
  }

  private getSession(): Session | undefined {
    const item = storageService.get(storageKey);
    if (item !== null) {
      return JSON.parse(item);
    }

    return undefined;
  }

  private clearSession(): void {
    // Clear Access Token and ID Token from local storage
    storageService.remove(storageKey);
  }
}

export const authenticationService = new AuthenticationService();
