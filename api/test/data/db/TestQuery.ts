/* eslint-disable */
import {
  inject,
  injectable,
}                                  from 'inversify';
import { keys }                    from '../../../src/container/inversify.keys';
import { ICompanyFacade }          from '../../../src/datastore/ICompanyFacade';
import { IDealFacade }             from '../../../src/datastore/IDealFacade';
import { IUserFacade }             from '../../../src/datastore/IUserFacade';
import { CompanyFactory }          from '../../../src/ddd/factories/CompanyFactory';
import { DealFactory }             from '../../../src/ddd/factories/DealFactory';
import { IAuth0ManagementService } from '../../../src/infrastructure/external/Auth0ManagementService';
import { IGeoCodingService }       from '../../../src/infrastructure/geoLocation/GeoCodingService';

@injectable()
export class TestQuery {
  @inject(keys.ICompanyFactory) private companyFactory: CompanyFactory;
  @inject(keys.IDealFactory) private dealFactory: DealFactory;
  @inject(keys.ICompanyFacade) private companyFacade: ICompanyFacade;
  @inject(keys.IDealFacade) private dealFacade: IDealFacade;
  @inject(keys.IUserFacade) private userFacade: IUserFacade;
  @inject(keys.IAuth0ManagementService) private auth0ManagementService: IAuth0ManagementService;
  @inject(keys.IGeoCodingService) private geoCodingService: IGeoCodingService;

  public async runQuery(): Promise<void> {
    const allCompanies = await this.companyFacade.getAll();

   const onlyDonation = allCompanies.filter((x) => {
      return (
        x.acceptsDonations === true
        &&
        !x.offersDelivery
        &&
        !x.offersTakeAway
        &&
        !x.offersCoupons
      );
    }).length;
console.log('onlyDonation', onlyDonation);
   const onlyCoupons = allCompanies.filter((x) => {
      return (
        x.offersCoupons === true
        &&
        !x.offersDelivery
        &&
        !x.offersTakeAway
        &&
        !x.acceptsDonations
      );
    }).length;
console.log('onlyCoupons', onlyCoupons);

   const onlyCouponsOrDonation = allCompanies.filter((x) => {
      return (
        (x.offersCoupons === true
          ||
          x.acceptsDonations === true)
        &&
        !x.offersDelivery
        &&
        !x.offersTakeAway

      );
    }).length;
   console.log('onlyCouponsOrDonation', onlyCouponsOrDonation);
  }
}
