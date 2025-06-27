import {
  DayOfWeek,
  DealSpecialType,
  DealTags,
  DealType,
} from '../enums';
import {
  GeoPoint,
  Monetary,
  Timestamp,
} from './types';

export type IApiDealValue = {
  /**
   * The value of the item without this deal
   */
  originalValue: Monetary;

  /**
   * The discounted value of the item with this deal
   */
  discountValue: Monetary;
};

export type IBulkApiDeal = {
  deals: IApiDeal[];
};

export type IApiDealId = {
  id: string;
};

export type IApiDeal = {

  /**
   * Id of the deal
   */
  id: string;

  /**
   * JS timestamp when this deal was published
   */
  published: number | null;
  isStatic: boolean | undefined;
  staticDays: DayOfWeek[] | undefined;
  skipHolidays: boolean | undefined;
  type: DealType;
  specialType?: DealSpecialType;

  image: string;

  value: IApiDealValue;
  description: IApiDealDescription;
  details: IApiDealDetails;
  date: IApiDealDate;
  location?: IApiDealLocation;
};

export type IApiAggregateDeal = {

  /**
   * Id of the deal
   */
  id: string;

  /**
   * Timestamp of the date from when this deal is valid
   */
  validFrom: Timestamp;

  /**
   * Timestamp of the date until when this deal is valid
   * Must be on the same day as validFrom
   */
  validTo: Timestamp;

  /**
   * Tags associated to this deal
   */
  tags: DealTags[];

  /**
   * The value of the item without this deal
   */
  originalValue: Monetary;

  /**
   * The discounted value of the item with this deal
   */
  discountValue: Monetary;
};

export type IApiDealLocation = {
  /**
   * Location of this deal
   * e.g. food trucks or off site venues
   */
  location: GeoPoint;

  /**
   * Address of this deal: streetAddress, number, zipCode
   * e.g. food trucks or off site venues
   */
  address: string;
};

export type IApiDealDetails = {
  /**
   * Tags associated to this deal
   */
  tags: DealTags[];

  /**
   * Minimum number of persons that are needed to claim this deal
   */
  minimumPersonCount: number;

  /**
   * Whether the deal requires a prior reservation
   */
  reservationRequired: boolean;
};

export type IApiDealDescription = {
  /**
   * Title of the deal
   * limited to 160 chars
   */
  title: string;

  /**
   * Description and conditions of the deal
   * TODO: markdown?
   */
  description: string;
};

export type IApiDealDate = {
  /**
   * Timestamp of the date from when this deal is valid
   */
  validFrom: Timestamp;

  /**
   * Timestamp of the date until when this deal is valid
   * Must be on the same day as validFrom
   */
  validTo: Timestamp;
};
