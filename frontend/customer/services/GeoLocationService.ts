import { HttpRequestMethod }              from '@my-old-startup/common/http/HttpRequestMethod';
import { LatLng }                         from '@my-old-startup/common/interfaces/common';
import { IS_SERVER }                      from '@my-old-startup/frontend-common/constants';
import { globalMessageService }           from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }                     from '@my-old-startup/frontend-common/services/LogService';
import { calculateDistance }              from '../../../common/utils/geoUtils';
import { CUSTOMER_MAPS_OPTIONS }          from '../common/constants';
import { locale }                         from '../common/locales';

class GeoLocationService {
  public async getDifferenceToCurrentPoint(
    companyLocation: LatLng,
  ): Promise<number> {
    try {
      const userLocation = await this.getGeoLocation();

      if (userLocation === undefined) {
        return 0;
      }

      return calculateDistance(
        companyLocation,
        userLocation,
      );
    } catch (error) {
      globalMessageService.pushMessage({
        message: locale.error.geoLocationNotAvailable,
        variant: 'error',
      });
      logService.error(error);

      return 0;
    }
  }

  public async getGeoLocation(): Promise<LatLng | undefined> {
    try {
      if (IS_SERVER) {
        // eslint-disable-next-line no-console
        //console.error('Cannot call GEO API on server');
        // FIXME: For now just return undefined, should use Google Geo API with users Ip
        return undefined;
      }

      return await this.getGeoLocationByBrowser();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('No result on browser api', error);

      try {
        // eslint-disable-next-line no-console
        console.log('trying Google GeoLocation lookup');
        return await this.getGeoLocationByGoogle();
      } catch (error) {
        globalMessageService.pushMessage({
          message: locale.error.geoLocationNotAvailable,
          variant: 'info',
        });
        logService.error(error);
        return Promise.resolve(undefined);
      }
    }
  }

  private getGeoLocationByBrowser(): Promise<LatLng | undefined> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            console.log('Got geolocation from browser');
            resolve({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
            return;
          },
          error => {
            reject(error);
            return;
          },
          { maximumAge:         60000,
            timeout:            2000,
            enableHighAccuracy: true,
          },
        );
      } else {
        globalMessageService.pushMessage({
          message: locale.error.geoLocationPermission,
          variant: 'warning',
        });
        reject('No GeLocation available');

        return;
      }
    });
  }

  public async getGeoLocationByGoogle(): Promise<LatLng | undefined> {
    try {
      // FIXME Get api key somehwerwe
      const options = {
        method:  HttpRequestMethod.POST.toString(),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const result: Response = await fetch(
        'https://www.googleapis.com/geolocation/v1/geolocate?key=' + CUSTOMER_MAPS_OPTIONS.key,
        options,
      );
      const content = await result.json();

      if (content) {
        return content.location;
      }

      throw new Error('GeLocation API call failed');
    } catch (error) {
      throw new Error('No GeLocation available: \n' + error);
    }
  }
}

export const geoLocationService = new GeoLocationService();
