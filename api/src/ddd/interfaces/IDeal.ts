import {
  DayOfWeek,
  DealSpecialType,
  DealTags,
  DealType,
}                          from '@my-old-startup/common/enums';
import {
  DealImageUrl,
  GeoPoint,
  Monetary,
  Timestamp,
}                          from '@my-old-startup/common/interfaces';
import { IBaseDataObject } from './IBaseDataObject';

export type IDeal = {
  /**
   * JS timestamp when this deal was published
   */
  published: number | null;

  /**
   * Flag only used for querying the db with == operator
   */
  isPublished: boolean | null;

  /**
   * Defines if the deal is valid always
   */
  isStatic: boolean | undefined;

  /**
   * Defines if this is a special/news/novelty
   * Is set on create according to type
   */
  isSpecial: boolean;

  /**
   * The days of the week when this deal should appear
   */
  staticDays: DayOfWeek[] | undefined;

  /**
   * Defines weather this deal should not be automatically applied on public holidays
   */
  skipHolidays: boolean | undefined;

  /**
   * JS timestamp when deals where generated last time for this static deal
   */
  lastGenerated: number | undefined;

  /**
   * Type of this deal
   */
  type: DealType;

  /**
   * The type of the special, if this is a special deal
   */
  specialType?: DealSpecialType;

  /**
   * internal use only
   * center GeoHash of the deal
   */
  geoHash?: string;

  /**
   * ID of the company this belongs to
   */
  companyId: string;

  /*
   VALUE
   */

  /**
   * The value of the item without this deal
   */
  originalValue: Monetary;

  /**
   * The discounted value of the item with this deal
   */
  discountValue: Monetary;

  /*
   DESCRIPTION
   */

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

  /**
   * File name of image associated to this deal
   */
  image: DealImageUrl;

  /**
   * Tags associated to this deal
   */
  tags: DealTags[];

  /**
   * Location of this deal
   * e.g. food trucks or off site venues
   */
  location?: GeoPoint;

  /**
   * Address of this deal: streetAddress, number, zipCode
   * e.g. food trucks or off site venues
   */
  address?: string;

  /*
   CONDITIONS
   */

  /**
   * Timestamp of the date from when this deal is valid
   * This field is used to query the DB by dates
   */
  validFrom: Timestamp;

  /**
   * Timestamp of the date until when this deal is valid
   * Must be on the same day as validFrom
   */
  validTo: Timestamp;

  /**
   * Minimum number of persons that are needed to claim this deal
   */
  minimumPersonCount: number;

  /**
   * Whether the deal requires a prior reservation
   */
  reservationRequired: boolean;
} & IBaseDataObject;

export type IDealInstance = {
  create(companyId: string): Promise<IDealInstance>;

  setData(deal: Partial<IDeal>): IDealInstance;

  updateImage(path: string, companyId: string): Promise<void>;

  update(inputDeal?: Partial<IDeal>): Promise<void>;

  publish(): Promise<void>;

  delete(): Promise<void>;
} & IDeal;
