/* eslint-disable @typescript-eslint/unbound-method */

import { overrideLocale }             from '@my-old-startup/common/common/locales';
import { DateFilter }                 from '@my-old-startup/common/enums/types';
import {
  IS_IOS,
  IS_SERVER,
}                                     from '@my-old-startup/frontend-common/constants';
import * as commonLocales             from '@my-old-startup/frontend-common/locales';
import dayjs                          from 'dayjs';
import calendar                       from 'dayjs/plugin/calendar';
import { IApiCompanyContactWithCity } from '../../../common/interfaces';
import { UpdateEvent }                from '../components/common/UpdateMessage';

dayjs.extend(calendar);
/* tslint:disable:max-line-length */

const iOSPlatformName = !IS_IOS
  ? ''
  : navigator.platform.includes('iPhone')
    ? 'iPhone'
    : navigator.platform.includes('iPad')
      ? 'iPad'
      : 'iOS device';

/**
 * Calculate the day after tomorrow
 * @param formatString: function which takes the localized day name and returns the fully localized string
 */
const calcDayAfterTomorrow = (
  formatString: (dayString: string) => string,
): string => {
  const today     = dayjs();
  const targetDay = (today.day() + 2) % 7;
  return formatString(
    dayjs()
      .day(targetDay)
      .format('dddd'),
  );
};

