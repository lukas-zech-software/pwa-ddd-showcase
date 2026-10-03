import { UAParser } from 'ua-parser-js';

export const DASHBOARD_GA_TRACKING_ID = 'UA-134625394-4';
export const APP_BAR_HEIGHT           = 64;
export const DRAWER_WIDTH             = 240;

const getUAName = () => new UAParser(navigator.userAgent).getBrowser().name || '';

export const IS_SAFARI = /(Mobile )?Safari/.test(getUAName());

export const IS_IOS = getUAName().includes('Mobile Safari');
