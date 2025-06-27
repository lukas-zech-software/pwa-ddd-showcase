import {
  ILatLngBoundsLiteral,
  ILocation,
}                             from '@my-old-startup/common/interfaces/common';
import {
  cookieService,
  storageService,
}                             from '@my-old-startup/frontend-common/services/StorageService';
import { google }             from 'google-maps/lib/types';
import {
  action,
  computed,
  observable,
  reaction,
  runInAction,
  toJS,
}                             from 'mobx';
import {
  filterLocationResults,
  getLocationFromResult,
}                             from '../../../common/utils/geoUtils';
import { loadGoogleMapsApi }  from '../common/GoogleMapsLoaderService';
import { geoLocationService } from '../services/GeoLocationService';

export const ADDRESS_STORAGE_KEY = 'ADDRESS_STORAGE_KEY';

export class LocationStore {
  private mapsApi: google;
  private geoCoder: google.maps.Geocoder;

  constructor() {
    reaction(
      () => this.location,
      (location) => {
        const value = toJS(location);
        if (value) {
          storageService.set('LocationStore', JSON.stringify(value));
          cookieService.set(ADDRESS_STORAGE_KEY, value.address);
        }
      },
    );

    if (storageService.has('LocationStore')) {
      try {
        this._location = JSON.parse(storageService.get('LocationStore')!);
      } catch (e) {
        storageService.remove('LocationStore');
      }
    }

    if (this._location === undefined) {
      this._location = {
        address: 'Köln',
        coordinates: {
          lat: 50.9414203,
          lng: 6.9570154,
        },
        bounds: {
          northeast: {
            lat: 51.08496299999999,
            lng: 7.1620628,
          },
          southwest: {
            lat: 50.8304427,
            lng: 6.7725819,
          },
        },
        city: '',
        zipCode: '',
        types: ['locality'],
      };
    }
  }

  private async getGeoCoder(): Promise<google.maps.Geocoder> {
    if (!this.mapsApi || !this.geoCoder) {
      this.mapsApi  = await loadGoogleMapsApi();
      this.geoCoder = new this.mapsApi!.maps.Geocoder();
    }

    return this.geoCoder;
  }

  @action
  public setLocationDirect(location: ILocation): void {
    this._location = location;
  }

  @action
  public setBoundsOverride(bounds: ILatLngBoundsLiteral): void {
    this._location.bounds = bounds;
  }

  @action
  public async setToUserLocation(): Promise<void> {
    let coordinates = await geoLocationService.getGeoLocation();

    try {
      this.setLocation({ location: coordinates });
    } catch (e) {

    }
  }

  public setLocation(request: google.maps.GeocoderRequest, options: { bounds?: ILatLngBoundsLiteral, filterType?: string } = {}): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const geoCoder = await this.getGeoCoder();

      request.region = 'de';

      geoCoder.geocode(request, (results, status) => {
        let hasError = status !== 'OK' || !results || results.length === 0;

        if (hasError === false) {
          results  = results.filter((x) => {
            const country = filterLocationResults(x.address_components, 'country');
            return country.length !== 0 && country[0].short_name === 'DE';
          });
          hasError = !results || results.length === 0;
        }

        if (hasError) {
          let message = 'Geocode failed: ' + status;
          if (results && results.length == 0) {
            message += ' - No results';
          } else {
            console.error(message, request);
          }
          reject(new Error(message));
          return;
        }

        runInAction(() => {
          let result = results[0];
          if (options.filterType) {
            const filteredLocation = filterLocationResults(results, options.filterType)[0];
            result                 = filteredLocation || result;
          }

          this._location        = getLocationFromResult(result);
          this._location.bounds = options.bounds || this._location.bounds;
          resolve();
        });
      });
    });
  }

  @observable
  private _location: ILocation;

  @computed
  public get location(): ILocation {
    return this._location;
  }

  public customBounds: boolean = false;
}

export let locationStore = new LocationStore();
