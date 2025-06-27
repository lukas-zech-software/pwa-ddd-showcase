import {
  createClient,
  GeocodingRequest,
  GeocodingResult,
  GoogleMapsClient,
  LatLngBounds,
  LatLngLiteral,
  ReverseGeocodingRequest,
}                            from '@google/maps';
import {
  ILatLngBoundsLiteral,
  ILocation,
}                            from '@my-old-startup/common/interfaces';
import { calculateDistance } from '@my-old-startup/common/utils/geoUtils';
import {
  inject,
  injectable,
}                            from 'inversify';
import * as nGeohash         from 'ngeohash';
import { ErrorCode }         from '../../../../common/error/ErrorCode';
import { IGeoHashLocation }  from '../../api/interfaces/geo';
import { ICacheService }     from '../../cache/ICacheService';
import { ApiError }          from '../../common/ApiError';
import { keys }              from '../../container/inversify.keys';

const DE_ISO_CODE        = 'DE';
const GEO_HASH_PRECISION = 5;
const HASH_CACHE_PREFIX  = 'hash_';
const GEO_CACHE_PREFIX   = 'geo_';

const maps_types = ['street_address', 'route', 'intersection', 'establishment', 'town_square', 'premise', 'locality'];

export type IGeoHashResult = {
  hashes: string[];
  // just return all
  all?: boolean;
  location: ILocation;
};

export type IGeoCodingService = {
  getAddressForLocation(coords: LatLngLiteral): Promise<string>;

  getLocationForAddress(
    address: string,
    zipCode: string,
  ): Promise<IGeoHashLocation>;

  getHashesForRadiusAroundAddress(
    address: string,
    radius: number,
  ): Promise<IGeoHashResult>;

  getHashesForRadiusAroundCoordinates(
    coords: LatLngLiteral,
    radius: number,
  ): Promise<IGeoHashResult>;

  getHashesForAreaBounds(
    bounds: ILatLngBoundsLiteral,
  ): Promise<IGeoHashResult>;

  getGeoHash(lat: number, lng: number): string;

};

@injectable()
export class GeoCodingService implements IGeoCodingService {
  private geoCoder: GoogleMapsClient;

  public constructor(
    @inject(keys.IsProduction) private isProduction: boolean,
    @inject(keys.IHashCacheService)
    private hashesCacheService: ICacheService<IGeoHashResult>,
    @inject(keys.IGeoCodeCacheService)
    private geoCodeCacheService: ICacheService<GeocodingResult>,
  ) {
    this.geoCoder = createClient({
      // TODO: mount keys in secret
      key: isProduction
        ? 'some-secret'
        : 'some-secret',
    });
  }

  private static getFormattedAddress(result: GeocodingResult): string {
    return result.formatted_address.split(',')[0];
  }

  private static getCity(result: GeocodingResult): string {
    const cityComponent = result.address_components.find((component) => component.types.includes('locality'));

    let city = '';
    if (cityComponent !== undefined) {
      city = cityComponent.long_name;
    }

    return city;
  }

  private static getPostal(result: GeocodingResult): string {
    const postCodeComponent = result.address_components.find((component) => component.types.includes('postal_code'));

    let postalCode = '';
    if (postCodeComponent !== undefined) {
      postalCode = postCodeComponent.long_name;
    }

    return postalCode;
  }

  private static getLocationFromResult(result: GeocodingResult): ILocation {
    const location = (result.geometry.location as any) as LatLngLiteral;

    return {
      coordinates: location,
      bounds:      result.geometry.bounds,
      address:     GeoCodingService.getFormattedAddress(result),
      city:        GeoCodingService.getCity(result),
      zipCode:     GeoCodingService.getPostal(result),
      types:       result.types,
    };
  }

  /**
   * Get an rectangular area around the provided coordinates
   * Size is roughly determined by the radius parameter
   *
   * NOTE: This is not actually a radius!
   *
   * @param {number} lat
   * @param {number} lng
   * @param {number} radius T
   * @returns {LatLngBounds}
   */
  private static getAreaBounds(
    lat: number,
    lng: number,
    radius: number,
  ): LatLngBounds {
    // radius is in kilometer. 1/60  of a degree are roughly 1.8km
    const radiusDegree = (radius + radius * 0.8) / 60;
    return {
      // as we want a more rectangular area, only use half the radius on the latitude
      // this is nowhere mathematically correct, but works pretty fine in the area of Germany
      northeast: {
        lat: lat + radiusDegree * 0.5,
        lng: lng + radiusDegree,
      },
      southwest: {
        lat: lat - radiusDegree * 0.5,
        lng: lng - radiusDegree,
      },
    };
  }

