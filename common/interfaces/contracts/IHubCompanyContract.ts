import { IApiUser } from '../IApiUser';
import {
  ApiFacadeResponse,
  ApiRequest,
  ControllerResponse,
}                   from './index';

export type IUrlUserContext = {
  userId: string;
};

export type IUrlAuthUserContext = {
  userAuthId: string;
};

export type IUserContract = {
  getOwnUser(input: ApiRequest<void>, ...args: any[]): ApiFacadeResponse<IApiUser> | ControllerResponse<IApiUser>;
  logIn(
    input: ApiRequest<IApiUser, IUrlUserContext>,
    // eslint-disable-next-line @typescript-eslint/tslint/config
    ...params: any[]
  ): ApiFacadeResponse<void> | ControllerResponse<void>;
};
