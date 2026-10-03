/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/tslint/config */
import { overrideLocale } from '@my-old-startup/common/common/locales';
import {
  DealTagsDish,
  DealTagsDrinks,
  DealTagsRegion,
  DealTagsType,
}                         from '@my-old-startup/common/enums/DealTags';
import {
  CompanyType,
  MarketType,
}                         from '@my-old-startup/common/enums/types';
import { Timestamp }      from '@my-old-startup/common/interfaces/types';
import  dayjs                      from 'dayjs';

import { IS_SERVER }      from './constants';

const timeFormatString      = 'LT';
const timestampFormatString = 'L LT';

type DealTagsLocale<T extends string> = { [K in T]: string };

const DE_DealTagsDish: DealTagsLocale<DealTagsDish> = {
  [DealTagsDish.Burger]:         'Burger',
  [DealTagsDish.Sushi]:          'Sushi',
  [DealTagsDish.Pizza]:          'Pizza',
  [DealTagsDish.Salat]:          'Salate',
  [DealTagsDish.Doener]:         'Doener',
  [DealTagsDish.Pasta]:          'Pasta',
  [DealTagsDish.Steak]:          'Steaks',
  [DealTagsDish.Meeresfruechte]: 'Meeresfrüchte',
  //[DealTagsDish.Fisch]:          'Fisch',
  [DealTagsDish.Kuchen]:         'Kuchen',
  //[DealTagsDish.Sandwich]:       'Sandwich',
  [DealTagsDish.Currywurst]:     'Currywurst',
  [DealTagsDish.Pommes]:         'Pommes',
  [DealTagsDish.Falafel]:        'Falafel',
  [DealTagsDish.Teigtaschen]:    'Teigtaschen',
  [DealTagsDish.Bowl]:           'Bowl',
};

const DE_DealTagsRegion: DealTagsLocale<DealTagsRegion> = {
  [DealTagsRegion.Italienisch]:   'Italienisch',
  [DealTagsRegion.Mexikanisch]:   'Mexikanisch',
  [DealTagsRegion.Mediterran]:    'Mediterran',
  [DealTagsRegion.Asiatisch]:     'Asiatisch',
  [DealTagsRegion.Griechisch]:    'Griechisch',
  [DealTagsRegion.Indisch]:       'Indisch',
  [DealTagsRegion.Japanisch]:     'Japanisch',
  [DealTagsRegion.Tuerkisch]:     'Türkisch',
  [DealTagsRegion.Deutsch]:       'Deutsch',
  [DealTagsRegion.Belgisch]:      'Belgisch',
  [DealTagsRegion.Vietnamesisch]: 'Vietnamesisch',
  [DealTagsRegion.Franzoesisch]:  'Französisch',
  [DealTagsRegion.Amerikanisch]:  'Amerikanisch',
  [DealTagsRegion.Persisch]:      'Persisch',
  [DealTagsRegion.Chinesisch]:    'Chinesisch',
  [DealTagsRegion.Libanesisch]:   'Libanesisch',
  [DealTagsRegion.Argentinisch]:  'Argentinisch',
  [DealTagsRegion.Afrikanisch]:   'Afrikanisch',
};

const DE_DealTagsType: DealTagsLocale<DealTagsType> = {
  [DealTagsType.Vegetarisch]:     'Vegetarisch',
  [DealTagsType.Vegan]:           'Vegan',
  [DealTagsType.Gesundes]:        'Gesundes',
  [DealTagsType.Gut_Buergerlich]: 'Gut Bürgerlich',
  //[DealTagsType.Low_Carb]:        'Low Carb',
  [DealTagsType.Bio]:             'Bio',
  [DealTagsType.Glutenfrei]:      'Glutenfrei',
  [DealTagsType.Laktosefrei]:     'Laktosefrei',
  [DealTagsType.Buffet]:          'Büfett',
  [DealTagsType.FastFood]:        'Fast Food',
  [DealTagsType.Fruehstuck]:      'Frühstück',
  [DealTagsType.Mittagessen]:     'Mittagessen',
  [DealTagsType.Abendessen]:      'Abendessen',
};