  public async getHashesForRadiusAroundAddress(
    address: string,
    radius: number,
  ): Promise<IGeoHashResult> {
    const cacheId = `${address}_${radius}`;

    let cached = await this.hashesCacheService.get(cacheId, HASH_CACHE_PREFIX);
    let all    = false;

    if (cached === undefined) {
      const geocodingResult = await this.getMapsResult(address);
      //console.log('geocodingResult', geocodingResult);
      all = (geocodingResult.types as string[]).some((type) =>
                                                       type.includes('administrative_area_level_'),
      );

      const location             = (geocodingResult.geometry.location as any) as LatLngLiteral,
            bounds: LatLngBounds = GeoCodingService.getAreaBounds(
              location.lat,
              location.lng,
              radius,
            );

      const hashes = this.getGeoHashesForArea(
        bounds.southwest.lat,
        bounds.southwest.lng,
        bounds.northeast.lat,
        bounds.northeast.lng,
      );

      cached = [
        {
          hashes,
          all,
          location: GeoCodingService.getLocationFromResult(geocodingResult),
        },
      ];

      await this.hashesCacheService.set(cacheId, cached, HASH_CACHE_PREFIX);
    }

    return cached[0];
  }

  public async getHashesForRadiusAroundCoordinates(
    coords: LatLngLiteral,
    radius: number,
  ): Promise<IGeoHashResult> {
    const cacheId = `${coords.lat}_${coords.lng}_${radius}`;

    let cached = await this.hashesCacheService.get(cacheId, HASH_CACHE_PREFIX);

    if (cached === undefined) {
      const bounds: LatLngBounds = GeoCodingService.getAreaBounds(
        coords.lat,
        coords.lng,
        radius,
      );
      const hashes               = this.getGeoHashesForArea(
        bounds.southwest.lat,
        bounds.southwest.lng,
        bounds.northeast.lat,
        bounds.northeast.lng,
      );

      cached = [
        {
          hashes,
          location: {
            coordinates: coords,
            address:     '',
            city:        '',
            zipCode:     '',
          },
        },
      ];

      await this.hashesCacheService.set(cacheId, cached, HASH_CACHE_PREFIX);
    }

    return cached[0];
  }

  public async getHashesForAreaBounds(
    bounds: ILatLngBoundsLiteral,
  ): Promise<IGeoHashResult> {
    const cacheId = `${bounds.northeast.lat}_${bounds.northeast.lng}_${bounds.southwest.lat}_${bounds.southwest.lng}`;

    let cached = await this.hashesCacheService.get(cacheId, HASH_CACHE_PREFIX);

    if (cached === undefined) {
      const hashes = this.getGeoHashesForArea(
        bounds.southwest.lat,
        bounds.southwest.lng,
        bounds.northeast.lat,
        bounds.northeast.lng,
      );

      const middle = middlePoint(
        bounds.southwest.lat,
        bounds.southwest.lng,
        bounds.northeast.lat,
        bounds.northeast.lng,
      );

      cached = [
        {
          hashes,
          location: {
            coordinates: middle,
            bounds,
            address:     '',
            city:        '',
            zipCode:     '',
          },
        },
      ];

      await this.hashesCacheService.set(cacheId, cached, HASH_CACHE_PREFIX);
    }

    return cached[0];
  }

  public async getLocationForAddress(
    address: string,
    zipCode: string,
  ): Promise<IGeoHashLocation> {
    const result = await this.lookupAddress(address, zipCode);

    const location = GeoCodingService.getLocationFromResult(result);

    if (location.coordinates === undefined) {
      throw new Error('No coordinates returned: ' + JSON.stringify(location));
    }

    const geoHash = this.getGeoHash(location.coordinates.lat, location.coordinates.lng);

    return {
      ...location,
      geoHash,
    };
  }

