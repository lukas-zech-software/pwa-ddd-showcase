import { Cities }                  from '../enums/cities';
import { getLengthConstraintText } from '../validation/utils';

export const DE = {
  cities:           {
                      [Cities.COLOGNE]: 'Köln',
                    } as { [index: string]: string },
  validationErrors: {
    common:         {
      actualLength: (constraint: any): string => {
        if (constraint && constraint.value) {
          return ` (aktuell ${constraint.value.length}).`;
        }

        return '.';
      },
    },
    apiContactForm: {
      subject:          {
        maxLength:
          'Bitte geben Sie einen E-Mail-Betreff ein, der nicht länger als 120 Zeichen ist.',
      },
      body:             {
        minLength:
          'Bitte geben Sie mindestens 10 Zeichen für den E-Mail-Text ein.',
        maxLength:
          'Bitte geben Sie nicht mehr als 1000 Zeichen für den E-Mail-Text ein.',
      },
      hasAcceptedTerms: {
        isBoolean:
          'Für die Bearbeitung Ihrer Anfrage benötigen wir Ihre Zustimmung.',
        equals:
          'Für die Bearbeitung Ihrer Anfrage benötigen wir Ihre Zustimmung.',
      },
    },
    apiDeal:        {
      value:       {
        originalValue: {
          isNumber: 'Bitte geben Sie den ursprüngliche Preis ein',
          isGreaterThan:
                    'Der ursprüngliche Preis muss höher als der Preis sein',
        },
        discountValue: {
          isNumber: 'Bitte geben Sie den Preis ein',
          isLessThan:
                    'Der Preis muss niedriger als der ursprüngliche Preis sein',
        },
      },
      description: {
        description: {
          isDefined:
            'Bitte geben Sie eine Beschreibung mit mindesten 10 Zeichen ein',
          minLength:
            'Bitte geben Sie eine Beschreibung mit mindesten 10 Zeichen ein',
          maxLength:
            'Bitte geben Sie eine Beschreibung mit höchstens 600 Zeichen ein',
        },
        title:       {
          isDefined: 'Bitte geben Sie einen Titel mit mindesten 10 Zeichen ein',
          minLength: 'Bitte geben Sie einen Titel mit mindesten 10 Zeichen ein',
          maxLength: 'Bitte geben Sie einen Titel mit höchstens 55 Zeichen ein',
        },
      },
      details:     {
        tags:               {
          isDefined:    'Bitte geben Sie mindestens 1 Tag an',
          isArray:      'Bitte geben Sie mindestens 1 Tag an',
          arrayMinSize: 'Bitte geben Sie mindestens 1 Tag an',
          arrayMaxSize: 'Bitte geben Sie nicht mehr als 3 Tags an',
          isIn:         (x: any) =>
                          `Bitte geben Sie nur gültige Tags an. "${
                            x.value
                          }" ist kein gültiger Tag`,
        },
        minimumPersonCount: {
          isNumber: 'Bitte geben Sie an, bis wann das Angebot gültig ist',
        },
      },
      location:    {
        isGeoPoint: 'Must be a valid geo point',
      },
      date:        {
        validFrom: {
          isNumber:   'Bitte geben Sie an, ab wann das Angebot gültig ist',
          isLessThan: 'Zeit muss vor Ende liegen',
          isFuture:   'Zeit muss in der Zukunft liegen',
        },
        validTo:   {
          isNumber:        'Bitte geben Sie an, bis wann das Angebot gültig ist',
          isGreaterThan:   'Zeit muss nach Start liegen',
          isMaxDifference: 'Ein Deal kann nicht länger als 24 Stunden sein',
          isMinDifference: 'Ein Deal kann nicht kürzer als 30 Minuten sein',
          isFuture:        'Zeit muss in der Zukunft liegen',
          overnightDealMax:
                           'Deals die über 2 Tage gehen, können bis maximal 6:00 Uhr morgens dauern',
        },
      },
    },
    apiCompany:     {
      contact: {
        surname:                  {
          length: () => `Bitte geben Sie einen Vornamen mit 2 - 50 Zeichen ein`,
        },
        lastName:                 {
          length: () =>
                    `Bitte geben Sie einen Nachnamen mit 2 - 50 Zeichen ein`,
        },
        title:                    {
          minLength: (x: any) =>
                       `Bitte geben Sie einen Namen mit 2 - 100 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Bitte geben Sie einen Namen mit 2 - 100 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
        },
        address:                  {
          minLength: 'Bitte geben Sie den Straßennamen und die Hausnummer und ggf. den Ort ein',
          matches:   'Bitte geben Sie den Straßennamen und die Hausnummer und ggf. den Ort ein',
        },
        zipCode:                  {
          minLength: 'Die Postleitzahl muss aus 5 Zahlen bestehen',
          matches:   'Die Postleitzahl muss aus 5 Zahlen bestehen',
        },
        telephone:                {
          minLength: 'Bitte geben Sie Ihre Telefonnummer ein',
        },
        secondaryTelephoneReason: {
          minLength: (x: any) =>
                       `Bitte geben Sie einen Grund mit 2 - 20 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Bitte geben Sie einen Grund mit 2 - 20 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
        },
        email:                    {
          isEmail:
            'Bitte geben Sie ihre E-Mail mit max. 120 Zeichen ein (zB. email@adresse.de)',
          maxLength:
            'Bitte geben Sie ihre E-Mail mit max. 120 Zeichen ein (zB. email@adresse.de)',
        },
        hasAcceptedTerms:         {
          isBoolean:
            'Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen und Datenschutzerklärung',
          equals:
            'Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen und Datenschutzerklärung',
        },
        companyType:              {
          isDefined: 'Bitte wählen Sie die Art Ihres Geschäfts',
        },
        website:                  {
          isUrl:
            'Bitte geben Sie eine URL mit max. 120 Zeichen ein (zB. www.url.de ohne http(s)://)',
          maxLength:
            'Bitte geben Sie eine URL mit max. 120 Zeichen ein (zB. www.url.de oder http(s)://)',
        },
      },
      details: {
        description: {
          minLength: (x: any) =>
                       `Bitte geben Sie eine Beschreibung mit 70 - 5000 Zeichen ein${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Bitte geben Sie eine Beschreibung mit 70 - 5000 Zeichen ein${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
        },
      },
      dishes:  {
        description: {
          minLength: (x: any) =>
                       `Bitte geben Sie eine Beschreibung mit 20 - 150 Zeichen ein${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Bitte geben Sie eine Beschreibung mit 20 - 150 Zeichen ein${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLine:   'Höchsten 2 Zeilen',
        },
        title:       {
          minLength: (x: any) =>
                       `Bitte geben Sie einen Namen mit 2 - 75 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Bitte geben Sie einen Namen mit 2 - 75 Zeichen ein${getLengthConstraintText(
                         x,
                       )}`,
        },

      },
      images:  {
        background: {
          isDefined: 'Bitte legen Sie ein Hintergrundbild fest',
        },
        logo:       {
          isDefined: 'Bitte laden Sie Ihr Logo hoch',
        },
      },
    },
    apiUser:        {
      userName:     {
        minLength: 'Bitte geben Sie einen Namen mit 3 - 100 Zeichen ein',
        maxLength: 'Bitte geben Sie einen Namen mit 3 - 100 Zeichen ein',
      },
      emailAddress: {
        isEmail:
          'Bitte geben Sie ihre E-Mail mit max. 120 Zeichen ein (zB. email@adresse.de)',
        maxLength:
          'Bitte geben Sie ihre E-Mail mit max. 120 Zeichen ein (zB. email@adresse.de)',
      },
    },
  },
};

export const EN = {
  cities:           {
    [Cities.COLOGNE]: 'Cologne',
  },
  validationErrors: {
    common:         {
      actualLength: (constraint: any): string => {
        if (constraint && constraint.value) {
          return ` (${constraint.value.length}) given`;
        }

        return '';
      },
    },
    apiContactForm: {
      subject:          {
        maxLength: 'Please enter a subject with 120 characters or fewer',
      },
      body:             {
        minLength: 'Please enter a body with at least 10 characters',
        maxLength: 'Please enter a body with 1000 characters or fewer',
      },
      hasAcceptedTerms: {
        isBoolean: 'We need your consent in order to process your request',
        equals:    'We need your consent in order to process your request',
      },
    },
    apiDeal:        {
      value:       {
        originalValue: {
          isNumber:      'Please enter the value of the deal',
          isGreaterThan: 'The original price must be higher than the price',
        },
        discountValue: {
          isNumber:   'Please enter the discount value of the deal',
          isLessThan: 'The price must be lower than the original price',
        },
      },
      description: {
        description: {
          isDefined: 'Please enter a description with at least 10 characters',
          minLength: 'Please enter a description with at least 10 characters',
          maxLength: 'Descriptions may not have more than 600 characters',
        },
        title:       {
          isDefined: 'Please enter a title with at least 10 characters',
          minLength: 'Please enter a title with at least 10 characters',
          maxLength: 'Titles may not have more than 160 characters',
        },
      },
      details:     {
        tags:               {
          isDefined:    'Please select at least 1 tag',
          isArray:      'Please select at least 1 tag',
          arrayMinSize: 'Please select at least 1 tag',
          arrayMaxSize: 'A maximum of 3 tags may be selected',
          isIn:         (x: any) => `Please enter a valid tag. "${x.value}" is not valid tag`,
        },
        minimumPersonCount: {
          isNumber:
            'Please select the minimum number of people to redeem this deal',
        },
      },
      location:    {
        isGeoPoint: 'Must be a valid geo point',
      },
      date:        {
        validFrom: {
          isNumber:   'Please enter when the deal is valid from',
          isLessThan: 'Time must be before the deal\'s end',
          isFuture:   'Time must be in the future',
        },
        validTo:   {
          isNumber:         'Please enter when the deal is valid to',
          isGreaterThan:    'Time must be after the deal\'s start',
          isMaxDifference:  'A deal may not last longer than 24 hours',
          isMinDifference:  'The deal must be at least 30 minutes long',
          isFuture:         'Time must be in the future',
          overnightDealMax: 'Overnight Deals cannot span beyond 6am',
        },
      },
    },
    apiCompany:     {
      contact: {
        surname:                  {
          length: () => `Please enter a surname between 2 and 50 characters`,
        },
        lastName:                 {
          length: () => `Please enter a last name between 2 and 50 characters`,
        },
        title:                    {
          minLength: (x: any) =>
                       `Please enter a name between 2 and 100 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Please enter a name between 2 and 100 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
        },
        address:                  {
          minLength: 'Please enter the street name and house number. Please select from the suggestions',
          matches:   'Please enter the street name and house number. Please select from the suggestions',
        },
        zipCode:                  {
          minLength: 'The zip code must be 5 characters long',
          matches:   'The zip code must be only numbers',
        },
        telephone:                {
          minLength: 'Please enter your phone number',
        },
        secondaryTelephoneReason: {
          minLength: (x: any) =>
                       `Please enter a reason between 2 and 20 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Please enter a reason between 2 and 20 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
        },
        email:                    {
          isEmail:   'Please enter a valid email address (e.g. email@adress.de)',
          maxLength: 'Email addresses may not be longer than 120 characters',
        },
        hasAcceptedTerms:         {
          isBoolean: 'Please accept the Terms & Conditions and Privacy Policy',
          equals:    'Please accept the Terms & Conditions and Privacy Policy',
        },
        companyType:              {
          isDefined: 'Please select the type of business which best fits you',
        },
        website:                  {
          isUrl:
            'Please enter a valid URL up to 120 characters (e.g. www.url.de without http(s)://)',
          maxLength:
            'Please enter a valid URL up to 120 characters (e.g. www.url.de without http(s)://)',
        },
      },
      details: {
        description: {
          minLength: (x: any) =>
                       `Please enter a description between 70 and 5000 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Please enter a description between 70 and 5000 characters${EN.validationErrors.common.actualLength(
                         x,
                       )}`,
        },
      },
      dishes:  {
        description: {
          minLength: (x: any) =>
                       `Please enter a description between 20 and 150 characters${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Please enter a description between 20 and 150 characters${DE.validationErrors.common.actualLength(
                         x,
                       )}`,
          maxLine:   '2 lines max.',

        },
        title:       {
          minLength: (x: any) =>
                       `Please enter a description between 2 and 75 characters${getLengthConstraintText(
                         x,
                       )}`,
          maxLength: (x: any) =>
                       `Please enter a description between 2 and 75 characters${getLengthConstraintText(
                         x,
                       )}`,
        },

      },

      images: {
        background: {
          isDefined: 'Please specify a background image',
        },
        logo:       {
          isDefined: 'Please select a logo image',
        },
      },
    },
    apiUser:        {
      userName:     {
        minLength: 'Please enter a name with at least 3 characters',
        maxLength: 'Names may not be longer than 100 characters',
      },
      emailAddress: {
        isEmail:   'Please enter a valid email address (e.g. email@address.de)',
        maxLength: 'Email addresses may not be longer than 120 characters',
      },
    },
  },
};

export let locale = DE;

if (
  typeof window !== 'undefined' &&
  !window.navigator.language.startsWith('de')
) {
  locale = EN;
}

export function overrideLocale(deFn: Function, enFn: Function): void {
  if (typeof window === 'undefined') {
    return;
  }

  const languageRegEx = /locale=(de|en)/;
  const pathMatch     = window.location.href.match(languageRegEx);
  if (pathMatch !== null) {
    document.cookie = 'locale=' + pathMatch[1];
  }

  const cookieMatch = document.cookie.match(languageRegEx);
  if (cookieMatch !== null) {
    if (cookieMatch[1] === 'de') {
      // eslint-disable-next-line no-console
      console.log('Locale override DE');
      deFn();
    } else {
      // eslint-disable-next-line no-console
      console.log('Locale override EN');
      enFn();
    }
  }
}

overrideLocale(() => (locale = DE), () => (locale = EN));