const DE_DealTagsDrinks: DealTagsLocale<DealTagsDrinks> = {
  [DealTagsDrinks.Cocktails]:  'Cocktails',
  [DealTagsDrinks.Coffee]:     'Kaffee',
  [DealTagsDrinks.Tea]:        'Tee',
  [DealTagsDrinks.Wine]:       'Wein',
  [DealTagsDrinks.Beer]:       'Bier',
  [DealTagsDrinks.Softdrinks]: 'Softdrinks',
  [DealTagsDrinks.Water]:      'Wasser',
};

const DE_AllDealTags: DealTagsLocale<DealTagsDish | DealTagsRegion | DealTagsType | DealTagsDrinks> = {
  ...DE_DealTagsDish,
  ...DE_DealTagsRegion,
  ...DE_DealTagsType,
  ...DE_DealTagsDrinks,
};

export const DE = {
  common:  {
    words:  {
      cancel:   'Abbrechen',
      continue: 'Weiter',
      close:    'Schließen',
      phone:    'Telefon',
      daily:    'Täglich',
      email:    'E-Mail',
    },
    errors: {
      autoCompleteError:    'Leider konnten wir die eingegebene Addresse nicht finden. Bitte wählen Sie eine aus den Vorschlägen',
      mapClickAddressError: 'Leider konnten wir an dieser Stelle keine Addresse finden',
    },
  },
  company: {
    prefix: {
      [CompanyType.RESTAURANT]: 'Mein',
      [CompanyType.CAFE]:       'Mein',
      [CompanyType.IMBISS]:     'Mein',
      [CompanyType.FOODTRUCK]:  'Mein',
      [CompanyType.BAR]:        'Meine',
      [CompanyType.RETAIL]:     'Mein',
    },
    types:  {
      [CompanyType.RESTAURANT]: 'Restaurant',
      [CompanyType.CAFE]:       'Café',
      [CompanyType.IMBISS]:     'Imbiss',
      [CompanyType.FOODTRUCK]:  'Food Truck',
      [CompanyType.BAR]:        'Bar',
      [CompanyType.RETAIL]:     'Einzelhandel',
    },
  },
  format:  {
    timestamp(timestamp: number): string {
      return dayjs(timestamp).format(timeFormatString);
    },
    date(timestamp: number): string {
      return dayjs(timestamp).format('DD. MMMM YYYY');
    },
    dateTime(timestamp: number): string {
      return dayjs(timestamp).format('DD.MM.YYYY HH:mm');
    },
    time(timestamp: number): string {
      return dayjs(timestamp).format(timeFormatString);
    },
    dayRange(startDayOfWeek: number, endDayOfWeek: number): string {
      const startMoment = dayjs().day(startDayOfWeek);
      const endMoment   = dayjs().day(endDayOfWeek);

      return `${startMoment.format('dddd')} – ${endMoment.format('dddd')}`;
    },
    currency(valueInCents: number): string {
      return (valueInCents / 100).toFixed(2).replace('.', ',');
    },
  },
  tags:    {
    label:          'Kategorien',
    labelApp:       'Italienisch? Vegan? Wählen Sie was Sie wollen!',
    placeholder:    'Suche ...',
    minTags:        'Bitte wählen Sie mindestens 1 Tag aus',
    maxTags:        'Höchstens 5 Kategorien',
    DealTagsDish:   {
      header: 'Gericht',
      values: DE_DealTagsDish,
    },
    DealTagsRegion: {
      header: 'Küche',
      values: DE_DealTagsRegion,
    },
    DealTagsType:   {
      header: 'Typ',
      values: DE_DealTagsType,
    },
    DealTagsDrinks: {
      header: 'Getränke',
      values: DE_DealTagsDrinks,
    },
  },
  deals:   {
    table: {
      labels: {
        time:               'Datum',
        type:               'Typ',
        tags:               'Küche',
        minimumPersonCount: 'Min. Personen',
        discountPercent:    'Rabatt',
        originalPrice:      'Urspr. Preis',
        discountPrice:      'Dein Preis',
      },
      dealTime(start: Timestamp, end: Timestamp): string {
        return `${DE.format.date(start)} von ${DE.format.time(start)} bis ${DE.format.time(end)} Uhr`;
      },
      from:   'von',
      till:   'bis',
      tags:   DE_AllDealTags,
    },
  },
  market:  {
    types: {
      [MarketType.WEEKLY_MARKET]: 'Wochenmarkt',
      [MarketType.FAIR]:          'Messe',
      [MarketType.FOOD_FESTIVAL]: 'Food Festival',
    },
  },
};

