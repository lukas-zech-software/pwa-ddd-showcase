import { ErrorCode }      from '../error/ErrorCode';
import { HttpStatusCode } from '../http/HttpStatusCode';

export type IObject<T = any> = {
  [index: string]: T;
};

export type IConstructorFn<T> = new(...params: any[]) => T;

/**
 * All monetary values are stored in integers as euro cent;
 */
export type Monetary = number;

/**
 * JS timestamp (millisecond)
 */
export type Timestamp = number;

/**
 * Deal Image URLs are always relative to the /deal folder in the company's folder in the image bucket
 * E.g. deal1.jpeg for company with id 1337 will point to https://images.my-old-startups-domain.de/company/1337/deals/deal1.jpeg
 */
export type DealImageUrl = string;

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type Locale<T> = {
  [key in keyof T]: string;
};

export type ErrorCodeMessages = {
  [key in ErrorCode]: string;
};
export type HttpStatusCodeMessages = {
  [key in HttpStatusCode]: string;
};
