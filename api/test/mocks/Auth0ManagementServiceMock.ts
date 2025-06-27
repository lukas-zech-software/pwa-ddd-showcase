/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable }              from 'inversify';
import { IAuth0ManagementService } from '../../src/infrastructure/external/Auth0ManagementService';

@injectable()
export class Auth0ManagementServiceMock implements IAuth0ManagementService {
  public async updateCompanyUser(authId: string): Promise<void> {

  }

  public async resendVerificationEmail(authId: string): Promise<void> {

  }

  public async deleteUser(authId: string): Promise<void> {
  }
}