const DE = {
  name:           'de',
  common:         {
    cologne:        'Köln',
    weekday:        {
      monday:    'Montag',
      tuesday:   'Dienstag',
      wednesday: 'Mittwoch',
      thursday:  'Donnerstag',
      friday:    'Freitag',
      saturday:  'Samstag',
      sunday:    'Sonntag',
    },
    holidayHint:    'Öffnungszeiten können an Feiertagen abweichen',
    date:           {
      days:              'Tage',
      hours:             'Stunden ',
      minutes:           'Minuten',
      lessThanOneMinute: 'weniger als einer Minute',
      over:              'Leider verpasst',
    },
    dateFilter:     {
      [DateFilter.TODAY]:        'Für Heute',
      [DateFilter.TOMORROW]:     'Für Morgen',
      [DateFilter.REST_OF_WEEK]: calcDayAfterTomorrow(
        dayString => `Ab ${dayString}`,
      ),
    },
    coronaMessage:  {
      header: 'Corona Krisenhilfe für Gastronomen',
      text:   'Ab sofort seht ihr bei uns ausschließlich Informationen bezüglich Lieferung, Abholung und Gutscheinen für Gastronomen in eurer Nähe. Nach der Corona-Krise werden euch wieder wie gewohnt Neuheiten und Deals der Gastronomie in eurer Umgebung angezeigt.',
    },
    privacyMessage: {
      accept:        'Akzeptieren',
      onlyNecessary: 'Nur notwendige',
      header:        'Diese Webseite verwendet Cookies',
      text:          'Um unsere Webseiten für Sie optimal zu gestalten und fortlaufend zu verbessern, verwenden wir Cookies. Durch Bestätigen des Buttons "Akzeptieren" stimmen Sie der Verwendung zu. Über den Button "Nur notwendige" können Sie die Nutzung auf jene Cookies beschränken, die technisch notwendig sind um die Seite zu nutzen. Weitere Informationen erhalten Sie in unseren <a href="https://www.my-old-startups-domain.de/datenschutz/" target="_blank">Datenschutzhinweisen.</a><br>.',
    },
    offlineMessage: 'Keine Internetverbindung. Bitte prüfe deine Verbindung.',
    updateMessage:  {
      [UpdateEvent.IS_UPDATE_READY]:
                                 'Die Seite wird automatisch aktualisiert.',
      [UpdateEvent.IS_UPDATING]: 'Die Seite wird automatisch aktualisiert.',
      [UpdateEvent.HAS_UPDATED_FINISHED]:
                                 'Die Seite wird automatisch aktualisiert.',
      [UpdateEvent.HAS_UPDATE_FAILED]:
                                 'Bitte aktualisiere die Seite.',
      [UpdateEvent.OFFLINE]:
                                 'Das Gerät ist offline. Es liegen keine aktuellen Daten vor.',
    },
  },
  error: {
    page:             {
      header:         'Ein Fehler ist aufgetreten',
      body:           'Es tut uns leid aber es ist ein Fehler aufgetreten. Der Fehler wurde protokolliert und wird schnellstmöglich behoben.',
      restart:        'Neu starten',
      contactSupport: 'Fehler melden',
    },
    defaultErrorMessage:
                      'Leider ist ein technisches Problem aufgetreten. Bitte versuche es später noch einmal.',
    nothingFound:
                      'Wir konnten unter dieser Adresse nichts finden, bitte versuche es erneut.',
    shareToClipboard: 'Der Link konnte leider nicht kopiert werde.',
    share:            'Der Link konnte leider nicht geteilt werde.',
    geoLocationPermission:
                      'Bitte erlaube der App deine Position zu bestimmen.',
    geoLocationNotAvailable:
                      'Bitte erlaube der App deine Position zu bestimmen.',
    orientationWarning:
                      'Die Seite ist nicht für die horizontale Ansicht optimiert. Bitte drehe das Gerät oder sperre die Rotation',
  },
  format:         {
    address: (contact: Pick<IApiCompanyContactWithCity, 'address' | 'zipCode' | 'city'>): string =>
               `${contact.address}, ${contact.zipCode} ${contact.city}`,
    dealTime:      (from: number, to: number): string => {
      const until = dayjs(to).format('HH.mm') + ' Uhr';

      return dayjs(from).calendar(undefined, {
        sameDay:  `[Heute] HH.mm [- ${until}]`,
        nextDay:  `[Morgen] HH.mm [- ${until}]`,
        nextWeek: `dddd HH.mm [- ${until}]`,
        lastDay:  '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: `DD/MM/YYYY HH:mm [- ${until}]`,
      });
    },
    countDownChip: {
      active: (countDown: string, small: boolean | undefined): string =>
                small ? `Noch ${countDown}` : `Läuft noch ${countDown}`,
      future: (countDown: string): string => `Startet in ${countDown}`,
    },
    newsDateChip:  {
      soon: (countDown: string): string => `ab dem ${countDown}`,
    },
    timestamp:     commonLocales.DE.format.timestamp,
    time:          commonLocales.DE.format.time,
    date:          commonLocales.DE.format.date,
    currency:      commonLocales.DE.format.currency,
  },
  appBar:         {
    header: 'my-old-startups-domain',
  },
  drawer:         {
    items: {
      search:  'Suche',
      app:     'App installieren',
      filter:  'Filter',
      faq:     'FAQ',
      home:    'Home',
      privacy: 'Datenschutz',
      terms:   'Nutzungsbedingungen',
      legal:   'Impressum',
    },
  },
  search:         {
    input:       'Suche nach Adresse, Ort usw.',
    coordinates: (lat: number, lng: number) => `Markieung bei ${lat},${lng}`,
    surrounding: '(In der deiner Nähe)',
    noResults:   'Keine Ergebnisse',
    noResultsBodyCorona:
                 'Wir konnten leider keine Ergebnisse in deiner Nähe finden. Hast du vielleicht schon Filter gesetzt? Versuche es doch noch einmal mit anderen Filtern oder starte eine neue Suche.',
    noResultsBody:
                 'Wir konnten leider keine Ergebnisse in deiner Nähe finden. Hast du vielleicht schon Filter gesetzt? Versuche es doch noch einmal mit anderen Filtern oder schaue in unserer Heimatstadt Köln vorbei.',
    noDealResultsBody:
                 'Wir konnten leider keine Ergebnisse in deiner Nähe finden. Versuche es doch noch einmal mit anderen Filtern oder suche Deals für morgen oder später.',
    suggestions: {
      back:      'Zurück zu den Ergebnissen',
      //Corona
      newFilter: 'Neue Suche',
      nrw:       'Ganz NRW',
      filter:    'Mehr Filter',
      location:  {
        primary:   'Umgebungssuche',
        secondary: 'Finde Deals in deiner Umgebung',
      },
    },
    tabs: {
      list:      'Liste',
      deals:     'Deals',
      companies: 'Gastronomen',
      markets:   'Märkte',
      map:       'Karte',
      filter:    'Filter',
      news:      'Neuheiten',
      account:   'Account',
      // CORONA
      reopen:    'Wieder geöffnet',
      delivery:  'Lieferung',
      takeAway:  'Abholung',
      retail:    'Einzelhandel',
      coupons:   'Gutscheine',
      donation:  'Spenden',
    },
  },
  sharing:        {
    copyToClipboard: (title: string) =>
                       `Link zu "${title}" wurde in die Zwischenablage kopiert`,
    share:           (title: string) => `Link zu "${title}" wurde geteilt`,
  },
  phone:          {
    selectPhoneNumber: 'Wähle eine Telefonnummer',
  },
  deal:           {
    reservationRequiredHtml: 'Reservierung<br/>notwendig',
  },
  claimView:      {
    text: 'Du bestellst und zahlst ganz einfach wie gewohnt vor Ort. Bitte gib den untenstehenden Code bei deiner Bestellung an.',
    code: 'Dein Deal Code',
  },
  listView:       {
    card: {
      details:             'Weitere Infos',
      less:                'Weniger',
      toDeal:              'Navigation',
      back:                'Zurück',
      toDealDetails:       'Details',
      toDealClaim:         'Deal schnappen',
      toDealCompany:       'Restaurant',
      // CORONA
      //toCompanyDeals:      'Zu den Deals',
      toCompanyDeals:      'Zurück',
      toMarkets:           'Zu den Märkten',
      discount_whole_bill: 'auf Alles',
      discount:            'Ersparnis',
      discount2For1:       '2 für 1 Deal',
      specials:            {
                             'NEW':     'Neues Gericht',
                             'SPECIAL': 'Special',
                             'DAILY':   'Gericht des Tages',
                             'WEEKLY':  'Gericht der Woche',
                             'MONTHLY': 'Gericht des Monats',
                           } as { [index: string]: string },
      specialMenu:         {
                             'DAILY':   'Tageskarte',
                             'WEEKLY':  'Wochenkarte',
                             'MONTHLY': 'Monatskarte',
                           } as { [index: string]: string },
    },
    filter: {
      backToToday: {
        header:    'Auf der Suche nach Neuem?',
        subheader: 'Hier gehts zu den Deals von heute',
      },
      today:       {
        header:    'Heute nichts gefunden?',
        subheader: 'Hier gehts zu den Deals von morgen',
      },
      tomorrow:    {
        header:    'Auch morgen nichts dabei?',
        subheader: 'Schau dir die restliche Woche an!',
      },
      wholeWeek:   {
        header:    'Nichts passendes gefunden?',
        subheader: 'Filtere nach genau dem was du suchst',
      },
    },
  },
  restaurantView: {
    address:                'Adresse',
    openingHours:           'Öffnungszeiten',
    tags:                   'Wir bieten euch',
    menu:                   'Speisekarte',
    closed:                 'Geschlossen',
    contact:                'Kontakt',
    socialMedia:            'Social Media',
    corona:                 'Hilfe in Coronazeiten',
    coronaHeader:           'Unser aktueller Service',
    dishHeader:             'Top Gerichte',
    acceptsDonationsHeader: 'Spenden',
    donationLinkLabel:      'Spendenlink',
    offersReopenHeader:     'Wieder geöffnet',
    openRestriction:        {
      indoor:               'Innenbereich',
      outdoor:              'Außenbereich',
      inoutdoor:            'Innen- und Außenbereich',
      reservationNecessary: 'Reservierung notwendig',
      reservationPreferred: 'Reservierung bevorzugt',
      reservationPhone:     'Telefon',
      maxPersonCount:       (count: string) => `Maximal ${count} Personen pro Gruppe`,
      maxStayTime:          (count: string) => `Maximal ${(count || '0').replace('.', ',')} Stunden Aufenthalt`,
    },
    offersDeliveryHeader:   'Lieferung',
    offersTakeAwayHeader:   'Abholung',
    offersCouponsHeader:    'Gutscheine',
    couponLinkLabel:        'Gutscheinlink',
  },
  mapView:        {
    further: (count: number) => `und ${count} weitere`,
    marker:  {
      searchLocation: 'Suchadresse',
      yourLocation:   'Dein Standort',
    },
  },
  filterView:     {
    header:          {
      title:     'Ergebnisse einschränken',
      subheader: 'Sieh nur das, was du sehen willst',
      apply:     'Jetzt suchen',
    },
    filters:         {
      date:        {
        title:    'Wann suchst du Deals?',
        today:    'Heute',
        tomorrow: 'Morgen',
        week:     calcDayAfterTomorrow(dayString => `Ab ${dayString}`),
      },
      companyType: {
        title: 'Was suchst du?',
      },
      tags:        {
        title: 'Worauf hast du Lust?',
      },
    },
    buttons:         {
      choose: 'Auswählen',
      apply:  'Anwenden',
      reset:  'Zurücksetzen',
      abort:  'Abbrechen',
    },
    dialog:          {
      dirty: {
        title: 'Filter anwenden?',
        text:  'Du hast haben die Filter angepasst. Möchtest du sie jetzt anwenden?',
      },
    },
    tagPickerDrawer: {
      save: 'Fertig',
    },
  },
  list:           {
    back: 'Zurück zur Karte',
  },
  install:        {
    installSuccess:
                  'Fertig! Jetzt kannst du die App von deinem Startbildschirm aus starten!',
    installAbort:
                  'Du kannst die App auch später installieren. Wie, findest du links im Menü!',
    installError: 'Leider gab es einen Fehler.',
    android:      {
      subheading: 'So installierst du die App auf deinem Android Smartphone',
      body:       {
        openMenu:   'Öffne das Menü',
        andTap:     'Wähle Startbildschirm zufügen',
        andTapHtml: 'Wähle <strong>Zum Startbildschirm zufügen</strong>',
      },
    },
    iPhone:       {
      subheading: `So installierst du die App auf deinem ${iOSPlatformName}`,
      body:       {
        tapShare:          'Wähle teilen',
        andSelectHtml:     'und dann <strong>Zum Home-Bildschirm</strong>',
        finallyTapAddHtml: 'Zum Schluss drücke noch <strong>Hinzufügen</strong>',
      },
    },
  },
  landingPage:    {
    bullets: {
      first:  'Finde Deals',
      second: 'Gehe zur Location',
      third:  'Bestelle und bezahle wie gewohnt vor Ort',
    },
    links:   {
      aboutUs:       'Über uns',
      becomePartner: 'Partner werden',
    },

  },
};

