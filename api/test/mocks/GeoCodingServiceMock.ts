import { LatLngLiteral }    from '@google/maps';
import { injectable }       from 'inversify';
import { IGeoHashLocation } from '../../src/api/interfaces/geo';
import {
  IGeoCodingService,
  IGeoHashResult,
}                           from '../../src/infrastructure/geoLocation/GeoCodingService';
import { AutoSpy }          from '../utils/autoSpy';

@AutoSpy()
@injectable()
export class GeoCodingServiceMock implements IGeoCodingService {
  public async getHashesForAreaBounds(bounds: import('@my-old-startup/common/interfaces').ILatLngBoundsLiteral): Promise<IGeoHashResult> {
    throw new Error('Method not implemented.');
  }

  public async getHashesForRadiusAroundAddress(): Promise<IGeoHashResult> {
    throw new Error('GeoCodingServiceMock.getHashesForRadiusAroundAddress');
  }

  public async getHashesForRadiusAroundCoordinates(): Promise<IGeoHashResult> {
    throw new Error('GeoCodingServiceMock.getHashesForRadiusAroundCoordinates');
  }

  public async getLocationForAddress(): Promise<IGeoHashLocation> {
    throw new Error('GeoCodingServiceMock.getLocationForAddress');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAddressForLocation(coords: LatLngLiteral): Promise<string> {
    throw new Error('GeoCodingServiceMock.getLocationForAddress');
  }

  getGeoHash: (lat: number, lng: number) => string;
}