// EN

const EN_DealTagsDish: DealTagsLocale<DealTagsDish> = {
  [DealTagsDish.Burger]:         'Burger',
  [DealTagsDish.Sushi]:          'Sushi',
  [DealTagsDish.Pizza]:          'Pizza',
  [DealTagsDish.Salat]:          'Salads',
  [DealTagsDish.Doener]:         'Kebab',
  [DealTagsDish.Pasta]:          'Pasta',
  [DealTagsDish.Steak]:          'Steak',
  [DealTagsDish.Meeresfruechte]: 'Seafood',
  //[DealTagsDish.Fisch]:          'Fish',
  [DealTagsDish.Kuchen]:         'Cake',
  //[DealTagsDish.Sandwich]:       'Sandwich',
  [DealTagsDish.Currywurst]:     'Currywurst',
  [DealTagsDish.Pommes]:         'Fries',
  [DealTagsDish.Falafel]:        'Falafel',
  [DealTagsDish.Teigtaschen]:    'Dumplings',
  [DealTagsDish.Bowl]:           'Bowl',
};

const EN_DealTagsRegion: DealTagsLocale<DealTagsRegion> = {
  [DealTagsRegion.Italienisch]:   'Italian',
  [DealTagsRegion.Mexikanisch]:   'Mexican',
  [DealTagsRegion.Mediterran]:    'Mediterranean',
  [DealTagsRegion.Asiatisch]:     'Asian',
  [DealTagsRegion.Griechisch]:    'Greek',
  [DealTagsRegion.Indisch]:       'Indian',
  [DealTagsRegion.Japanisch]:     'Japanese',
  [DealTagsRegion.Tuerkisch]:     'Turkish',
  [DealTagsRegion.Deutsch]:       'German',
  [DealTagsRegion.Belgisch]:      'Belgian',
  [DealTagsRegion.Vietnamesisch]: 'Vietnamese',
  [DealTagsRegion.Franzoesisch]:  'French',
  [DealTagsRegion.Amerikanisch]:  'American',
  [DealTagsRegion.Persisch]:      'Persian',
  [DealTagsRegion.Chinesisch]:    'Chinese',
  [DealTagsRegion.Libanesisch]:   'Lebanese',
  [DealTagsRegion.Argentinisch]:  'Argentinian',
  [DealTagsRegion.Afrikanisch]:   'African',
};

const EN_DealTagsType: DealTagsLocale<DealTagsType> = {
  [DealTagsType.Vegetarisch]:     'Vegetarian',
  [DealTagsType.Vegan]:           'Vegan',
  [DealTagsType.Gesundes]:        'Healthy',
  [DealTagsType.Gut_Buergerlich]: 'Traditional',
  //[DealTagsType.Low_Carb]:        'Low carb',
  [DealTagsType.Bio]:             'Organic',
  [DealTagsType.Glutenfrei]:      'Gluten free',
  [DealTagsType.Laktosefrei]:     'Lactose free',
  [DealTagsType.Buffet]:          'Buffet',
  [DealTagsType.FastFood]:        'Fast Food',
  [DealTagsType.Fruehstuck]:      'Breakfast',
  [DealTagsType.Mittagessen]:     'Lunch',
  [DealTagsType.Abendessen]:      'Dinner',
};

const EN_DealTagsDrinks: DealTagsLocale<DealTagsDrinks> = {
  [DealTagsDrinks.Cocktails]:  'Cocktails',
  [DealTagsDrinks.Coffee]:     'Coffee',
  [DealTagsDrinks.Tea]:        'Tea',
  [DealTagsDrinks.Wine]:       'Wine',
  [DealTagsDrinks.Beer]:       'Beer',
  [DealTagsDrinks.Softdrinks]: 'Soft Drinks',
  [DealTagsDrinks.Water]:      'Water',
};

const EN_AllDealTags: DealTagsLocale<DealTagsDish | DealTagsRegion | DealTagsType | DealTagsDrinks> = {
  ...EN_DealTagsDish,
  ...EN_DealTagsRegion,
  ...EN_DealTagsType,
  ...EN_DealTagsDrinks,
};

