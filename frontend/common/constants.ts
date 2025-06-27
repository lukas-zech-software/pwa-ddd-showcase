export const IS_SERVER              = typeof window === 'undefined';
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';
export const IS_STAGING: boolean    = process.env.IS_STAGING === 'true';
export const IS_IOS                 =
               !IS_SERVER &&
               (navigator.platform.includes('iPhone') ||
                 navigator.platform.includes('iPad') ||
                 navigator.platform.includes('iPod'));

export const IS_PWA =
               IS_SERVER === false &&
               window.matchMedia('(display-mode: standalone)').matches;

export const SUPPORTS_SHARING =
               IS_SERVER === false &&
               (navigator.clipboard !== undefined || navigator.share !== undefined);

function iOsVersion(): [number, number, number] | undefined {
  if (!IS_IOS) {
    return;
  }

  // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
  const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);

  if (!v) {
    return;
  }

  return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || '0', 10)];
}

export const IOS_VERSION        = iOsVersion();
export const IS_OLD_IOS_VERSION = IOS_VERSION && IOS_VERSION[0] <= 10;

export const DASHBOARD_MAPS_OPTIONS      = {
  key:      process.env.MAPS_KEY!,
  language: 'de',
};
