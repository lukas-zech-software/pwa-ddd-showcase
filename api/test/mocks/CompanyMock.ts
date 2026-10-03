/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompanyType } from '@my-old-startup/common/enums';
import {
  Dish,
  OpeningHoursWeek,
}                      from '@my-old-startup/common/interfaces';
import { Deal }        from '../../src/ddd/entities/Deal';
import {
  ICompany,
  ICompanyContact,
  ICompanyDetails,
  ICompanyInstance,
  ICompanyOptionalInfo,
  IDeal,
  IDealInstance,
}                      from '../../src/ddd/interfaces';
import { AutoSpy }     from '../utils/autoSpy';

@AutoSpy()
export class CompanyMock implements ICompanyInstance {
  public address: string;
  public background: string;
  public city: string;
  public created: number;
  public description: string;
  public email: string;
  public facebook: string;
  public geoHash: string;
  public hasAcceptedTerms: boolean;
  public hasSubscribedToNewsletter: boolean;
  public id: string;
  public instagram: string;
  public isApproved: boolean;
  public isBlocked: boolean;
  public isFirstLogin: boolean;
  public lat: number;
  public lng: number;
  public logo: string;
  public openingHours: OpeningHoursWeek;
  public prefersReservations: true;
  public owners: string[];
  public dishes: Dish[] | undefined;
  public telephone: string;
  public secondaryTelephone: string;
  public secondaryTelephoneReason: string;
  public title: string;
  public twitter: string;
  public type: CompanyType;
  public updated: number;
  public website: string;
  public menuDocument: string;
  public zipCode: string;

  //CORONA
  offersDelivery: boolean;
  deliveryDescription?: string | undefined;
  offersReopen: boolean;
  reopenDescription?: string | undefined;
  offersTakeAway: boolean;
  takeAwayDescription?: string | undefined;
  offersCoupons: boolean;
  couponsDescription?: string | undefined;
  acceptsDonations: boolean;
  donationsDescription?: string | undefined;
  //CORONA

  public async addDeal(input: Partial<IDeal>): Promise<Deal> {
    throw new Error('Company.addDeal()');
  }

  public addOwner(userAuthId: string): void {
  }

  public async approve(): Promise<void> {
  }

  public async block(): Promise<void> {
  }

  public async create(): Promise<void> {
  }

  public async delete(): Promise<void> {
  }

  public async getDeal(): Promise<IDealInstance> {
    throw new Error('Company.getDeal()');
  }

  public getDeals(): Promise<IDealInstance[]> {
    throw new Error('Company.getDeals()');
  }

  public async register(): Promise<void> {
  }

  public async removeDeal(): Promise<void> {
  }

  public removeOwner(): void {
  }

  public setData(company: ICompanyDetails): ICompanyInstance;
  public setData(company: ICompanyContact): ICompanyInstance;
  public setData(
    company: Pick<ICompanyContact, 'telephone' | 'email' | 'website'>,
  ): ICompanyInstance;
  public setData(company: ICompany): ICompanyInstance;
  public setData(
    company:
      | ICompanyDetails
      | ICompanyContact
      | ICompanyOptionalInfo
      | ICompany,
  ): ICompanyInstance {
    throw new Error('Company.setData()');
  }

  public async unblock(): Promise<void> {
  }

  public async update(): Promise<void> {
  }

  public async updateBackground(path: string): Promise<void> {
  }

  public updateDishes(): void {
  }

  public async updateGeoHash(): Promise<void> {
  }

  public async updateLogo(path: string): Promise<void> {
  }

  public getCouponCode(): string {
    return this.id.substring(0, 5).toUpperCase();
  }
}