  public async getAddressForLocation(coords: LatLngLiteral): Promise<string> {
    const request: ReverseGeocodingRequest = {
      latlng:      coords,
      language:    'de',
      // eslint-disable-next-line @typescript-eslint/camelcase
      result_type: maps_types.join('|') as any,
    };

    return new Promise<string>((resolve, reject) => {
      this.geoCoder.reverseGeocode(request, (error, response) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error on reverse GeoCode API ', error);
          return reject(error);
        }

        if (response.json.results.length === 0) {
          return reject(
            new ApiError(
              'No Addresses found',
              ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND,
            ),
          );
        }

        resolve(response.json.results[0].formatted_address);
      });
    });
  }

  // TODO: Combine methods
  private async lookupAddress(
    address: string,
    zipCode: string,
  ): Promise<GeocodingResult> {
    const cacheId = `${address}_${zipCode}`;

    const cached = await this.geoCodeCacheService.get(cacheId, GEO_CACHE_PREFIX);

    if (cached !== undefined) {
      return cached[0];
    }

    const request: GeocodingRequest = {
      address:  `${address}, ${zipCode}`,
      language: DE_ISO_CODE,
      region:   DE_ISO_CODE,
    };

    // google-maps typings are incorrect in some parts
    request.components = {
      country:    DE_ISO_CODE,
      postalCode: zipCode,
    } as any;

    return new Promise<GeocodingResult>((resolve, reject) => {
      // console.debug('Geocoding request: ', request);

      this.geoCoder.geocode(request, (error, response) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error on GeoCode API ', error);
          return reject(error);
        }

        if (response.json.results.length === 0) {
          console.error(`No  GeoLocations in ${DE_ISO_CODE} found. Request:${JSON.stringify(request)} Response:${JSON.stringify(response)}`);
          return reject(
            new ApiError(
              'No GeoLocations found',
              ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND,
            ),
          );
        }

        // console.debug('GeoCode API returned result: ', inspect(response.json.results, true, 10));
        // filter for addresses and special premises only
        const filteredResults = response.json.results.filter((geoResult) => geoResult.types.some(
          (x: string) => {
            return maps_types.includes(x);
          },
        ));

        if (filteredResults.length === 0) {
          console.error(`No filtered GeoLocations in ${DE_ISO_CODE} found. Request:${JSON.stringify(request)} Response:${JSON.stringify(response)}`);
          return reject(
            new ApiError(
              `No GeoLocations in ${DE_ISO_CODE} found`,
              ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND,
            ),
          );
        }

        this.geoCodeCacheService
          .set(cacheId, filteredResults, GEO_CACHE_PREFIX)
          .then(() => {
            // TODO: Handle multiple results?
            resolve(filteredResults[0]);
          });
      });
    });
  }

  private async getMapsResult(address: string): Promise<GeocodingResult> {
    const cacheId = `${address}`;

    const cached = await this.geoCodeCacheService.get(cacheId, GEO_CACHE_PREFIX);

    if (cached !== undefined) {
      return cached[0];
    }

    const request: GeocodingRequest = {
      address,
      language: DE_ISO_CODE,
      region:   DE_ISO_CODE,
    };

    request.components = {
      country: DE_ISO_CODE,
    };

    return new Promise<GeocodingResult>((resolve, reject) => {
       //console.debug('Geocoding request: ', request);

      this.geoCoder.geocode(request, (error, response) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Error on GeoCode API ', error);
          return reject(error);
        }

        if (response.json.results.length === 0) {
          console.error(`No GeoLocations in ${DE_ISO_CODE} found. Request:${JSON.stringify(request)} Response:${JSON.stringify(response)}`);
          return reject(
            new ApiError(
              'No GeoLocations found',
              ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND,
            ),
          );
        }
        // console.debug('GeoCode API returned result: ', inspect(response.json.results, true, 10));

        // When nothing is found for the search term, the Google API returns the filtering component (DE)
        // so if nothing was found it returns a result with a single address_components which is "Germany"
        // we do not want this, so we filter this specific result
        const filteredResults = response.json.results.filter((geoResult) => geoResult.address_components.length !== 1);

        if (filteredResults.length === 0) {
          console.error(`No filtered GeoLocations in ${DE_ISO_CODE} found. Request:${JSON.stringify(request)} Response:${JSON.stringify(response)}`);
          return reject(
            new ApiError(
              `No GeoLocations in ${DE_ISO_CODE} found`,
              ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND,
            ),
          );
        }

        this.geoCodeCacheService
          .set(cacheId, filteredResults, GEO_CACHE_PREFIX)
          .then(() => {
            // TODO: Handle multiple results?
            resolve(filteredResults[0]);
          });
      });
    });
  }

  public getGeoHash(lat: number, lng: number): string {
    return nGeohash.encode(lat, lng, GEO_HASH_PRECISION);
  }

  private getGeoHashNeighbors(lat: number, lng: number): string[] {
    const centerHash = this.getGeoHash(lat, lng);
    return nGeohash.neighbors(centerHash);
  }

  private getGeoHashesForArea(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
  ): string[] {
    const distance = calculateDistance({
                                         lat: minLat,
                                         lng: minLng,
                                       }, {
                                         lat: maxLat,
                                         lng: maxLng,
                                       });
    if (distance > 400) {
      console.warn('Distance too large', distance);
      // will cause too big in other service
      return new Array(10000).fill('');
    }

    return nGeohash.bboxes(minLat, minLng, maxLat, maxLng, GEO_HASH_PRECISION);
  }

  private getPointBetweenCoordinates(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
  ): LatLngLiteral {
    return middlePoint(minLat, minLng, maxLat, maxLng);
  }
}

/*
 * Find midpoint between two coordinates points
 * Source : http://www.movable-type.co.uk/scripts/latlong.html
 */

function toRad(x: number) {
  return x * Math.PI / 180;
}

function toDeg(x: number) {
  return x * (180 / Math.PI);
}

//-- Define middle point function
function middlePoint(lat1: number, lng1: number, lat2: number, lng2: number): LatLngLiteral {

  //-- Longitude difference
  var dLng = toRad(lng2 - lng1);

  //-- Convert to radians
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);
  lng1 = toRad(lng1);

  var bX   = Math.cos(lat2) * Math.cos(dLng);
  var bY   = Math.cos(lat2) * Math.sin(dLng);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  return {
    lng: toDeg(lng3),
    lat: toDeg(lat3),
  };
}
