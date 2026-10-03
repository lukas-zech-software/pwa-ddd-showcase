import { LatLng }     from '@my-old-startup/common/interfaces/common';
import {
  IApiCompany,
  IApiCompanyMinimal,
}                     from '@my-old-startup/common/interfaces/IApiCompany';
import { IApiDeal }   from '@my-old-startup/common/interfaces/IApiDeal';
import { IApiMarket } from '../../../common/interfaces';

export type CompanySearchResultMinimal = {
  company: IApiCompanyMinimal;
};

export type CompanySearchResult = {
  company: IApiCompany;
  distance: number;
};

export type DealSearchResult = CompanySearchResult & {
  deal: IApiDeal;
};

export type MapLocation = CompanySearchResult & {
  location: LatLng;
  deals: IApiDeal[];
  news: IApiDeal[];
};

export type MarketMapLocation =  {
  market:IApiMarket;
  location: LatLng;
  companies: IApiCompany[];
};

export enum MapType {
  NEWS,
  DEALS,
  MARKETS,
  COMPANIES,
}
