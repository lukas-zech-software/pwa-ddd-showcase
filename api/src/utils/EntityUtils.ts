import { ErrorCode }                 from '../../../common/error/ErrorCode';
import { IAuthInfo }                 from '../api/interfaces/ISessionData';
import { ApiError }                  from '../common/ApiError';
import { IBaseDataObject, ICompany } from '../ddd/interfaces';

/**
 * Throw an error if the logged in user tries to edit or create an company that does not belong
 * to on  of the companyIds he belongs to
 *
 * An hub may do so anyway
 */
export function throwIfCurrentUserDoesNotBelongToCompany(session: IAuthInfo,
                                                         company: ICompany): void {

  const companyBelongToUser = company.owners.some((ownerAuthId) => ownerAuthId === session.authUser.authId);

  if (!companyBelongToUser) {
    // eslint-disable-next-line no-console
    console.log(`User ${session.authUser.authId} is not allowed to edit/create company ${company.id}`);
    throw new ApiError('Insufficient permissions', ErrorCode.WEB_SERVER_INSUFFICIENT_PERMISSIONS);
  }
}

export function throwIfEntityUndefined(entity: IBaseDataObject): void {
  if (entity === undefined) {
    throw new ApiError('Entity not found', ErrorCode.WEB_SERVER_INVALID_REQUEST_DATA);
  }
}
