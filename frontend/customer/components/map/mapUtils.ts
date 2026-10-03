import { LatLng }             from '@my-old-startup/common/interfaces/common';
import { IS_IOS }             from '@my-old-startup/frontend-common/constants';
import { geoLocationService } from '../../services/GeoLocationService';

export async function openGoogleMapsRoute(location: LatLng): Promise<void> {
  const coordinates       = await geoLocationService.getGeoLocation();
  const customerCoordText = coordinates ? `${coordinates.lat},${coordinates.lng}` : '';

  if (IS_IOS) {
    /* if we're on iOS, open in Apple Maps */
    window.location.href =
      `maps://maps.google.com/maps?daddr=${location.lat},${location.lng}&saddr=${customerCoordText}`;
  } else {
    /* else use Google */
    window.open(
      `https://maps.google.com/maps?daddr=${location.lat},${location.lng}&saddr=${customerCoordText}`,
    );
  }
}
