import * as Cookie        from 'js-cookie';
import ReactGA, {
  EventArgs,
  FieldsObject,
  TrackerNames,
}                         from 'react-ga';
import { TimeInMs }       from '../../../common/datetime';
import {
  ANALYTICS_ENABLED_KEY,
  COOKIE_ONLY_NECESSARY,
}                         from '../../../common/enums';
import { IS_PRODUCTION }  from '../constants';
import { storageService } from './StorageService';

export class GoogleAnalyticsService<TEvent extends EventArgs> {

  public static init(gaTrackingId: string, cookieDomain: string, disable = false): void {
    const onlyNecessarySet = storageService.has(COOKIE_ONLY_NECESSARY);

    if (onlyNecessarySet) {
      return;
    }

    if (GoogleAnalyticsService.isAnalyticsDisabled() === true || disable) {
      GoogleAnalyticsService.disable(cookieDomain);
      return;
    }

    if (GoogleAnalyticsService.isAnalyticsDisabled() === true || disable) {
      GoogleAnalyticsService.disable(cookieDomain);
      return;
    }

    if (IS_PRODUCTION === false) {
      return;
    }

    ReactGA.initialize(gaTrackingId, {
      gaOptions: {
        cookieDomain,
        cookieName: cookieDomain + '_ga',
      },
    });
  }

  public static trackPageView(url: string): void {
    if (GoogleAnalyticsService.isAnalyticsDisabled()) {
      return;
    }
    ReactGA.pageview(url);
  }

  public static set(fieldsObject: FieldsObject, trackerNames?: TrackerNames): void {
    if (GoogleAnalyticsService.isAnalyticsDisabled()) {
      return;
    }

    ReactGA.set(fieldsObject, trackerNames);
  }

  public static isAnalyticsDisabled(): boolean {
    const analyticsOption = Cookie.get(ANALYTICS_ENABLED_KEY);

    if (IS_PRODUCTION !== true) {
      return true;
    }

    if (analyticsOption === undefined) {
      const storageAnalyticsOption = storageService.get(ANALYTICS_ENABLED_KEY);
      return storageAnalyticsOption === 'false';
    }

    return analyticsOption === 'false';
  }

  public static disable(cookieDomain: string): void {
    storageService.set(ANALYTICS_ENABLED_KEY, 'false');

    Cookie.set(ANALYTICS_ENABLED_KEY, 'false', {
      domain:  'my-old-startups-domain.de',
      expires: Date.now() + (TimeInMs.ONE_DAY * 365 * 10),
    });

    Cookie.remove(cookieDomain + '_gat', { domain: cookieDomain });
    Cookie.remove(cookieDomain + '_ga', { domain: cookieDomain });
    Cookie.remove(cookieDomain + '_gid', { domain: cookieDomain });

    // eslint-disable-next-line no-console
    console.warn('Google Analytics disabled. Cookies were removed');
  }

  public trackEvent(args: TEvent, trackerNames?: TrackerNames): void {
    if (GoogleAnalyticsService.isAnalyticsDisabled()) {
      return;
    }

    ReactGA.event(args, trackerNames);
  }
}
