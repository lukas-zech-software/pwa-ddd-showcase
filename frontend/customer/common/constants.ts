import {
  IS_PWA,
  IS_SERVER,
} from '@my-old-startup/frontend-common/constants';

export let WINDOW_HEIGHT = 0;

if (IS_SERVER === false) {
  WINDOW_HEIGHT = window.innerHeight;
}

export const APP_HEADER_HEIGHT = 8 * 2;
export const IOS_FIX           = IS_PWA ? 9 : 0;
export const BOTTOM_NAV_HEIGHT = 13;
export const TOP_NAV_HEIGHT    = 6;

export const CUSTOMER_GA_TRACKING_ID = 'UA-134625394-3';
export const isProduction: boolean   = process.env.NODE_ENV === 'production';

export const CUSTOMER_MAPS_OPTIONS = {
  key:      process.env.MAPS_KEY,
  language: 'de',
};
