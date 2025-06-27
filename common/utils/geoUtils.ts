import {
  ILocation,
  LatLng,
} from '../interfaces';

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates the distance, in kilometers, between two locations, via the
 * Haversine formula. Note that this is approximate due to the fact that
 * the Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {Object} location1 The first location given as .latitude and .longitude
 * @param {Object} location2 The second location given as .latitude and .longitude
 * @return {number} The distance, in kilometers, between the inputted locations.
 */
export function calculateDistance(
  location1: { lat: number; lng: number },
  location2: { lat: number; lng: number },
): number {
  const radius   = 6371; // Earth's radius in kilometers
  const latDelta = degreesToRadians(location2.lat - location1.lat);
  const lonDelta = degreesToRadians(location2.lng - location1.lng);

  const a = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
    (Math.cos(degreesToRadians(location1.lat)) * Math.cos(degreesToRadians(location2.lat)) *
      Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}

export function isSameCoords(coords1: LatLng, coords2: LatLng, precision: number = 5): boolean {
  console.log('coords1.lat.toPrecision(precision) === coords2.lat.toPrecision(precision)', coords1.lat.toPrecision(precision), coords2.lat.toPrecision(precision));
  console.log('coords1.lng.toPrecision(precision) === coords2.lng.toPrecision(precision)', coords1.lng.toPrecision(precision), coords2.lng.toPrecision(precision));
  return (
    coords1.lat.toPrecision(precision) === coords2.lat.toPrecision(precision)
    &&
    coords1.lng.toPrecision(precision) === coords2.lng.toPrecision(precision)
  );
}

export function coordsToBounds(south: number, west: number, north: number, east: number): Bounds {
  return {
    southwest: {
      lat: south,
      lng: west,
    },
    northeast: {
      lat: north,
      lng: east,
    },
  };
}

export function latLngBoundToBounds(latLngBound: { south: number, west: number, north: number, east: number }): Bounds {
  return {
    southwest: {
      lat: latLngBound.south,
      lng: latLngBound.west,
    },
    northeast: {
      lat: latLngBound.north,
      lng: latLngBound.east,
    },
  };
}

type Bounds = {
  southwest: {
    lat: number;
    lng: number;
  },
  northeast: {
    lat: number;
    lng: number;
  },
}

export function boundsToCoords(bounds: Bounds) {
  return {
    south: bounds.southwest.lat,
    west:  bounds.southwest.lng,
    north: bounds.northeast.lat,
    east:  bounds.northeast.lng,
  };
}

export function getFormattedAddress(result: google.maps.GeocoderResult): string {
  const streetNo = getStreetNo(result);
  const route    = getRoute(result);

  if (route) {
    if (streetNo) {
      return `${route} ${streetNo}`;
    }

    return route;
  }

  return result.formatted_address.split(',')[0].replace(/\d/g, '').trim();
}

export function getStreetNo(result: google.maps.GeocoderResult): string {
  const streetNoComponent = result.address_components.find((component) => component.types.includes('street_number'));

  let streetNo = '';
  if (streetNoComponent !== undefined) {
    streetNo = streetNoComponent.long_name;
  }

  return streetNo;
}

export function getRoute(result: google.maps.GeocoderResult): string {
  const routeComponent = result.address_components.find((component) => component.types.includes('route'));

  let route = '';
  if (routeComponent !== undefined) {
    route = routeComponent.long_name;
  }

  return route;
}

export function getCity(result: google.maps.GeocoderResult): string {
  const cityComponent = result.address_components.find((component) => component.types.includes('locality'));

  let city = '';
  if (cityComponent !== undefined) {
    city = cityComponent.long_name;
  }

  return city;
}

export function getPostal(result: google.maps.GeocoderResult): string {
  const postCodeComponent = result.address_components.find((component) => component.types.includes('postal_code'));

  let postalCode = '';
  if (postCodeComponent !== undefined) {
    postalCode = postCodeComponent.long_name;
  }

  return postalCode;
}

export function filterLocationResults<T extends Pick<google.maps.GeocoderResult,'types'>>(result: T[], type: string): T[] {
  return result.filter(x => x.types.some(y => y===(type)));
}

export function getLocationFromResult(result: google.maps.GeocoderResult): ILocation {
  const location = result.geometry.location.toJSON ? result.geometry.location.toJSON() : (result.geometry.location as any) as google.maps.LatLngLiteral;

  return {
    coordinates: {
      lat: location.lat,
      lng: location.lng,
    },
    bounds:      result.geometry.bounds ? latLngBoundToBounds(result.geometry.bounds.toJSON()) : undefined,
    address:     getFormattedAddress(result),
    city:        getCity(result),
    zipCode:     getPostal(result),
    types:       result.types,
  };
}
