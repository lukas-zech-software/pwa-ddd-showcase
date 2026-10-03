import {
  IApiUser,
  IApiUserContact,
  IHubApiUser,
} from '@my-old-startup/common/interfaces';
import {
  I0AuthUser,
  IPublicUser,
  IUser,
  IUserContact,
} from '../ddd/interfaces';

export class UserAdapter {
  public static entityToApi(user: IPublicUser): IApiUser {
    return {
      userName:     user.displayName,
      emailAddress: user.email,
      contact:      {
        firstName: user.contactFirstName,
        lastName:  user.contactName,
        telephone: user.contactPhone,
        email:     user.contactEmail,
      },
    };
  }

  public static entityToHubApi(user: IUser): IHubApiUser {
    const contact: IApiUserContact = {
      firstName: user.contactFirstName,
      lastName:  user.contactName,
      telephone: user.contactPhone,
      email:     user.contactEmail,
    };

    return {
      // id will be assigned by store
      id:           user.id,
      authId:       user.authId,
      updated:      user.updated,
      created:      user.created,
      userName:     user.displayName,
      emailAddress: user.email,
      lastLogin:    user.lastLogin,

      contact,
    };
  }

  public static apiToEntity(user: IApiUser): IPublicUser & IUserContact {
    const contact = user.contact;

    return {
      email:       user.emailAddress,
      displayName: user.userName,

      contactFirstName: contact.firstName,
      contactName:      contact.lastName,
      contactPhone:     contact.telephone,
      contactEmail:     contact.email,
    };
  }

  public static apiContactToEntity(contact: IApiUserContact): IUserContact {
    return {
      contactFirstName: contact.firstName,
      contactName:      contact.lastName,
      contactPhone:     contact.telephone,
      contactEmail:     contact.email,
    };
  }

  public static newToEntity(authUser: I0AuthUser, apiUser: IApiUser): IUser {
    const contact = apiUser.contact;

    return {
      authId:      authUser.authId,
      displayName: apiUser.userName,
      email:       apiUser.emailAddress,

      lastLogin: Date.now(),

      contactFirstName: contact.firstName,
      contactName:      contact.lastName,
      contactPhone:     contact.telephone,
      contactEmail:     contact.email,

      // id will be assigned by store
      id:      undefined as any,
      // assigned by `Deal.constructor` and `Deal.setData`
      updated: undefined as any,
      created: undefined as any,
    };
  }
}
