/* eslint-disable no-multi-spaces */

export enum CompanyType {
  RESTAURANT,
  CAFE,
  IMBISS,
  FOODTRUCK,
  BAR,
  RETAIL,
}

export function isSpecialType(type:DealType):boolean{
  return type === DealType.SPECIAL || type === DealType.SPECIAL_MENU || type === DealType.SPECIAL_NEW;
}

export enum DealType {
  DISCOUNT,
  DISCOUNT_2_FOR_1,
  DISCOUNT_CATEGORY,
  DISCOUNT_WHOLE_BILL,
  SPECIAL,
  SPECIAL_MENU,
  SPECIAL_NEW,
  ADDON,
}

export enum DealSpecialType {
  DAILY,
  WEEKLY,
  MONTHLY,
  SPECIAL,
}

export enum DateFilter {
  TODAY,
  TOMORROW,
  REST_OF_WEEK,
  WHOLE_WEEK,
}

/**
 * moment and Date both start at zero on Sundays
 */
export enum DayOfWeek {
  Sunday    = 0,
  Monday    = 1,
  Tuesday   = 2,
  Wednesday = 3,
  Thursday  = 4,
  Friday    = 5,
  Saturday  = 6,
}


export enum MarketType {
  WEEKLY_MARKET,
  FOOD_FESTIVAL,
  FAIR,
}
