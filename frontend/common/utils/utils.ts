import { IApiCompany } from '@my-old-startup/common/interfaces/IApiCompany';
import { CompanyType } from '../../../common/enums';

export function isMissingDetails(company: IApiCompany): boolean {
  return company.details.description === undefined ||
    (company.details.openingHours === undefined && company.contact.type !== CompanyType.FOODTRUCK);
}
