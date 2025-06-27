import { ILocation } from '@my-old-startup/common/interfaces';

export type IGeoSearchResult<T> = {
  companies: T[];
  location: ILocation;
  all?: boolean;
};

export type IGeoHashLocation = {
  geoHash: string;
} & ILocation;
