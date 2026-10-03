import { google } from 'google-maps/lib/types';

export function loadGoogleMapsApi(): Promise<google> {
  return (window as any).gmapsPromise;
}
