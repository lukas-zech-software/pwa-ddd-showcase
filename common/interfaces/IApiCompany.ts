import {
  CompanyType,
  DealTags,
}                           from '../enums';
import { OpeningHoursWeek } from './openingHours';

export type IApiCompanyContact = {
  /**
   * The title of the company
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
   * The type of the company
   */
  type: CompanyType;

  /**
   * The email of the company
   */
  website: string | undefined;

  /**
   * Has the user accepted terms and privacy agreements
   */
  hasAcceptedTerms: boolean;

  /**
   * Describes if the restaurant account has described to the newsletter
   */
  hasSubscribedToNewsletter: boolean;
};

export type IApiCompanyDetails = {
  /**
   * The description of the company
   */
  description: string | undefined;
  /**
   * Opening hours of the company
   */
  openingHours: OpeningHoursWeek | undefined;

  /**
   * Whether deals will default with reservation wanted = true
   */
  prefersReservations: boolean;

  /**
   * General tags about what the company offers
   */
  tags?: DealTags[];

  /**
   * Link to facebook profile
   */
  reservationsLink?: string;

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

export type IApiCompanyStatus = {
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
};

export type Dish = {
  title: string;
  description: string;
  price: number;
};

export type OpenRestrictions = {
  indoor?: boolean | undefined;
  outdoor?: boolean | undefined;
  reservationNecessary?: boolean | undefined;
  phoneReservations?: boolean | undefined;
  maxPersonCount?: string | undefined;
  maxStayTime?: string | undefined;
  reservationsLink?: string | undefined;
};

export type IApiCompanyCorona = {
  //CORONA
  offersReopen: boolean;
  reopenDescription?: string | undefined;
  openRestrictions?: OpenRestrictions;
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
  //CORONA
}

export type IApiCompanyContactWithCity = {
  /**
   * The city the zip code was resolved to
   */
  city: string;
} & IApiCompanyContact;

export type IApiCompanyLocation = {
  lat: number;
  lng: number;
};

export type IApiCompanyImages = {
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

export type IApiCompanyDishes = {
  /**
   * Background image
   */
  dishes?: Dish[] | undefined;

};

export type IApiCompanyMinimal = {
  id: string;
  distance?: number;
  corona: Pick<IApiCompanyCorona, 'offersReopen' | 'openRestrictions' | 'offersDelivery' | 'offersTakeAway' | 'offersCoupons' | 'acceptsDonations'>;
  contact: Pick<IApiCompanyContactWithCity, 'type' | 'title' | 'address' | 'city' | 'zipCode' | 'telephone' | 'secondaryTelephone' | 'secondaryTelephoneReason'>;
  images: Pick<IApiCompanyImages, 'logo' | 'background'>,
  location: IApiCompanyLocation;
}

export type IApiCompanyMinimalTransport = {
  id: string;
  type: CompanyType;
  title: string;
  address: string;
  city: string;
  zip: string;
  distance?: number;
  logo?: string;
  background?: string;
  tel: string | undefined;
  tel2: string | undefined;
  tel2Reason: string | undefined;
  corona: [boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined];
  openRestrictions: [boolean | undefined, boolean | undefined, boolean | undefined, boolean | undefined, string | undefined, string | undefined, string | undefined];
} & IApiCompanyLocation;

export type IPublicApiCompany = {
  id: string;

  images: IApiCompanyImages;
  details: IApiCompanyDetails;
  corona: IApiCompanyCorona;

  contact: Omit<IApiCompanyContactWithCity, 'hasAcceptedTerms' | 'hasSubscribedToNewsletter'>;
  status: Omit<IApiCompanyStatus, 'isApproved' | 'isBlocked'>;
  location: IApiCompanyLocation;
} & IApiCompanyDishes;

export type IApiCompany = {
  /**
   * Database id of the company
   */
  id: string;

  /**
   * Coupon code of the company
   */
  couponCode: string;

  details: IApiCompanyDetails;

  /**
   * Information about the status of the account
   */
  status: IApiCompanyStatus;

  contact: IApiCompanyContactWithCity;

  /**
   * Geo coordinates of the address
   */
  location: IApiCompanyLocation;

  images: IApiCompanyImages;

  corona: IApiCompanyCorona;

} & IApiCompanyDishes;

export type IHubApiCompany = {
  created: number;
  updated: number;

  geoHash: string;
  /**
   * Db Ids of all owning users
   */
  owners: string[];

  isActingAsOwner: boolean;
} & IApiCompany;
