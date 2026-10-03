import {
  CompanyType,
  DealTags,
}                          from '@my-old-startup/common/enums';
import {
  Dish,
  OpeningHoursWeek,
  OpenRestrictions,
} from '@my-old-startup/common/interfaces';
import { IBaseDataObject } from './IBaseDataObject';
import {
  IDeal,
  IDealInstance,
}                          from './IDeal';
import { IUserContact }    from './IUser';

/**
 * Contact data of an company
 */
export type ICompanyContact = {
  /**
   * The title of the company
   * Limited in length to properly display it
   */
  title: string;
  /**
   * The address where the company resides, street + number
   */
  address: string;

  /**
   * The zip code where the company resides
   */
  zipCode: string;

  /**
   * The telephone number of the company
   */
  telephone: string | undefined;

  /**
   * A secondary telephone number for a specific reason
   */
  secondaryTelephone: string | undefined;

  /**
   * The reason for the secondary phone number
   */
  secondaryTelephoneReason: string | undefined;

  /**
   * The email of the company
   */
  email: string | undefined;

  /**
   * Has the user accepted terms and privacy agreements
   */
  hasAcceptedTerms: boolean;

  /**
   * The type of the company
   */
  type: CompanyType;

  /**
   * The website of the company
   */
  website: string | undefined;
};

/**
 * Data for a company as used to send on public api
 */
export type ICompanyDetails = {
  /**
   * The description of the company
   */
  description: string | undefined;

  /**
   * Opening hours of the company
   */
  openingHours: OpeningHoursWeek | undefined;

  /**
   * Whether the company prefers reservations for their deals by default
   */
  prefersReservations: boolean;

  /**
   * Link to reservation service
   */
  reservationsLink?: string | undefined;

  /**
   * General tags about what the company offers
   */
  tags?: DealTags[];

  /**
   * Link to facebook profile
   */
  facebook?: string;

  /**
   * Link to instagram profile
   */
  instagram?: string;

  /**
   * Link to twitter profile
   */
  twitter?: string;
};

export type ICompanyImages = {
  /**
   * Background image
   */
  background?: string | undefined;

  /**
   * Logo of the company
   */
  logo?: string | undefined;

  /**
   * The url to the menu document
   */
  menuDocument?: string | undefined;
};

export type ICompanyDishes = {
  /**
   * Background image
   */
  dishes?: Dish[] | undefined;

};

export type ICompanyCorona = {
  offersReopen: boolean;
  reopenDescription?: string | undefined;

  openRestrictions?:OpenRestrictions;

  offersDelivery: boolean;
  deliveryDescription?: string | undefined;

  offersTakeAway: boolean;
  takeAwayDescription?: string | undefined;

  offersCoupons: boolean;
  couponsDescription?: string | undefined;
  couponsLink?: string | undefined;

  acceptsDonations: boolean;
  donationsDescription?: string | undefined;
  donationsLink?: string | undefined;
};

/**
 * Data for a company as send on public API
 * This data can never be updated directly via API
 */
export type IPublicCompany = {
  /**
   * Database id of the company
   */
  id: string;

  /**
   * The city the zip code resolve to
   */
  city: string;

  // TODO: update to geoPoint
  /**
   * Geo coordinates of the address
   */
  lng: number;
  lat: number;

  /**
   * Describes if the company was approved and may be used
   */
  isApproved: boolean;

  /**
   * Describes if the company was blocked
   */
  isBlocked: boolean;

  /**
   * Describes if the restaurant account is accessed for the first time
   */
  isFirstLogin: boolean;

  /**
   * Describes if the restaurant account has accepted the terms of usage
   */
  hasAcceptedTerms: boolean;
  hasSubscribedToNewsletter: boolean;
} & ICompanyContact & ICompanyDetails & ICompanyImages & ICompanyDishes & ICompanyCorona;

/**
 * Data for a company as used in business logic
 * Not sent to public API
 */
export type ICompany = {
  /**
   * internal use only
   */
  geoHash: string;

  /**
   * AuthIds of all owning users
   */
  owners: string[];
} & IPublicCompany & IBaseDataObject;

/**
 *   The instance of the company entity
 */
export type ICompanyInstance = {
  register(
    inputCompany: ICompanyContact,
    authUserId: string,
    userContact: IUserContact,
    hasSubscribedToNewsletter: boolean,
  ): Promise<void>;

  setData(company: ICompanyDetails): ICompanyInstance;

  setData(company: ICompanyContact): ICompanyInstance;

  setData(company: ICompanyOptionalInfo): ICompanyInstance;

  setData(company: ICompany): ICompanyInstance;

  updateGeoHash(): Promise<void>;

  updateLogo(path: string): Promise<void>;

  updateBackground(path: string): Promise<void>;

  create(): Promise<void>;

  update(): Promise<void>;

  delete(): Promise<void>;

  approve(): Promise<void>;

  block(): Promise<void>;

  unblock(): Promise<void>;

  addOwner(userAuthId: string): void;

  removeOwner(userAuthId: string): void;

  updateDishes(input: Array<Dish>): void;

  addDeal(input: Partial<IDeal>): Promise<IDealInstance>;

  getDeal(dealId: string): Promise<IDealInstance>;

  removeDeal(deal: IDealInstance): Promise<void>;

  getDeals(): Promise<IDealInstance[]>;
} & ICompany;

export type ICompanyOptionalInfo = Pick<ICompanyContact,
'telephone' | 'email' | 'website'>;
