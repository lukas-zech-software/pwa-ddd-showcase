import {
  DayOfWeek,
  DealTagsType,
  MarketType,
} from '../enums';
import {
  DealImageUrl,
  GeoPoint,
  Timestamp,
} from './types';

export type IApiMarket = {
  id: string;
  /**
   * Defines if the market happens every week
   */
  isStatic: boolean | undefined;

  /**
   * The days of the week when this market should appear
   */
  staticDays: DayOfWeek[] | undefined;

  /**
   * Defines weather this market should not be automatically applied on public holidays
   */
  skipHolidays: boolean | undefined;

  /**
   * The type of the market
   */
  type: MarketType;

  /**
   * The companies that are present on this market
   */
  companyIds: string[]

  /*
   DESCRIPTION
   */

  /**
   * Title of the market
   * limited to 160 chars
   */
  title: string;

  /**
   * Description and conditions of the market
   * TODO: markdown?
   */
  description: string;

  /**
   * File name of image associated to this market
   */
  image: string;

  /**
   * Tags associated to this market
   */
  tags: DealTagsType[];

  /**
   * Location of this market
   */
  location: GeoPoint;

  /**
   * Address of this market: streetAddress, number, zipCode
   */
  address: string;

  /*
   CONDITIONS
   */

  /**
   * Timestamp of the date from when this market opens
   * This field is used to query the DB by dates
   */
  validFrom: Timestamp;

  /**
   * Timestamp of the date until when this market closes
   * Must be on the same day as validFrom
   */
  validTo: Timestamp;
}