const EN = {
  name:           'en',
  common:         {
    cologne:        'Cologne',
    weekday:        {
      monday:    'Monday',
      tuesday:   'Tuesday',
      wednesday: 'Wednesday',
      thursday:  'Thursday',
      friday:    'Friday',
      saturday:  'Saturday',
      sunday:    'Sunday',
    },
    holidayHint:    'opening hours on public holiday may differ',
    special:        'Special',
    date:           {
      days:              'days',
      hours:             'hours ',
      minutes:           'minutes',
      lessThanOneMinute: 'less than a minute',
      over:              'Sadly, you missed this',
    },
    dateFilter:     {
      [DateFilter.TODAY]:        'For Today',
      [DateFilter.TOMORROW]:     'For Tomorrow',
      [DateFilter.REST_OF_WEEK]: calcDayAfterTomorrow(
        dayString => `${dayString} onwards`,
      ),
    },
    coronaMessage:  {
      header: 'Corona Crisis Help for Restaurants',
      text:   'From now on we will only show you information about deliveries, takeout and coupons from restaurants, cafés and similar businesses around you. After the corona crisis we will show you news and deals of your favourite restaurants as we used to.',
    },
    privacyMessage: {
      accept:        'Accept',
      onlyNecessary: 'Only necessary',
      header:        'This website uses cookies',
      text:
                     'This website uses cookies to ensure you get the best experience on our website. By clicking "Accept" agree to the use of cookies. If you want to limit the use of cookies to those that are technically necessary click "Only necessary".  Learn more about our use of cookies in our <a href="https://www.my-old-startups-domain.de/datenschutz/" target="_blank">Privacy Policy</a>',
    },
    offlineMessage: 'No internet connection. Please check your connection.',
    updateMessage:  {
      [UpdateEvent.IS_UPDATE_READY]:
                                 'An update is available and will be installed',
      [UpdateEvent.IS_UPDATING]: 'Update in progress…',
      [UpdateEvent.HAS_UPDATED_FINISHED]:
                                 'Update completed. The page will be updated automatically',
      [UpdateEvent.HAS_UPDATE_FAILED]:
                                 'The update failed to install. Please refresh the page to see changes',
      [UpdateEvent.OFFLINE]:
                                 'Your device is offline. Previously loaded data will still be available',
    },
  },
  error: {
    page:                    {
      header:         'An Error Occurred',
      body:           'We\'re so sorry but an error occured. The error was logged and will be fixed soon.',
      restart:        'Restart',
      contactSupport: 'Contact support',
    },
    defaultErrorMessage:     'A technical error occurred. Please try again later.',
    nothingFound:
                             'We could not find anything at this address. Pelase try again.',
    shareToClipboard:        'Could not copy the link to the clipboard',
    share:                   'Could not share the link',
    geoLocationPermission:   'Please allow the app to determine your location',
    geoLocationNotAvailable: 'Please allow the app to determine your location',
    orientationWarning:
                             'The app is not optimized for landscape view. Please rotate your device or lock screen orientation',
  },
  format:         {
    address: (contact: Pick<IApiCompanyContactWithCity, 'address' | 'zipCode' | 'city'>): string =>
                     `${contact.address}, ${contact.zipCode} ${contact.city}`,
    dealTime:      (from: number, to: number): string => {
      const until = dayjs(to).format('HH:mm');

      return dayjs(from).calendar(undefined, {
        sameDay:  `[Today] [from] HH:mm [to] [${until}]`,
        nextDay:  `[Tomorrow] [from] HH:mm [to] [${until}]`,
        nextWeek: `dddd [from] HH:mm [to] [${until}]`,
        lastDay:  '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: `DD/MM/YYYY [from] HH:mm [to] [${until}]`,
      });
    },
    countDownChip: {
      active: (countDown: string, small: boolean | undefined): string =>
                small ? `For ${countDown}` : `Available for ${countDown}`,
      future: (countDown: string): string => `Starts in ${countDown}`,
    },
    newsDateChip:  {
      soon: (countDown: string): string => `from ${countDown}`,
    },
    timestamp:     commonLocales.EN.format.timestamp,
    time:          commonLocales.EN.format.time,
    date:          commonLocales.EN.format.date,
    currency:      commonLocales.EN.format.currency,
  },
  appBar:         {
    header: 'my-old-startups-domain',
  },
  drawer:         {
    items: {
      search:  'Search',
      app:     'Install App',
      filter:  'Filter',
      faq:     'FAQ',
      home:    'Home',
      privacy: 'Privacy',
      terms:   'Terms and Condition',
      legal:   'Legal',
    },
  },
  search:         {
    input:       'Search for address, landmark etc.',
    surrounding: '(Near me)',
    coordinates: (lat: number, lng: number) => `Marker at ${lat},${lng}`,
    noResults:   'No results',
    noResultsBodyCorona:
                 'We couldn\'t find any results near you. Have you set filters already? Explore other filter options or start a new search.',
    noResultsBody:
                 'We couldn\'t find any results near you. Have you tried our filter function already? Explore other filter options or have a look in our hometown of Cologne.',
    noDealResultsBody:
                 'We couldn\'t find any results near you. Try other filter options or have a look tomorrows deals or later this week.',
    suggestions: {
      back:      'Back to the results',
      newFilter: 'New Search',
      nrw:       'Whole NRW',
      filter:    'More filters',
      location:  {
        primary:   'Location search',
        secondary: 'Find deals next to you',
      },
    },
    tabs: {
      list:      'List',
      deals:     'Deals',
      companies: 'Partners',
      markets:   'Markets',
      map:       'Map',
      filter:    'Filter',
      news:      'News',
      account:   'Account',
      // CORONA
      reopen:    'Reopened',
      delivery:  'Delivery',
      takeAway:  'TakeOut',
      retail:    'Retail',
      coupons:   'Coupons',
      donation:  'Donation',
    },
  },
  sharing:        {
    copyToClipboard: (dealTitle: string) =>
                       `Link to "${dealTitle}" copied to clipboard`,
    share:           (dealTitle: string) => `Link to "${dealTitle}" was shared`,
  },
  phone:          {
    selectPhoneNumber: 'Select a phone number',
  },
  deal:           {
    reservationRequiredHtml: 'Reservation<br/>required',
  },
  claimView:      {
    text: 'You can easily order and pay locally as you are used to. Please show the code below while ordering.',
    code: 'Your Deal Code',
  },
  listView:       {
    card: {
      details:             'More infos',
      less:                'Less',
      toDeal:              'Directions',
      back:                'Back',
      toDealDetails:       'Details',
      toDealClaim:         'Claim Deal',
      toDealCompany:       'Restaurant',
      //CORONA
      //toCompanyDeals:      'Show Deals',
      toCompanyDeals:      'Back',
      toMarkets:           'To the markets',
      discount:            'discount',
      discount_whole_bill: 'off everything',
      discount2For1:       '2 for 1 Deal',
      specials:            {
        'NEW':     'New Dish',
        'SPECIAL': 'Special',
        'DAILY':   'Dish of the day',
        'WEEKLY':  'Dish of the week',
        'MONTHLY': 'Dish of the month',
      },
      specialMenu:         {
                             'DAILY':   'Daily menu',
                             'WEEKLY':  'Weekly menu',
                             'MONTHLY': 'Monthly menu',
                           } as { [index: string]: string },

    },
    filter: {
      backToToday: {
        header:    'Looking for fresh deals?',
        subheader: 'Have a look at today\'s deals',
      },
      today:       {
        header:    'Didn\'t find anything today?',
        subheader: 'Have a look at tomorrow\'s deals',
      },
      tomorrow:    {
        header:    'Didn\'t find anything tomorrow?',
        subheader: 'Have a look at the rest of the weeks deals',
      },
      wholeWeek:   {
        header:    'Didn\'t find anything?',
        subheader: 'Filter what you are searching for here',
      },
    },
  },
  restaurantView: {
    address:                'Address',
    openingHours:           'Opening hours',
    closed:                 'Closed',
    tags:                   'We offer',
    menu:                   'Menu',
    contact:                'Contact',
    socialMedia:            'Social Media',
    corona:                 'Help in times of Corona',
    coronaHeader:           'Our current service',
    dishHeader:             'Top dishes',
    acceptsDonationsHeader: 'Donations',
    donationLinkLabel:      'Donations link',
    offersReopenHeader:     'Reopened',
    openRestriction:        {
      indoor:               'Indoor',
      outdoor:              'Outdoor',
      inoutdoor:            'In- and outdoor',
      reservationNecessary: 'Reservation mandatory',
      reservationPreferred: 'Reservation preferred',
      reservationPhone:     'Phone',
      maxPersonCount:       (count: string) => `A maximum of ${count} people per group`,
      maxStayTime:          (count: string) => `A maximum of ${(count || '0').replace(',', '.')} hours per stay`,
    },
    offersDeliveryHeader:   'Delivery',
    offersTakeAwayHeader:   'TakeOut',
    offersCouponsHeader:    'Coupons',
    couponLinkLabel:        'Coupon link',
  },
  mapView:        {
    further: (count: number) => `and ${count} more ...`,
    marker:  {
      searchLocation: 'Search address',
      yourLocation:   'Your position',
    },
  },
  filterView:     {
    header:          {
      title:     'Filter results',
      subheader: 'See only what you want to see',
      apply:     'Search now',
    },
    filters:         {
      date:        {
        title:    'When?',
        today:    'Today',
        tomorrow: 'Tomorrow',
        week:     calcDayAfterTomorrow(dayString => `${dayString} onwards`),
      },
      companyType: {
        title: 'What kind of place?',
      },
      tags:        {
        title: 'Popular tags',
      },
    },
    buttons:         {
      choose: 'Choose',
      apply:  'Apply',
      abort:  'Cancel',
      reset:  'Reset',
    },
    dialog:          {
      dirty: {
        title: 'Apply filters?',
        text:  'You changed the filters. Do you want to apply them now?',
      },
    },
    tagPickerDrawer: {
      save: 'Save',
    },
  },
  list:           {
    back: 'Back to the map',
  },
  install:        {
    installSuccess:
                  'Ready! Now you can open the app by tapping on the home screen icon',
    installAbort:
                  'You can install the app any time later. Your can find the instruction in the menu on the left',
    installError: 'Sadly, there was an error.',
    android:      {
      subheading: 'To install my-old-startups-domain on your Android phone',
      body:       {
        openMenu:   'Open the menu',
        andTap:     'and tap Add to Home Screen',
        andTapHtml: 'and tap <strong>Add to Home Screen</strong>',
      },
    },
    iPhone:       {
      subheading: `To install my.old.startup on your ${iOSPlatformName}`,
      body:       {
        tapShare:          'Tap share',
        andSelectHtml:     'then select <strong>Add to Home Screen</strong>',
        finallyTapAddHtml: 'finally, tap <strong>Add</strong>',
      },
    },
  },
  landingPage:    {
    bullets: {
      first:  'Find Deals',
      second: 'Go to Location',
      third:  'Order and pay on site as usual',
    },
    links:   {
      aboutUs:       'About us',
      becomePartner: 'Become partner',
    },

  },
};

dayjs.locale('de');
export let locale = DE;

if (
  !IS_SERVER && !window.navigator.language.startsWith('de')
) {
  dayjs.locale('en');
  locale = EN;
}

overrideLocale(
  () => {
    locale = DE;
    dayjs.locale('de');
  },
  () => {
    dayjs.locale('en');
    locale = EN;
  },
);
