import {
  CompanyType,
  DateFilter,
  DealTags,
}                     from '../enums';
import {
  IApiCompany,
  IApiCompanyMinimalTransport,
  IPublicApiCompany,
}                     from './IApiCompany';
import { IApiDeal }   from './IApiDeal';
import { IApiMarket } from './IApiMarket';

/**
 * Geo point data, same format as used mz google maps
 */
export type LatLng = {
  lng: number;
  lat: number;
};

export interface ILatLngBoundsLiteral {
  northeast: LatLng;
  southwest: LatLng;
}

export type ILocation = {
  coordinates: LatLng;
  bounds?: ILatLngBoundsLiteral;
  types?: string[],
  address?: string;
  city?: string;
  zipCode?: string;
};

export type ApiMarketRequest = {
  marketId: string;
};

export type ApiSearchCompanyRequest = {
  companyId: string;
};

export type ApiSearchDealRequest = ApiSearchCompanyRequest & {
  dealId: string;
};

export type ApiMarketResponse = {
  market: IApiMarket;
};

export type ApiSearchMarketResponse = {
  markets: IApiMarket[];
};

export type ApiSearchCompanyResponse = {
  company: IPublicApiCompany;
};

export type ApiSearchDealResponse = ApiSearchCompanyResponse & {
  deal: IApiDeal;
};

export type ApiCoordinatesSearchRequest = {
  radius?: number;
  coordinates: LatLng;
};

export type ApiSearchResponse = {
  results: ApiSearchResult[];
  location: ILocation;
};

export type ApiSearchResponseMinimal = {
  location?: ILocation;
  all?: boolean;
  results: IApiCompanyMinimalTransport[];
};

export type ApiSearchResult = {
  deals: IApiDeal[];
  company: IApiCompany;
  distance: number;
};

export type FilterObject<T extends string | number> = {
  [key in T]?: boolean;
};

export type CompanyFilter = {
  radius?: number;
} & Partial<ILocation> & CustomerFilter;

export type CustomerFilter = {
  date: DateFilter;
  companyTypes?: CompanyType[];
  dealTags?: DealTags[];
};

export type ApiFilterSearchRequest = {
  filter: CompanyFilter;
};

export type ApiSetDealAccountRequest = {
  dealsRemaining: number;
};
