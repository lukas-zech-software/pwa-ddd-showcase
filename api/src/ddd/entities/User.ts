import { injectable }              from 'inversify';
import { ErrorCode }               from '../../../../common/error/ErrorCode';
import { ApiError }                from '../../common/ApiError';
import { keys }                    from '../../container/inversify.keys';
import { IUserFacade }             from '../../datastore/IUserFacade';
import { IAuth0ManagementService } from '../../infrastructure/external/Auth0ManagementService';
import {
  IPublicUser,
  IUser,
  IUserContact,
}                                  from '../interfaces';
import { CompanyRepository }       from '../repository/CompanyRepository';
import { injectNotEnumerable }     from '../utils/objectUtils';

@injectable()
export class User implements IUser {
  public id: string;
  public created: number;
  public updated: number;
  public displayName: string;
  public email: string;
  public contactFirstName: string;
  public contactName: string;
  public contactPhone: string;
  public contactEmail: string;
  public authId: string;
  public lastLogin: number;

  @injectNotEnumerable(keys.IUserFacade) private userFacade: IUserFacade;
  @injectNotEnumerable(keys.IAuth0ManagementService) private auth0ManagementService: IAuth0ManagementService;
  @injectNotEnumerable(keys.ICompanyRepository) private companyRepository: CompanyRepository;

  private constructor() {
    this.created = Date.now();
    this.updated = Date.now();
  }

  /**
   * Create a new user on this instance
   *
   * @return {Promise<User>}
   */
  public async create(): Promise<User> {
    // Check if a user with this authId already exists
    const existingUser = await this.userFacade.tryFindByAuthId(this.authId);

    if (existingUser !== undefined) {
      throw new ApiError('User already present', ErrorCode.WEB_SERVER_INVALID_USER_INPUT);
    }

    await this.userFacade.create(this);

    return this;
  }

  public setData(user: IUserContact): User;
  public setData(user: IPublicUser): User;
  public setData(user: IUser): User {
    Object.assign(this, user);
    return this;
  }

  /**
   * Update the current state of the user
   * @return {Promise<void>}
   */
  public async update(): Promise<void> {
    await this.userFacade.update(this);
  }

  /**
   * resend Verification Email of the user
   * @return {Promise<void>}
   */
  public async resendVerificationEmail(): Promise<void> {
    await this.auth0ManagementService.resendVerificationEmail(this.authId);
  }

  /**
   * Update the current state of the user
   * @return {Promise<void>}
   */
  public async delete(): Promise<void> {
    // Get companies the user owns and remove them as an owner
    // If the user is the last owner of any company, delete those companies as well
    const companies = await this.companyRepository.findByOwner(this.authId);

    const ownerRemovePromises = companies.map((company) => company.removeOwner(this.authId, true));
    await Promise.all(ownerRemovePromises);

    await this.userFacade.remove(this.id);
    await this.auth0ManagementService.deleteUser(this.authId);
  }
}