export const EN = {
  common:  {
    words:  {
      cancel:   'cancel',
      continue: 'continue',
      daily:    'Daily',
      close:    'close',
      phone:    'phone',
      email:    'email',
    },
    errors: {
      autoCompleteError:    'We could not find the entered address. Please select one from the dropdown',
      mapClickAddressError: 'We could not find any address at the point clicked',
    },
  },
  company: {
    prefix: {
      [CompanyType.RESTAURANT]: 'My',
      [CompanyType.CAFE]:       'My',
      [CompanyType.IMBISS]:     'My',
      [CompanyType.FOODTRUCK]:  'My',
      [CompanyType.BAR]:        'My',
      [CompanyType.RETAIL]:     'My',
    },
    types:  {
      [CompanyType.RESTAURANT]: 'Restaurant',
      [CompanyType.CAFE]:       'Café',
      [CompanyType.IMBISS]:     'Snack Bar',
      [CompanyType.FOODTRUCK]:  'Food Truck',
      [CompanyType.BAR]:        'Bar',
      [CompanyType.RETAIL]:     'Retail',
    },
  },
  format:  {
    timestamp(timestamp: number): string {
      return dayjs(timestamp).format(timeFormatString);
    },
    date(timestamp: number): string {
      return dayjs(timestamp).format('DD. MMMM YYYY');
    },
    dateTime(timestamp: number): string {
      return dayjs(timestamp).format('DD.MM.YYYY HH:mm');
    },
    time(timestamp: number): string {
      return dayjs(timestamp).format(timeFormatString);
    },
    dayRange(startDayOfWeek: number, endDayOfWeek: number): string {
      const startMoment = dayjs().day(startDayOfWeek);
      const endMoment   = dayjs().day(endDayOfWeek);

      return `${startMoment.format('dddd')} – ${endMoment.format('dddd')}`;
    },
    currency(valueInCents: number): string {
      return (valueInCents / 100).toFixed(2).replace('.', ',');
    },
  },
  tags:    {
    label:          'Categories',
    labelApp:       'Italian? Vegan? Choose what you want!',
    placeholder:    'Search …',
    minTags:        'Please choose at least 1 tag',
    maxTags:        'A maximum of 5 tags may be chosen',
    DealTagsDish:   {
      header: 'Dish',
      values: EN_DealTagsDish,
    },
    DealTagsRegion: {
      header: 'Cuisine',
      values: EN_DealTagsRegion,
    },
    DealTagsType:   {
      header: 'Type',
      values: EN_DealTagsType,
    },
    DealTagsDrinks: {
      header: 'Drinks',
      values: EN_DealTagsDrinks,
    },
  },
  deals:   {
    table: {
      labels: {
        time:               'Time',
        type:               'Type',
        tags:               'Kitchen',
        minimumPersonCount: 'Min. People',
        discountPercent:    'Discount',
        originalPrice:      'Original Price',
        discountPrice:      'Your Price',
      },
      dealTime(start: Timestamp, end: Timestamp): string {
        return `${EN.format.date(start)} from ${EN.format.time(start)} to ${EN.format.time(end)}`;
      },
      from:   'from',
      till:   'to',
      tags:   EN_AllDealTags,
    },
  },
  market:  {
    types: {
      [MarketType.WEEKLY_MARKET]: 'Wochenmarkt',
      [MarketType.FAIR]:          'Messe',
      [MarketType.FOOD_FESTIVAL]: 'Food Festival',
    },
  },
};

dayjs.locale('de');
export let locale = DE;

if (IS_SERVER === false && !window.navigator.language.startsWith('de')) {
  dayjs.locale('en');
  locale = EN;
}

overrideLocale(
  () => {
    locale = DE;
    dayjs.locale('de');
  },
  () => {
    locale = EN;
    dayjs.locale('en');
  });

/*
 const EN_old = {
 format: {
 timestamp: function(timestamp: number) {
 let date = new Date(timestamp);
 return 'xxx';//date.toLocaleDateString('en-US') + '\n' + date.toLocaleTimeString('en-US');
 },
 date:      function(timestamp: number): string {
 let date = new Date(timestamp);
 return 'xxx';//date.toLocaleDateString('en-US');
 },
 time:      function(timestamp: number): string {
 let date = new Date(timestamp);
 return 'xxx';//date.toLocaleTimeString('en-US');
 },
 currency:  function(valueInCents: number): string {
 return 'xxx';//(valueInCents / 100).toFixed(2);
 },
 },
 };
 */
