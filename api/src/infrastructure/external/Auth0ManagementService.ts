/* eslint-disable @typescript-eslint/camelcase */
import { ManagementClient } from 'auth0';
import { injectable }       from 'inversify';
import { AccessLevel }      from '../../enum/AccessLevel';

export type IAuth0ManagementService = {
  resendVerificationEmail(authId: string): Promise<void>;

  updateCompanyUser(authId: string): Promise<void>;

  deleteUser(authId: string): Promise<void>;
};

@injectable()
export class Auth0ManagementService implements IAuth0ManagementService {
  private client: ManagementClient;

  constructor() {
    this.client = new ManagementClient(
      {
        // FIXME: Regenerate ClientSecret and load from k8 secret
        clientId:     'some-id',
        clientSecret: 'some-secret-password',
        domain:       'my-old-startup.eu.auth0.com',
        scope:        'read:users update:users delete:users',
      },
    );
  }

  public async updateCompanyUser(authId: string): Promise<void> {
    await this.client.updateUser(
      { id: authId },
      {
        app_metadata:  {
          accessLevel: AccessLevel.COMPANY,
        },
      });
  }

  public async resendVerificationEmail(authId: string): Promise<void> {
    await this.client.sendEmailVerification(
      { user_id: authId },
    );
  }

  public deleteUser(authId: string): Promise<void> {
    return this.client.deleteUser({ id: authId });
  }
}
