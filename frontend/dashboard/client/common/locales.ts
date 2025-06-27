/* eslint-disable */
/* @typescript-eslint/camelcase,@typescript-eslint/tslint/config */

/**
 * Dashboard Locales
 */
import { CSSProperties }          from '@material-ui/core/styles/withStyles';
import { insertColon }            from '@my-old-startup/common/datetime/format';
import { ErrorCode }              from '@my-old-startup/common/error/ErrorCode';
import { HttpStatusCode }         from '@my-old-startup/common/http/HttpStatusCode';
import {
  Dish,
  ErrorCodeMessages,
  HttpStatusCodeMessages,
  IApiCompany,
  IApiCompanyContactWithCity,
  IApiCompanyDetails,
  IApiCompanyDishes,
  IApiCompanyImages,
  IApiDeal,
  IApiDealDate,
  IApiDealDescription,
  IApiDealDetails,
  IApiDealLocation,
  IApiDealValue,
  IApiUserContact,
  Locale,
  OpeningHourEntry,
  OpeningHoursWeek,
  Timestamp,
}                                 from '@my-old-startup/common/interfaces';
import * as commonLocales         from '@my-old-startup/frontend-common/locales';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import moment                     from 'moment';
import 'moment/locale/de';
import { overrideLocale }         from '../../../../common/common/locales';
import {
  DayOfWeek,
  DealSpecialType,
  DealType,
}                                 from '../../../../common/enums';
import { DealTableVariant }       from '../pages/dashboard/deals/DealsTable';
import { MultiDatePickerVariant } from './date/DatePickerCard';
import {
  ImageTab,
  WizardStep,
}                                 from './types';

const enLocale = moment.locale('en');
const deLocale = moment.locale('de', {
  week: {
    dow: 1,
    doy: 4,
  },
});

// FIXME: actual test feedback address
const TEST_FEEDBACK_EMAIL = 'support@my-old-startups-domain.de';

/* tslint:disable:max-line-length */

const DE_WIZARD_LABEL = {
  buttons:     {
    back:    'Zurück',
    next:    'Weiter',
    publish: 'Veröffentlichen',
    save:    'Entwurf speichern',
    preview: 'Vorschau',
  },
  help:        {
    header: 'Hilfe',
  },
  steps:       {
    [WizardStep.KIND]:        'Art',
    [WizardStep.TYPE]:        'Kategorie',
    [WizardStep.DESCRIPTION]: 'Beschreibung',
    [WizardStep.DETAILS]:     'Details',
    [WizardStep.VALUE]:       'Betrag',
    [WizardStep.DATE]:        'Datum',
    [WizardStep.IMAGE]:       'Bild',
    [WizardStep.SUMMARY]:     'Übersicht',
  },
  stepHeader:  {
    [WizardStep.KIND]:        () => 'Bitte wählen Sie aus, was Sie anlegen wollen.',
    [WizardStep.TYPE]:        () => 'Bitte wählen Sie die Kategorie aus.',
    [WizardStep.DESCRIPTION]: () => 'Geben Sie einen Titel und die Beschreibung für Ihren Eintrag an.',
    [WizardStep.DETAILS]:     () => 'Geben Sie die verschiedenen Details für Ihren Eintrag an.',
    [WizardStep.VALUE]:       (deal: IApiDeal) => {
      if (deal.type === DealType.SPECIAL) {
        return 'Geben Sie den Preis des Specials an oder 0 falls Sie keinen Preis anzeigen möchten' as string;
      }
      return 'Geben Sie die preislichen Rahmendaten an.' as string;
    },
    [WizardStep.DATE]:        () => 'Geben Sie den Zeitraum für Ihren Eintrag an. ',
    [WizardStep.IMAGE]:       () => 'Wählen Sie ein geeignetes Bild für Ihren Eintrag aus.',
    [WizardStep.SUMMARY]:     (deal: IApiDeal) => `Möchten Sie "${deal.description.title}" veröffentlichen?`,
  },
  image:       {
    noImagesFound: 'Keine Bilder gefunden',
    help:          {
      [ImageTab.UPLOAD]:  'Wenn Sie ein eigenes Bild für den Eintrag verwenden wollen, können Sie diese Auswahl treffen und anschließend auf den "Hochladen"-Button klicken.',
      [ImageTab.STOCK]:   'Wir haben einige Vorlagen für Sie bereit, falls Sie kein geeignetes Bild für Ihren Eintrag zur Hand haben. Unsere Vorlagen sind sehr ansehnlich, aber vergessen Sie nicht, dass Nutzer authentische Bilder bevorzugen. ',
      [ImageTab.HISTORY]: 'Archiv',
    },
    tab:           {
      [ImageTab.UPLOAD]:  'Eigenes Bild',
      [ImageTab.STOCK]:   'Vorlagen',
      [ImageTab.HISTORY]: 'Archiv',
    },
  },
  type:        {
    dealTypes:              {
      header:                         'Deal Typ',
      deal:                           'Deal',
      special:                        'Neuheit',
      [DealType.DISCOUNT]:            'Rabatt Deal (einzelne Gerichte)',
      [DealType.DISCOUNT_2_FOR_1]:    'Rabatt Deal (2 für 1)',
      [DealType.DISCOUNT_CATEGORY]:   'Rabatt Deal (Kategorie)',
      [DealType.DISCOUNT_WHOLE_BILL]: 'Rabatt Deal (ganze Rechnung)',
      [DealType.SPECIAL]:             'Besonderes Angebot',
      [DealType.SPECIAL_MENU]:        'Wechselnde Karte',
      [DealType.SPECIAL_NEW]:         'Neues Gericht',
      [DealType.ADDON]:               'Zusatz Deal',
    },
    example:                {
      header:                         'Beispiel',
      deal:                           'z.B. ein Rabatt auf ein Gericht oder die Rechnung',
      [DealType.SPECIAL]:             'z.B. ein neues Gericht oder eine neue Karte',
      [DealType.DISCOUNT]:            'z.B. 20% auf unseren Cheeseburger',
      [DealType.DISCOUNT_2_FOR_1]:    'z.B. 2 Burger zum Preis von 1',
      [DealType.DISCOUNT_CATEGORY]:   'z.B. 15% auf alle Burger',
      [DealType.DISCOUNT_WHOLE_BILL]: 'z.B. 10% auf die gesamte Rechnung',
      [DealType.SPECIAL_MENU]:        'z.B. eine neue Tages- oder Wochenkarten',
      [DealType.SPECIAL_NEW]:         'z.B. eine neue Kreation',
      [DealType.ADDON]:               'z.B. zu jedem Cheeseburger gibt es 1 Softdrink gratis',
    },
    mobileHint:             'Tipp: Weiter unten finden Sie eine Erklärung zum ausgewählten Typ.',
    addonHintOriginalValue: 'Bitte geben Sie hier den Preis Ihres Gerichts an.',
    addonHintAddonValue:    'Bitte geben Sie hier den gewöhnlichen Preis des Zusatzes an, den Nutzer kostenfrei zu dem Gericht erhalten.',
    help:                   {
      deal:                           'Mit einem Deal geben Sie einen Rabatt auf Gerichte oder die ganze Rechnung. ',
      [DealType.SPECIAL]:             'Mit einer Neuheit informieren Sie Ihre Gäste über neue Gerichte oder Karten.',
      [DealType.ADDON]:               'Es kann vorkommen, dass man für bestimmte Gerichte keinen Rabatt einstellen möchte. Um für die Kunden dennoch einen Anreiz zu setzen, kann man diesen einfach einen kostenfreien Zusatz anbieten. Am besten macht man das ganz unkompliziert mit unserem Zusatz Deal.' +
                                      '\n' +
                                      'Dabei wählen Nutzer das von Ihnen angegebene Gericht aus und erhalten eine kostenlose Zugabe, wie ein Getränk, einen Kaffee, einen leckeren Nachtisch oder eine Flasche (Haus)Wein.' +
                                      '\n' +
                                      '\n' +
                                      'Obwohl Sie bei diesem Deal keinen geringeren Wert für Ihr Gericht ansetzen, ist der Effekt trotzdem groß. Kunden haben einen großen Anreiz Ihr Geschäft zu besuchen und die Wahrscheinlichkeit, dass diese eine Empfehlung aussprechen und wieder zurückkommen, steigt weiter an.',
      [DealType.SPECIAL_MENU]:        'Wenn Sie eine neue Tages-, Wochen- oder Monatsangebot haben.',
      [DealType.SPECIAL_NEW]:         'Wenn Sie eine neues Gericht in Ihre Karte aufgenommen haben.',
      [DealType.DISCOUNT_2_FOR_1]:    'Die beliebteste Variante der Rabatt Deals wird so oft genutzt, dass sie eine eigene Kategorie verdient: der 2 für 1 Deal.' +
                                      '\n' +
                                      '\n' +
                                      'Bei einem 2 für 1 Deal bietet man quasi einen 50% Rabatt auf bestimmte Produkte an, so lange Gäste zwei von diesen kaufen. ' +
                                      '\n' +
                                      'Dieser Deal zählt zu den Stärksten seiner Art, da Gäste oftmals eine höhere Personenanzahl benötigen, um diesen wahrzunehmen. Wenn man also davon ausgeht, dass Sie zwei Burger zum Preis von einem anbieten, werden Sie höchstwahrscheinlich zwei Gäste dafür in Ihrem Geschäft begrüßen können (oder einen wirklich sehr hungrigen Gast). Die beiden Gäste geben dann im Regelfall zusätzliche Bestellungen (Getränke etc.) auf, so dass sich der Deal für Sie im Endeffekt wieder lohnt.',
      [DealType.DISCOUNT]:            'Obwohl Rabatte zu den ältesten Marketingtricks gehören, haben sie auch heute nicht an Attraktivität und Effektivität verloren. Rabatt Deals funktionieren hervorragend, um neue Kundschaft zu generieren, ältere Vorräte loszuwerden, Tische außerhalb der Stoßzeiten zu füllen oder einfach um Verkaufszahlen anzukurbeln.' +
                                      '\n' +
                                      '\n' +
                                      'Der Rabatt Deal für einzelne Gerichte ist perfekt für einzelne Gerichte geeignet, die Sie mit einem bestimmten Rabatt versehen wollen.',
      [DealType.DISCOUNT_CATEGORY]:   'Der Rabatt Deal für Kategorien besonders dafür geeignet, wenn Sie nicht nur ein einzelnes Gericht, sondern eine ganze Kategorie (z.B. 15% auf alle Burger) als Angebot einstellen wollen.' +
                                      '\n' +
                                      '\n' +
                                      'Besonders reizvoll ist es für Nutzer, wenn Sie täglich oder wöchentlich die Kategorien wechseln. Damit haben Nutzer immer wieder einen großen Anreiz Ihre aktuellen Deals anzuschauen.',
      [DealType.DISCOUNT_WHOLE_BILL]: 'Der Rabatt Deal für die ganze Rechnung ist dafür geeignet, wenn Sie einen Rabatt auf den kompletten Rechnungsbetrag geben wollen.' +
                                      '\n' +
                                      '\n' +
                                      'Dieser Deal eignet sich besonders gut, um außerhalb der Stoßzeiten die Tische zu füllen. Sie legen sich dabei auf kein Gericht oder Kategorien fest und die Nutzer haben somit die größtmögliche Auswahl und das mit einem tollen Rabatt.',

    },
  },
  description: {
    titleHint: {
      [DealType.DISCOUNT]:            '',
      [DealType.DISCOUNT_2_FOR_1]:    'Bitte wählen Sie für den Rabatt Deal (2 für 1) einen aussagekräftigen Titel wie z.B. "2 Burger zum Preis von 1".',
      [DealType.DISCOUNT_CATEGORY]:   'Bitte wählen Sie für den Rabatt Deal (Kategorien) einen aussagekräftigen Titel wie z.B. "15% auf alle Burger".',
      [DealType.DISCOUNT_WHOLE_BILL]: 'Bitte wählen Sie für den Rabatt Deal (ganze Rechnung) einen aussagekräftigen Titel wie z.B. "10% auf die gesamte Rechnung".',
      [DealType.SPECIAL]:             '',
      [DealType.SPECIAL_MENU]:        '',
      [DealType.SPECIAL_NEW]:         '',
      [DealType.ADDON]:               'Bitte wählen Sie für den Zusatz Deal einen aussagekräftigen Titel wie z.B. "Zu jedem Cheeseburger gibt es 1 Softdrink gratis". Es sollte den Nutzern direkt klar sein, was der kostenfreie Zusatz ist.',
    },
  },
  details:     {
    dealSpecialTypes:        {
      header:                    'Art des Angebotes',
      type:                      'Kategorie',
      kind:                      'Unterkategorie',
      [DealSpecialType.SPECIAL]: 'Spezial',
      [DealSpecialType.DAILY]:   'Angebot des Tages',
      [DealSpecialType.WEEKLY]:  'Angebot der Woche',
      [DealSpecialType.MONTHLY]: 'Angebot des Monats',
      help:                      'Besondere Angebote sind Angebote ohne Rabatt, die es nur für einen bestimmten Zeitraum gibt, wie z.B. den Burger des Monats. ',
    },
    dealSpecialMenuTypes:    {
      header:                    'Art der Karte',
      [DealSpecialType.DAILY]:   'Tageskarte',
      [DealSpecialType.WEEKLY]:  'Wochenkarte',
      [DealSpecialType.MONTHLY]: 'Monatskarte',
      help:                      'Diese Auswahl ist genau richtig für Sie, wenn Sie eine Tages-, Wochen-, oder Monatskarte haben, die Sie mit Ihren Gästen teilen wollen.',
    },
    dealSpecialNewMenuTypes: {
      header: 'Neues Gericht',
      help:   'Gäste lieben es über Ihre neuen Gerichte informiert zu werden. Diese Auswahl ist genau richtig, wenn Sie sich wieder etwas besonderes ausgedacht haben, das sie dauerhaft auf Ihre Karte setzen wollen.',
    },
  },
  price:       {
    menuPriceHint: 'Schreiben Sie die Preise der einzelnen Gerichte einfach in die Beschreibung Ihres Eintrages.',
    menuPriceHelp: 'Für neue Karten können Sie diesen Schritt überspringen. ',
    help:          {
      [DealType.DISCOUNT]:            {
        originalValue: 'Der ursprüngliche Preis ist der gewöhnliche Preis für den Inhalt Ihres Deals.',
        discountValue: 'Dies ist der Preis den Nutzer letztendlich für den Deal bei Ihnen bezahlen müssen. ',
        discount:      'Der Rabatt wird automatisch ausgerechnet, wenn Sie den ursprünglichen Preis und den neuen Preis angegeben haben. Alternativ dazu können Sie auch einfach den ursprünglichen Preis eingeben und den Rabatt selbst über den Regler oder die manuelle Eingabe einstellen.',
      },
      [DealType.DISCOUNT_2_FOR_1]:    {
        discountValue: 'Geben Sie hier einfach den Preis für Ihren 2 für 1 Deal an. Wollen Sie beispielsweise zwei Burger zum Preis für einem anbieten und einer kostet 10 €, dann geben Sie hier 10 € an. Dies entspricht automatisch einem Rabatt von 50%. ',
        originalValue: '',
        discount:      '',
      },
      [DealType.DISCOUNT_CATEGORY]:   {
        discount:      'Geben Sie hier einfach den Rabatt an, den die Kategorie (wie im Titel angegeben, z.B. alle Burger) erhalten soll.',
        originalValue: '',
        discountValue: '',
      },
      [DealType.DISCOUNT_WHOLE_BILL]: {
        discount:      'Geben Sie hier einfach den Rabatt an, den unsere Nutzer auf die gesamte Rechnung bei Ihnen erhalten sollen.',
        originalValue: '',
        discountValue: '',
      },
      [DealType.SPECIAL]:             {
        discountValue: 'Wenn es Sinn macht für Ihre Neuheit einen einzelnen Preis anzuzeigen, was insbesondere für ein einzelnes Gericht der Fall ist, dann geben Sie diesen bitte hier an. Falls es sich zum Beispiel um eine Karte oder mehrere Gerichte handelt, geben Sie einfach "0" an, damit kein Preis angezeigt wird.',
        originalValue: '',
        discount:      '',
      },
      [DealType.SPECIAL_MENU]:        {
        discountValue: 'Wenn es Sinn macht für Ihre Neuheit einen einzelnen Preis anzuzeigen, was insbesondere für ein einzelnes Gericht der Fall ist, dann geben Sie diesen bitte hier an. Falls es sich zum Beispiel um eine Karte oder mehrere Gerichte handelt, geben Sie einfach "0" an, damit kein Preis angezeigt wird.',
        originalValue: '',
        discount:      '',
      },
      [DealType.SPECIAL_NEW]:         {
        discountValue: 'Wenn es Sinn macht für Ihre Neuheit einen einzelnen Preis anzuzeigen, was insbesondere für ein einzelnes Gericht der Fall ist, dann geben Sie diesen bitte hier an. Falls es sich zum Beispiel um eine Karte oder mehrere Gerichte handelt, geben Sie einfach "0" an, damit kein Preis angezeigt wird.',
        originalValue: '',
        discount:      '',
      },
      [DealType.ADDON]:               {
        originalValue: 'Hier können Sie ganz einfach den normalen Preis Ihres Gerichts angeben. Wenn Sie beispielsweise folgenden Deal einstellen "Zu jedem Cheeseburger gibt es 1 Softdrink gratis", dann geben Sie hier einfach den normalen Preis des Cheeseburgers an.',
        discountValue: '',
        discount:      '',
        addonValue:    'Dies ist der gewöhnliche Preis für den Zusatz, den my-old-startups-domain Nutzer kostenfrei erhalten. In dem Beispiel "Zu jedem Cheeseburger gibt es 1 Softdrink gratis" würden Sie hier den Preis von einem Softdrink angeben.',
      },
    },
  },
  date:        {
    header: {
      datepicker: 'Kalender',
      overnight:  'Geht der Eintrag über Nacht',
    },
    help:   {
      datepicker: 'An dieser Stelle können Sie die Gültigkeit des Eintrags festlegen. Der Eintrag kann entweder für einen einzelnen Tag, mehrere Tage, eine ganze Woche oder einen ganzen Monat eingestellt werden (Ausnahme neue Gerichte). Sie können diese Auswahl über der jeweiligen Monatsbezeichnung treffen und anschließend im Kalender die gewünschten Zeiträume auswählen. Gehen Sie auf Nummer sicher, dass Sie den Deal innerhalb Ihrer Öffnungszeiten einstellen, um Missverständnisse zu vermeiden.' +
                    '\n' +
                    '\n' +
                    'Lassen Sie den my-old-startups-domain Nutzern genug Zeit, um zu Ihnen zu finden und stellen Sie die Zeiträume nicht zu kurz ein.',
      overnight:  'Falls Ihr Eintrag über Nacht gehen soll, können Sie dies hier einfach auswählen. Geht ein Eintrag über Nacht, kann dieser allerdings nur bis zum nächsten Morgen um 6:00 Uhr gültig sein. In diesem Fall erstreckt sich der Eintrag zwar über zwei Kalendertage, aber es wird trotzdem nur ein Eintrag von ihrem Konto abgezogen.',
    },
  },
  summary:     {
    header: {
      publish: 'Veröffentlichung',
      static:  'Wiederkehrende Einträge',
      preview: 'Vorschau',
    },
    help: {
      publish: 'Sie haben hier entweder die Möglichkeit den Eintrag als Entwurf zu speichern oder zu veröffentlichen. Wenn Sie den Eintrag als Entwurf speichern, wird dieser nicht in unserer App zu sehen sein, aber Sie können den Eintrag später noch bearbeiten. Wenn Sie den Eintrag veröffentlichen, wird der Eintrag für den von Ihnen ausgewählten Zeitraum in der my-old-startups-domain App zu sehen sein und es wird ein Eintrag von Ihrem Konto abgezogen.',
      static:  'Wiederkehrende Einträge werden für die aktuelle und die nächste Woche im Vorraus angelegt und automatisch am Ende jeder Woche erneut. Für wiederkehrende Einträge wird nur ein Eintrag abgezogen.',
      preview: 'Hier sehen Sie nochmal alle Daten, die in der my-old-startups-domain App veröffentlicht werden. Genau so sehen unsere Nutzer letztendlich Ihren Eintrag.',
    },
  },
};

const DE_TABLE_LABEL = {
  textLabels: {
    body:         {
      noMatch: 'Keine passenden Daten für die aktuellen Filter gefunden',
      toolTip: 'Sortieren',
    },
    pagination:   {
      next:        'Nächste Seite',
      previous:    'Vorherige Seite',
      rowsPerPage: 'Einträge pro Seite',
      displayRows: 'von',
    },
    toolbar:      {
      search:      'Suchen',
      downloadCsv: 'CSV herunterladen',
      print:       'Drucken',
      viewColumns: 'Zeige Spalten',
      filterTable: 'Tabelle filtern',
    },
    filter:       {
      all:   'Alle',
      title: 'FILTER',
      reset: 'Zurücksetzen',
    },
    viewColumns:  {
      title:     'Zeige Spalten',
      titleAria: 'Zeige/Verstecke Spalten',
    },
    selectedRows: {
      text:       'Zeile(n) markiert',
      delete:     'Löschen',
      deleteAria: 'Lösche selektierte Einträge',
    },
  },
};

const DE_FILEPOND_LABELS = {
  labelIdle:                      `<span class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"><span class="filepond--label-action"> Hochladen </span></span>`,
  labelFileWaitingForSize:        'Warte auf Dateigröße',
  labelFileSizeNotAvailable:      'Größe nicht verfügbar',
  labelFileLoading:               'Lade',
  labelFileLoadError:             'Fehler beim Laden',
  labelFileProcessing:            'Übertrage',
  labelFileProcessingComplete:    'Übertragen abgeschlossen',
  labelFileProcessingAborted:     'Übertragen abgebrochen',
  labelFileProcessingError:       'Fehler während dem Übertragen',
  labelTapToCancel:               'Tippen zum abbrechen',
  labelTapToRetry:                'Tippen zum wiederholen',
  labelTapToUndo:                 'Tippen zum rückgänging machen',
  labelButtonRemoveItem:          'Entfernen',
  labelButtonAbortItemLoad:       'Abbrechen',
  labelButtonRetryItemLoad:       'Wiederholen',
  labelButtonAbortItemProcessing: 'Abbrechen',
  labelButtonUndoItemProcessing:  'Rückgänging',
  labelButtonRetryItemProcessing: 'Wiederholen',
  labelButtonProcessItem:         'Speichern',

  imageValidateSizeLabelFormatError:
                                         'Bildtyp wird nicht unterstützt. Nur JPG und PNG erlaubt',
  imageValidateSizeLabelImageSizeTooSmall:
                                         'Die Auflösung des Bildes ist zu klein',
  imageValidateSizeLabelImageSizeTooBig: 'Die Auflösung des Bildes ist zu groß',
  imageValidateSizeLabelExpectedMinSize:
                                         'Mindestgröße ist {minWidth} × {minHeight}',
  imageValidateSizeLabelExpectedMaxSize:
                                         'Maximalgröße ist {maxWidth} × {maxHeight}',

  labelFileTypeNotAllowed:
    'Bildtyp wird nicht unterstützt. Nur JPG und PNG erlaubt',
  fileValidateTypeLabelExpectedTypes:
    'Bildtyp wird nicht unterstützt. Nur JPG und PNG erlaubt',

  labelButtonReset:              'Zurücksetzen',
  labelButtonClose:              'Schließen',
  labelButtonConfirm:            'Speichern',
  labelStatusAwaitingImage:      'Warte auf Bild...',
  labelStatusLoadImageError:     'Fehler',
  labelStatusLoadingImage:       'Lade Bild...',
  labelStatusProcessingImage:    'Verarbeite Bild...',
  labelButtonCropZoom:           'Zuschneiden',
  labelButtonCropRotateLeft:     'Nach links drehen',
  labelButtonCropRotateRight:    'Nach rechts drehen',
  labelButtonCropRotateCenter:   'Gerade ausrichten',
  labelButtonCropFlipHorizontal: 'Horizontal spiegeln',
  labelButtonCropFlipVertical:   'Vertikal spiegeln',
  labelButtonCropAspectRatio:    'Seitenverhältnis',
};

const DE_IApiCompanyContact: Locale<IApiCompanyContactWithCity> = {
  title:                    'Name Ihres Geschäfts, Cafés etc.',
  address:                  'Straße und Hausnummer (ggf. mit Ort)',
  zipCode:                  'Postleitzahl',
  telephone:                'Öffentliche Telefonnummer',
  secondaryTelephone:       'Zweite öffentliche Telefonnummer',
  secondaryTelephoneReason: 'Zweck der zweiten Nummer',
  email:                    'Öffentliche E-Mail',
  website:                  'Webseite',
  city:                     'Stadt (wird automatisch befüllt)',
  type:                     'Art des Geschäfts',
  hasAcceptedTerms:
                            'Ich habe die <a target="_blank" href="https://my-old-startups-domain.de/agb-anbieter/" rel="noopener noreferrer">Allgemeinen Geschäftsbedingungen</a> und die <a href="https://www.my-old-startups-domain.de/datenschutz/" rel="noopener noreferrer" target="_blank">Datenschutzerklärung</a> gelesen und akzeptiere diese.',
  hasSubscribedToNewsletter:
                            'Ich möchte mit dem my-old-startups-domain Newsletter immer auf dem neuesten Stand über Aktualisierungen bleiben!',
};

const DE_IApiCompanyContact_Tooltips: Locale<IApiCompanyContactWithCity> = {
  title:                     'Geben Sie hier den Namen Ihres Geschäfts an. Dies ist der Name, der den my-old-startups-domain Nutzern bei jedem Deal und auf Ihrem öffentlichen Profil angezeigt wird.',
  address:                   'Gehen Sie auf Nummer sicher, dass Sie von my-old-startups-domain Nutzern gefunden werden können! Geben Sie hier die Straße, Hausnummer und ggf. den Ort Ihres Geschäfts an.',
  zipCode:                   'Anhand Ihrer Auswahl im Adressfeld wird automatisch die Postleizahl hinzugefügt. Sie müssen die Postleizahl nicht selbst hinzufügen.',
  email:
                             'Lassen Sie my-old-startups-domain Nutzer wissen, wie man Sie erreichen kann. Geben Sie hier die E-Mail-Adresse an, die mit diesem Geschäft verbunden werden soll.',
  telephone:
                             'Lassen Sie my-old-startups-domain Nutzer wissen, wie man Sie erreichen kann. Geben Sie hier die Telefonnummer an, die mit diesem Geschäft verbunden werden soll.',
  secondaryTelephone:        'Hier können Sie eine weitere Telefonnummer für einen bestimmten Zweck angeben',
  secondaryTelephoneReason:  'Hier können Sie den Zweck der zweiten Telefonnummer angeben',
  website:                   'Bitte geben Sie hier die Webseite Ihres Geschäfts an.',
  city:
                             'Anhand der Postleizahl wird automatisch die Stadt hinzugefügt. Sie müssen die Stadt nicht selbst hinzufügen.Anhand der Postleizahl wird automatisch die Stadt hinzugefügt. Sie müssen die Stadt nicht selbst hinzufügen.',
  type:
                             'Lassen Sie uns mehr über Ihr Geschäft erfahren. Geben Sie an, ob es sich bei Ihrem Geschäft um ein Restaurant, Imbiss, Café, Bar oder einen Food Truck handelt. Mit dieser Angabe können my-old-startups-domain Nutzer Sie besser finden.',
  hasAcceptedTerms:          '',
  hasSubscribedToNewsletter: '',
};

const DE_IApiUserContact: Locale<IApiUserContact> = {
  firstName: 'Vorname',
  lastName:  'Nachname',
  telephone: 'Persönliche Kontakt Telefonnummer',
  email:     'Persönliche Kontakt E-Mail',
};

const DE_IApiUserContact_Tooltips: Locale<IApiUserContact> = {
  lastName:
    'Geben Sie hier den Nachnamen des Ansprechpartners für diesen Account an. Diesen brauchen wir, um den richtigen Ansprechpartner für alle Themen rund um my-old-startups-domain kontaktieren zu können. Diese Daten werden nicht mit my-old-startups-domain Nutzern geteilt.',
  firstName:
    'Geben Sie hier den Vornamen des Ansprechpartners für diesen Account an. Diesen brauchen wir, um den richtigen Ansprechpartner für alle Themen rund um my-old-startups-domain kontaktieren zu können. Diese Daten werden nicht mit my-old-startups-domain Nutzern geteilt.',
  telephone:
    'Geben Sie bitte hier die Telefonnummer an unter der wir Sie für Rückfragen erreichen können. Diese Daten werden nicht mit my-old-startups-domain Nutzern geteilt.',
  email:
    'Geben Sie bitte hier Ihre E-Mail-Adresse an, damit wir Ihnen Updates und Informationen über my-old-startups-domain zukommen lassen können. Diese Daten werden nicht mit my-old-startups-domain Nutzern geteilt.',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiCompanyDetails: Locale<IApiCompanyDetails> = {
  description:         'Beschreibung Ihres Geschäfts',
  openingHours:        'Öffnungszeiten',
  prefersReservations: '"Reservierung notwendig" als Standard für Einträge setzen',
  reservationsLink:    'Reservierungsservice Link',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiCompanyDetails_Tooltips: Locale<IApiCompanyDetails> = {
  description:
                       'Geben Sie hier die Beschreibung für Ihr Geschäft an. Sobald Sie sich registriert haben, wird automatisch eine Seite für Ihr Geschäft generiert. Diese Seite, die Sie sich wie ihr Profil vorstellen können, ist mit jedem Ihrer Einträge verknüpft. So können sich unsere Nutzer noch ein besseres Bild von Ihnen machen. Schreiben Sie doch etwas über Ihre Geschichte, in welchem Viertel Sie sich befinden, etwas über das Ambiente und alles andere, was Sie besonders macht. Umso interessanter die Beschreibung ist, desto höher stehen die Chancen auf Besuche von my-old-startups-domain Nutzern.',
  openingHours:
                       'Klicken Sie hier und lassen Sie durch einen weiteren Klick auf den jeweiligen Tag die my-old-startups-domain Nutzer wissen, wann Sie geöffnet haben. Haben Sie an einem Tag nicht durchgängig geöffnet und machen beispielsweise eine Mittagspause, können Sie über das Plus-Symbol rechts noch eine zweite Öffnungszeit für den jeweiligen Tag hinzufügen.',
  prefersReservations: 'Mit dieser Auswahl legen Sie einen Standard für die Notwendigkeit von Reservierungen bei der Erstellung von Einträgen fest. Sie können hier auswählen, ob für Ihre Einträge für gewöhnlich eine Reservierung notwendig ist. Falls Sie öfter Deals mit benötigter Reservierung erstellen, empfehlen wir diese Option auszuwählen. Die Auswahl kann unabhängig von der Standardeinstellung bei jeder Eintragserstellung manuell angepasst werden.',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiCompanyImages: Locale<IApiCompanyImages> = {
  background:   'Hintergrundbild',
  logo:         'Logo',
  menuDocument: 'Speisekarte',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiCompanyDishes: Locale<IApiCompanyDishes & Dish> = {
  dishes:      'Gerichte',
  title:       'Name',
  description: 'Beschreibung',
  price:       'Preis',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiCompanyImages_Tooltips: Locale<IApiCompanyImages> = {
  background:
                'Fügen Sie ein Hintergrundbild hinzu, um sich von anderen Geschäften abzuheben. Mit diesem Bild können my-old-startups-domain Nutzer einen Blick auf Ihr Geschäft, die Atmosphäre oder das Team werfen. ',
  logo:
                'Laden Sie hier das Logo Ihres Geschäfts hoch, um Ihre Marke zu stärken. Wählen Sie hier am besten ihr Logo im 1:1 Format. Falls Sie keines im 1:1 Format haben, können Sie es ganz einfach bearbeiten, indem sie das Stiftsymbol über dem Zürücksetzen-Button anklicken.',
  menuDocument: 'Hier können Sie Ihre Speisekarte hochladen',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealValue: Locale<IApiDealValue> = {
  originalValue: 'Ursprünglicher Preis',
  discountValue: 'Preis',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDetails: Locale<IApiDealDetails> = {
  tags:                'Kategorien',
  minimumPersonCount:  'Mindestanzahl Personen',
  reservationRequired: 'Reservierung benötigt',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDescription: Locale<IApiDealDescription> = {
  title:       'Titel',
  description: 'Beschreibung',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDate: Locale<IApiDealDate> = {
  validFrom: 'Gültig am',
  validTo:   'Gültig bis',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealLocation: Locale<IApiDealLocation> = {
  location: 'Ort',
  address:  'Adresse',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDate_Tooltips: Locale<IApiDealDate> = {
  validFrom: 'Gültig am',
  validTo:   'Gültig bis',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealLocation_Tooltips: Locale<IApiDealLocation> = {
  location:
           'Lassen Sie Ihre Gäste wissen, wo sie diesen Eintrag finden können. Sie können den Standort Ihres Eintrags bestimmen, indem sie die Adresse oder den Ort (z.B. Rudolphplatz, Köln) eingeben oder auf die Karte klicken.',
  address: 'Adresse',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDescription_Tooltips: Locale<IApiDealDescription> = {
  title:
    'Geben Sie den Titel des Eintrags an. Dieser ist das, was den my-old-startups-domain Nutzern in der Listen- und Kartenansicht direkt ins Auge sticht. ',
  description:
    'Bei der Beschreibung kann man gerne noch etwas detaillierter werden. Hier kann man jene Nutzer überzeugen, die sowieso schon Interesse an Ihrem Eintrag zeigen.',
};

/* tslint:disable-next-line:variable-name */
const DE_IApiDealDetails_Tooltips: Locale<IApiDealDetails> = {
  tags:
                       'Bitte geben Sie bis zu drei verschiedene Kategorien an, damit Nutzer Ihre Einträge leichter finden können. Umso genauer, desto besser. Mindestens 1 Kategorie sollte ausgesucht werden.',
  minimumPersonCount:  'Wählen Sie hier die benötigte Anzahl von Personen aus, die für die Inanspruchnahme des Deals benötigt werden.',
  reservationRequired: 'Hier können Sie auswählen, ob eine Reservierung für Ihren Eintrag benötigt wird. Bei gewünschter Reservierung wird dies den Nutzern in der App direkt angezeigt, damit sich diese telefonisch bei Ihnen melden können. Vergessen Sie nicht Ihre Telefonnummer auf Ihrer Profilseite anzugeben.',
};

const DE = {
  culture:           'de-DE',
  common:            {
    privacyMessage: {
      header: 'Diese Webseite verwendet Cookies',
      text:
              'Cookies helfen uns bei der Bereitstellung unserer Inhalte und Dienste. Durch die weitere Nutzung der Webseite stimmen Sie der Verwendung von Cookies zu. Weitere Informationen erhalten Sie in unseren <a href="https://www.my-old-startups-domain.de/datenschutz/" target="_blank">Datenschutzhinweisen.</a>',
    },
    menuItems:      {
      showDeal: 'Zeige Deal',
    },
    weekday:        {
      monday:                'Montag',
      tuesday:               'Dienstag',
      wednesday:             'Mittwoch',
      thursday:              'Donnerstag',
      friday:                'Freitag',
      saturday:              'Samstag',
      sunday:                'Sonntag',
      [DayOfWeek.Monday]:    'Montag',
      [DayOfWeek.Tuesday]:   'Dienstag',
      [DayOfWeek.Wednesday]: 'Mittwoch',
      [DayOfWeek.Thursday]:  'Donnerstag',
      [DayOfWeek.Friday]:    'Freitag',
      [DayOfWeek.Saturday]:  'Samstag',
      [DayOfWeek.Sunday]:    'Sonntag',
    },
    buttons: {
      ok:       'Ok',
      save:     'Speichern',
      isDirty:  'Speichern nicht vergessen',
      continue: 'Weiter',
      publish:  'Veröffentlichen',
      cancel:   'Abbrechen',
      back:     'Zurück',
    },
    dropdown:       {
      all:          'Alle',
      pleaseChoose: 'Bitte wählen',
    },
    search:         {
      placeholder: 'Suche nach Adresse, Ort usw.',
    },
    error:          {
      restart:                  'Nochmal versuchen',
      retry:                    'Nochmal versuchen',
      contactSupport:           'Problem melden',
      noCompany:
                                ' Sie sind nur noch wenige Schritte davon entfernt, Ihre ersten Einträge auf my-old-startups-domain zu erstellen. Bitte füllen Sie nur noch das untenstehende Formular aus, um die Registrierung abzuschließen.',
      emailNotVerified:         {
        header:        'Bitte bestätigen Sie Ihre E-Mail-Adresse',
        body:
                       'Gleich haben Sie es geschafft! Bitte schauen Sie nun in Ihrem E-Mail-Postfach nach. Wir haben Ihnen eine Nachricht mit einem Bestätigungslink geschickt. Erst wenn Sie diesen öffnen, wird Ihr Account aktiviert.',
        bodyResend:
                       'Falls Sie keine E-Mail erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner oder drücken Sie den Button unten um die E-Mail erneut zu senden.',
        button:        'Bestätigungs-E-Mail erneut senden',
        resendFailed:  'Bestätigungs-E-Mail erneut senden fehlgeschlagen. Bitte wenden Sie sich an den Support.',
        resendSuccess: 'Die Bestätigungs-E-Mail wurde erneut gesendet.',
      },
      telephoneReformatTooltip: 'Bitte geben Sie nur bis zu 13 Ziffern ein.',
      defaultErrorMessage:
                                'Leider ist ein technisches Problem aufgetreten. Bitte versuchen Sie es später noch einmal.',
      notAuthorized:
                                'Ihre Session ist abgelaufen. Bitte melden Sie sich neu an.',
      validationErrorMessage:   'Bitte überprüfen Sie die roten Felder.',
      statusCode:               {
                                  [HttpStatusCode.NOT_FOUND]:      `Url ungültig (${
                                    HttpStatusCode.NOT_FOUND
                                  })`,
                                  [HttpStatusCode.NOT_AUTHORIZED]: `Nicht eingeloggt ${
                                    HttpStatusCode.NOT_AUTHORIZED
                                  })`,
                                  [HttpStatusCode.FORBIDDEN]:      `Diese Aktion ist nicht erlaubt ${
                                    HttpStatusCode.FORBIDDEN
                                  })`,
                                } as HttpStatusCodeMessages,
      errorCode:                {
                                  [ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND]:
                                    'Diese Adresse konnten wir leider nicht finden, bitte kontrollieren Ihre Eingaben.',
                                  [ErrorCode.WEB_SERVER_DUPLICATE_COMPANY]:
                                    'Zu diesen Daten exisitiert bereits ein Eintrag',
                                  [ErrorCode.WEB_SERVER_INVALID_USER_INPUT]:
                                    'Fehlerhafte Daten. Bitte überprüfen Sie Ihre Eingaben',
                                  [ErrorCode.WEB_SERVER_INVALID_DEAL]:
                                    'Deal kan nicht veröffentlich werden. Er liegt entweder in der Vergangenheit. ist zu lang oder wurde bereits veröffentlicht',
                                } as ErrorCodeMessages,
    },
    upload:         DE_FILEPOND_LABELS,
  },
  format:            {
    dateString: 'DD.MM.YYYY',
    date(timestamp: number): string {
      const date = new Date(timestamp);
      return date.toLocaleDateString('de-DE');
    },
    timestamp(timestamp: number): string {
      const date = new Date(timestamp);
      return (
        date.toLocaleDateString('de-DE') +
        '\n' +
        date.toLocaleTimeString('de-DE')
      );
    },
    timespan(from: number, to: number): string {
      return `${from} bis ${to} Uhr`;
    },
    currency(valueInCents: number): string {
      return (valueInCents / 100).toFixed(2).replace('.', ',');
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    time:       commonLocales.DE.format.time,
    dateLocale: deLocale,
  },
  table:             DE_TABLE_LABEL,
  forms:             {
    contact:            {
      labels: {
        contactEmail:     'Ihre E-Mail',
        subject:          'Betreff',
        body:             'Ihre Nachricht',
        hasAcceptedTerms: 'Ich bin mit der elektronischen Verarbeitung meiner personenbezogenen Daten nach Maßgabe der <a  target="_blank"  rel="noopener noreferrer" href="https://my-old-startups-domain.de/datenschutz/"">Datenschutzhinweise</a> einverstanden.',
      },
    },
    apiCompanyContact:  {
      fields:      DE_IApiCompanyContact,
      couponCode:  'Ihr Coupon-Code',
      tooltips:    DE_IApiCompanyContact_Tooltips,
      header:      'Daten des Geschäfts',
      subHeader:   'Bitte geben Sie die Daten des Geschäfts an, damit Ihre Gäste Sie jederzeit auffinden können. Die Daten werden außerdem für ein öffentliches my-old-startups-domain Profil genutzt, auf welchem Gäste alle wichtigen Informationen über Ihr Geschäft sehen können.',
      saveButton:  'Jetzt registrieren',
      saveMessage: 'Daten gespeichert',
      saveBlocked:
                   'Bitte kontaktieren Sie uns, falls Sie Ihre Stammdaten ändern möchten.',
    },
    apiUserContact:    {
      fields:      DE_IApiUserContact,
      tooltips:    DE_IApiUserContact_Tooltips,
      header:      'Kontaktdaten des Ansprechpartners',
      subheader:   'Bitte hinterlassen Sie uns Ihre persönlichen Kontaktdaten, damit wir Sie direkt erreichen können. Ihre persönlichen Kontaktdaten sind für andere my-old-startups-domain Nutzer nicht einsehbar.',
      saveMessage: 'Kontaktdaten gespeichert',
      successMessage:
                   'Vielen Dank!<br/>Wir werden Sie bald kontaktieren.<br/>Bitten fahren Sie unten mit Ihrer Anmeldung fort',
    },
    apiCompanyDetails: {
      fields:                   DE_IApiCompanyDetails,
      tooltips:                 DE_IApiCompanyDetails_Tooltips,
      socialMediaForm:          {
        header:    'Social Media',
        hint:      'Klicken Sie hier, um Ihre Profile hinzuzufügen',
        tooltip:   'Ihre Social Media Profile sind eine weitere tolle Möglichkeit, um mehr Aufmerksamkeit zu bekommen. Zeigen Sie Ihren Gästen, wo Sie auf Facebook und Co. zu finden sind, damit Sie dort mehr Follower und Likes bekommen.',
        link:      'Profilname',
        platform:  'Platform',
        platforms: {
          facebook:  'Facebook',
          instagram: 'Instagram',
          twitter:   'Twitter',
        },
      },
      openingHoursForm:         {
        header:             {
          modal:           (x: string) => `Neue Zeitspanne für ${x}`,
          open:            'Geöffnet?',
          openingHours:    'Zeiten zu denen geöffnet ist',
          overlappingWarning:
                           'Die gewählte Zeitspanne überschneidet sich mit einer bereits eingetragen.',
          description:     ` Tragen Sie hier die nächste Zeitspanne ein, zu der sie an diesem Tag geöffnet haben.
          Die Zeit dazwischen wird automatisch als Pause markiert.`,
          invalidTimespan: 'Die eingegebene Zeitspanne ist ungültig.',
        },
        hint:               'Klicken Sie hier, um Zeiten einzutragen',
        hintDayClosed:      (day: string) => `${day}s geschlossen. Klicken Sie hier, um für heute Öffnungszeiten einzutragen.`,
        hintDayClosedShort: (day: string) => `${day}s geschlossen.`,
        hintDayOpen:        (day: string) => `${day} zu folgenden Zeiten geöffnet.`,
        tooltipClear:       'Klicken Sie hier, um alle Zeiten dieses Tages zu entfernen.',
        initTooltip:        `Hier können Sie neue Zeit eintragen, für den nächsten Tag kopieren oder löschen.`,
        tooltip:            (x: string) =>
                              `Hier klicken, um neue Zeit für ${x} einzutragen.`,
        tooltipClone:       (x: keyof OpeningHoursWeek) =>
                              // eslint-disable-next-line @typescript-eslint/no-use-before-define
                              `Hier klicken, um die Zeiten von ${locale.common.weekday[x]} zu übernehmen.`,
        tooltipChip:        (day: string, from: string, to: string) =>
                              `${day}s geöffnet von ${from} bis ${to} Uhr.`,
        tooltipBreakChip:   (day: string, from: string, to: string) =>
                              `${day}s geschlossen von ${from} bis ${to} Uhr.`,
        tooltipDelete:      `Diese Zeitspanne entfernen.`,
      },
      register: {
        header:    'Weitere Angaben',
        subHeader: 'Bitte geben Sie weitere relevante Informationen über Ihr Geschäft an. Diese Angaben sind optional. Alle weiteren Angaben wie Logo, Hintergrundbild oder Speisekarte erfolgen nach der Registrierung.',
        support:   'Falls Sie Probleme bei dem Ausfüllen des Formulars haben, rufen Sie uns bitte einfach unter 022336199750 / 017643222354 an oder schreiben uns eine Mail an support@my-old-startups-domain.de.',
      },
      header:                   'Details',
      subHeader:                'Bitte geben Sie Details Ihres Geschäfts an.',
      saveMessage:              'Details gespeichert',
      descriptionHint:          'Gäste informieren sich heutzutage für gewöhnlich online, bevor sie Essen gehen. Daher ist eine gute Beschreibung essentiell, um Gäste von einem Besuch zu überzeugen. my-old-startups-domain bietet Ihnen hier die Gelegenheit Ihren Gästen alles Wichtige, das man über Ihr Geschäft in Erfahrung bringen kann, zu beschreiben.',
      descriptionHintLink1:     'Was sollte meine Beschreibung enthalten?',
      descriptionHintLink2:     'Beispiel',
      descriptionHintLink1Text: 'Teilen Sie doch direkt ein paar wichtige Eckdaten über Ihr Geschäft mit Ihren Gästen:\n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  '- Wo ist Ihr Geschäft gelegen? Gibt es etwas Besonderes an diesem Ort?\n' +
                                  '- Was für eine Art von Essen bieten Sie an? \n' +
                                  '- Wie ist die Atmosphäre in Ihrem Geschäft?\n' +
                                  '- Wie viele Sitzplätze gibt es für Gäste? Gibt es eine (Dach-)Terrasse, einen Garten, einen zweiten Stock oder andere Begebenheiten, die Ihr Geschäft besonders machen?\n' +
                                  '- Gibt es Parkplätze in der Gegend? Wie kann man Ihr Geschäft am besten mit öffentlichen Verkehrsmitteln erreichen?\n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  'Die Antworten darauf sind genau das, was die meisten Gäste suchen, wenn sie einen neuen Ort zum Essen entdecken und sich über Ihr Geschäft informieren wollen. Sie können allerdings noch weitere Informationen hinzufügen, um Ihr Profil noch besser hervorzuheben.  \n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  '- Lassen Sie Ihre Gäste wissen, wo Ihre Zutaten herkommen. Bereiten Sie Ihre Gerichte selbst zu? Kaufen Sie diese lokal ein? Teilen Sie diese Informationen mit Ihren Gästen!\n' +
                                  '- Haben Sie ein besonderes Hausgericht oder -getränk?\n' +
                                  '- Was macht Ihr Geschäft außergewöhnlich? Haben Sie eine besondere Philosophie?\n' +
                                  '- Halten Sie sich nicht zurück und fügen Sie alle weiteren Informationen, die für Ihre Gäste interessant sein könnten, hinzu.\n',
      descriptionHintLink2Text: '“Ristorante Boccacio ist ein italienisches Restaurant, das eine Vielzahl von italienischen Spezialitäten und Delikatessen anbietet. In unserem klassischen Etablissement mit moderner Einrichtung garantieren wir Ihnen einen außergewöhnlichen Aufenthalt, der in Ihren Erinnerungen bleiben wird. Starten Sie Ihren Abend mit einem klassischen italienischen Aperitif, gefolgt von einem unserer vielen besonderen Weinen. Wir bieten eine handverlesene Auswahl von Weinen, die wir direkt von unseren Partnern in Italien beziehen. Unser außergewöhnlich freundliches Personal hilft Ihnen bei einer Auswahl, die für Sie perfekt ist. \n' +
                                  '\n' +
                                  '\n' +
                                  'Wir bieten weiterhin diverse Antipasti, saisonale a la carte Gerichte, knusprige Pizzen und köstliche Pasta an. Die Pizzen werden in unserem historischen Steinofen zubereitet. \n' +
                                  'Das Ristorante Bocaccio befindet sich auf den ersten beiden Ebenen eines charmanten Altbaus in Köln Lindenthal, direkt in einer Seitenstraße der Zülpicher Straße. Dank des einmaligen Ambientes hat das Ristorante Bocaccio eine ganz besondere Stimmung und atemberaubende Atmosphäre, die in Köln ihresgleichen sucht. Die erste Ebene bietet Platz für insgesamt 40 Gäste, während auf der zweiten Ebene weitere 25 Gäste Platz nehmen können. Im Sommer ist der gemütliche Biergarten geöffnet, wo es weitere 14 Sitzplätze gibt. Wir freuen uns auf Ihren baldigen Besuch!”',
    },
    corona:           {
      header:           'Corona Krisen Information',
      subheader:        'Bitte geben Sie hier alle relevanten Daten für die Corona Krisen Information an. Wenn Sie Lieferung, Abholung oder Gutscheine anbieten, dann füllen Sie bitte einfach die entsprechenden Felder unten aus.',
      welcome:          (type: string) => `Sie haben alle Corona relevanten Informationen eingegeben und Ihre Registrierung ist abgeschlossen. Ihr Geschäft wird in wenigen Minuten auf <a target="_blank" href="https://www.my-old-startups-domain.de">www.my-old-startups-domain.de</a> sichtbar sein. Sie können es schon jetzt mit dem obenstehenden Button "ÖFFENTLICHES PROFIL ANZEIGEN" aufrufen.
<br/><br/>
Sie können diese Daten jederzeit wieder hier im Partnerbereich einsehen und ändern. Außerdem haben Sie die Möglichkeit Ihr Profil mit einem Profilbild, Hintergrundbild oder auch einer Speisekarte zu ergänzen. Um zu dieser Auswahl zu gelangen, klicken Sie einfach oben auf den “${type.toUpperCase()}”-Button.
 <br/><br/>
In dem Bereich "BELIEBTE GERICHTE" können Sie zusätzlich Ihre beliebtesten Gerichte einpflegen. Damit sieht man auf Ihrem öffentlichen Profil direkt einen Übersicht, welche Gerichte bei Ihren Gästen besonders gut ankommen.
 <br/><br/>
 Vielen Dank!`,
      saveMessage:      'Gespeichert',
      reopen:           {
        header:                   'Wieder geöffnet',
        checkbox:                 'Haben Sie wieder geöffnet?',
        checkboxTooltip:          'Wenn Sie wieder geöffnet haben, aktivieren Sie diese Checkbox',
        textLabel:                'Beschreibung',
        description:              'Wenn Sie wieder geöffnet haben, können Gäste wieder bei Ihnen vor Ort Platz nehmen und Ihren Service genießen. Bitte lassen Sie Ihre Gäste wissen, ob es noch weitere Einschränkungen bei dem Verzehr vor Ort gibt, wie z.B. eine Maskenpflicht bei dem Betreten des Restaurants oder andere wichtige Informationen.',
        descriptionHintLink1:     'Beispiel',
        descriptionHintLink1Text: 'Wir freuen uns, Sie wieder bei uns vor Ort begrüßen zu können. Bitte denken Sie besonders daran, den Mindestabstand von 1,5m zu anderen, nicht zum eigenen Hausstand gehörenden Gästen zu beachten.',
      },
      openRestrictions: {
        indoor:                'Innen',
        outdoor:               'Außen',
        indoorOutdoor:         'In welchem Bereich / welchen Bereichen können Ihre Gäste Platz nehmen?',
        reservationHeader:     'Benötigen Gäste eine Reservierung bei Ihnen?',
        reservationKindHeader: 'Soll die Reservierung online oder per Telefon erfolgen?',
        reservationNecessary:  'Ja',
        reservationPreferred:  'Nein, aber bevorzugt',
        reservationNo:         'Nein',
        maxPersonCount:        'Wie viele Personen können Sie maximal Pro Gruppe empfangen?',
        maxStayTime:           'Wie viele Stunden dürfen sich Gäste bei Ihnen aufhalten?',
        noRestriction:         'Keine Begrenzung',
        phoneReservations:     'Telefonisch',
        people:                'Personen',
        hours:                 'Stunden',
      },
      delivery:         {
        header:                   'Lieferung',
        checkbox:                 'Bieten Sie Lieferung an?',
        checkboxTooltip:          'Wenn Sie Lieferung anbieten, aktivieren Sie diese Checkbox',
        textLabel:                'Beschreibung Ihres Angebots',
        description:              'Wenn Sie selbst einen Lieferdienst haben oder bei Lieferando registriert sind, lassen Sie es Ihre Gäste bitte wissen. Außerdem sind für Gäste Informationen über die kontaktlose Lieferung interessant. ',
        descriptionHintLink1:     'Beispiel',
        descriptionHintLink1Text: 'Wir liefern zum einen über Lieferando, aber richten momentan auch unseren eigenen kontaktlosen Lieferdienst ein. Außerdem könnt ihr zu den Öffnungszeiten vorbeikommen, um nach wie vor Speisen und Getränke mitnehmen. Bitte vorher anrufen.',
      },
      takeAway:         {
        header:                   'Abholung',
        checkbox:                 'Bieten Sie Abholung an?',
        checkboxTooltip:          'Wenn Sie Abholung anbieten, aktivieren Sie diese Checkbox',
        textLabel:                'Beschreibung Ihres Angebots',
        description:              'Falls Sie Ihren Gäste eine Abholung ermöglichen, dann geben Sie diesen doch bitte weitere Informationen dazu.',
        saveMessage:              'Details gespeichert',
        descriptionHintLink1:     'Beispiel',
        descriptionHintLink1Text: 'Vor einer Abholung kontaktieren Sie uns bitte einfach zuvor telefonisch. Bitte halten Sie Abstände zu allen sich in der Nähe befindlichen Personen.',
      },
      coupons:          {
        header:                   'Gutscheine',
        checkbox:                 'Bieten Sie Gutscheine an?',
        checkboxTooltip:          'Wenn Sie Gutscheine anbieten, aktivieren Sie diese Checkbox',
        textLabel:                'Beschreibung Ihrer Gutscheine',
        linkLabel:                'Gutscheinlink',
        description:              'Um Liquiditätsengpässe zu vermeiden, können Gäste schon jetzt Gutscheine bei Ihnen erwerben, die sie in der Zeit nach Corona einlösen werden. Im Bestfall geben Sie Ihren Gästen eine Möglichkeit Gutscheine auch kontaktlos zu erwerben. Falls Sie auf einer anderen Plattform für Gutscheine vertreten sind, können Sie diese unten angeben',
        saveMessage:              'Details gespeichert',
        dehogaLink:               'Der DEHOGA NRW unterstützt diese Lösung',
        descriptionHintLink1:     'Beispiel',
        descriptionHintLink1Text: 'Ihr könnt uns sehr unterstützen, indem ihr schon jetzt Gutscheine erwerbt, die ihr später wieder einlösen könnt. Bitte kontaktiert uns einfach telefonisch unter 0221-000000, um zu besprechen, was euch am liebsten ist. Wenn ihr diese online erwerben wollt, dann klickt bitte auf den folgenden Link: ..',
      },
      donations:   {
        header:                   'Spenden',
        checkbox:                 'Akzeptieren Sie Spenden?',
        checkboxTooltip:          'Wenn Sie Spenden aktzeptieren, aktivieren Sie diese Checkbox',
        textLabel:                'Beschreibung Ihrer Gutscheine',
        linkLabel:                'Spendenlink',
        description:              'Für den Fall, dass Sie finanzielle Hilfe von Familie, Freunden und insbesondere auch den Gästen, denen Sie ans Herz gewachsen sind, angewiesen sind, können Sie hier einfach Ihre IBAN hinterlassen. Bitte fordern Sie die Spender auch dazu auf einen entsprechenden Verwendungszweck anzugeben. Falls Sie auf einer anderen Plattform für Spenden vertreten sind, können Sie diese hier angeben',
        saveMessage:              'Details gespeichert',
        descriptionHintLink1:     'Beispiel',
        descriptionHintLink1Text: 'Wenn freuen uns über jede finanzielle Hilfe von all denjenigen, die uns während dieser schwierigen Zeit unterstützen möchten.\n' +
                                    '\n' +
                                    'IBAN: DEXX XXXX XXXX XXXX XXXX\n' +
                                    '\n' +
                                    'Bitte gebt beim Verwendungszweck das Wort "Spende" an. Vielen Dank!',
      },
    },
    apiCompanyDishes: {
      fields:              DE_IApiCompanyDishes,
      header:              'Ihre beliebten Gerichte',
      tooltip:             'Lassen Sie Ihre Gäste wissen, welche Gerichte besonders beliebt bei Ihnen sind. Insbesondere Gäste, die neu in einer Stadt sind und unsere Plattform nutzen um Neues zu entdecken, freuen sich über diese Information.',
      cardHeader:          'Gericht',
      addButton:           'Neues Gericht hinzufügen',
      deleteButton:        'Gericht entfernen',
      noDishes:            'Noch keine Gerichte eingetragen',
      saveMessage:         'Gerichte gespeichert',
      descriptionHint:     'Vor allem potenzielle Gäste interessiert es besonders, welche die beliebtesten Gerichte bei Ihnen sind. In diesem Bereich können Sie ganz einfach bis zu zehn verschiedene Gerichte einpflegen, damit Gäste diese anschließend in Ihrem Profil sehen können.',
      exampleHintLink:     'Beispiel',
    },
    apiCompanyImages: {
      fields:                DE_IApiCompanyImages,
      tooltips:              DE_IApiCompanyImages_Tooltips,
      header:                'Bilder',
      restoreMessage:        'Standard wiederhergestellt',
      restoreDefault:        'Zurücksetzen',
      selectImage:           'Unsere Vorlagen',
      uploadImage:           'Hochladen',
      uploadMenu:            'Speisekarte hochladen',
      saveMessage:           'Bild gespeichert',
      saveMessageBackground: 'Neues Hintergrundbild gespeichert',
      saveMessageLogo:       'Neues Logo gespeichert',
      saveMessageMenu:       'Neue Speisekarte gespeichert',
      oldDeviceHint:         'Ihr Gerät unterstützt leider nicht die Bildvorschau. Bitte klicken Sie hier, um das Bild zu sehen.',
    },
    apiDealValue:     {
      fields:             DE_IApiDealValue,
      addonOriginalPrice: 'Deal Preis',
      discountSlider:     'Rabatt %',
      addonValue:         'Preis Zusatz',
      header:             'Betrag',
      saveMessage:        'Betrag gespeichert',
    },
    apiDealDescription: {
      fields:   DE_IApiDealDescription,
      tooltips: DE_IApiDealDescription_Tooltips,
    },
    apiDealLocation:    {
      fields:   DE_IApiDealLocation,
      tooltips: DE_IApiDealLocation_Tooltips,
    },
    apiDealFacts:       {
      fields:              DE_IApiDealDetails,
      tooltips:            DE_IApiDealDetails_Tooltips,
      header:              'Fakten',
      saveMessage:         'Fakten gespeichert',
      saveMessageLocation: 'Ort gespeichert',
      saveMessageLocationError:
                           'Fehler beim speichern des Ortes. Bitte speichern Sie die Fakten zuerst',
      saveMessageImage:    'Deal Bild gespeichert',
      hints:               {
        imageSaveFirst: 'Bitte speichern Sie, bevor Sie ein Bild einstellen',
        minTags:        'Bitte wählen Sie mindestens 1 Kategorie aus',
        maxTags:        'Höchstens 5 Kategorien',
      },
    },
    apiDealConditions:  {
      datepicker:            {
        specialHint:    'Neuigkeiten sind immer 30 Tage lang sichtbar.',
        tabs:           {
          [MultiDatePickerVariant.Single]:   'Einzelner Tag',
          [MultiDatePickerVariant.Multiple]: 'Mehrere Tage',
          [MultiDatePickerVariant.Weekly]:   'Wochen',
          [MultiDatePickerVariant.Monthly]:  'Monate',
        },
        header:         'Veröffentlichung',
        dateListHeader: 'Daten',
        noneSelected:   'Nichts ausgewählt',
      },
      dealMustBeInTheFuture: 'Datum darf nicht in der Vergangenheit liegen',
      fields:                DE_IApiDealDate,
      tooltips:              DE_IApiDealDate_Tooltips,
      timePickerValidFrom:   'Gültig ab',
      tooltip:
                             'An dieser Stelle können Sie die Gültigkeit des Einträge festlegen. Gehen Sie auf Nummer sicher, dass Sie den Eintrag innerhalb Ihrer Öffnungszeiten einstellen, um Missverständnisse zu vermeiden. Lassen Sie den my-old-startups-domain Nutzern genug Zeit, um zu Ihrem Restaurant zu finden und stellen Sie die Zeiträume nicht zu kurz ein. Ein Eintrag kann nicht an zwei verschiedenen Kalendertagen Gültigkeit besitzen.',
      header:                'Veröffentlichung',
      saveMessage:           'Veröffentlichung gespeichert',
      daySpanningCheckBox:   'Geht der Deal über Nacht?',
      isStaticCheckBox:      'Wiederholen?',
      skipHolidays:          'Nicht an Feiertagen?',
    },
  },
  registrationForm:  {
    header:  'Wir überprüfen Ihre Anmeldedaten',
    successMessage:
             'Vielen Dank für Ihre Anmeldung. Sie erhalten eine E-Mail, sobald wir Ihre Anmeldedaten geprüft und den Account freigeschaltet haben.',
    buttons: {
      register: 'Jetzt registrieren',
    },
  },
  registrationIntro: {
    header:    'Herzlich willkommen bei my-old-startups-domain',
    subHeader: 'Bitte melden Sie sich an um Ihre Restaurant zu registrieren',
    buttons:   {
      login: 'Jetzt anmelden',
    },
  },
  dashboard:         {
    contactPage:     {
      button:            'Kontakt & Hilfe',
      title:             'Kontakt',
      body:              ['Sie haben eine Frage und brauchen Unterstützung? Bitte kontaktieren Sie uns einfach via Kontaktformular, Telefon oder E-Mail. Wir werden versuchen Ihr Anliegen so bald wie möglich zu lösen.'],
      chatWithUs:        'Chatte mit uns',
      callOrText:        'Telefon und E-Mail',
      productsAndOrders: 'Produkte und Bestellungen',
      success:           'Erfolgreich gesendet',
      send:              'Senden',
    },
    feedbackPage:    {
      title: 'Feedback',
      body:  [
        'Unser Ziel ist es my-old-startups-domain jeden Tag ein Stück weit zu verbessern. Dafür brauchen wir Ihr Feedback, da Sie Experten in der Gastronomie sind. Wir nehmen jedes Anliegen ernst, antworten Ihnen so bald wie möglich und versuchen eine zufriedenstellende Lösung zu finden.',
        'Bitte teilen Sie uns Ihre Wünsche und Kritik mit und unterstützen Sie uns dabei, Ihnen den bestmöglichen Service zu bieten.',
      ],
    },
    dealAccountInfo: (): string => {
      const now = moment();
      now.date(1);
      const first = now.format('D. MMMM');
      now.date(now.daysInMonth());
      const last = now.format('D. MMMM');
      return `In der Zeit vom <b>${first} bis zum ${last}</b> haben Sie insgesamt <b>30 Einträge</b> zur Verfügung. An jedem ersten des Monats wird ihr Konto auf 30 Einträge zurückgesetzt. Nicht genutzte Einträge werden nicht in den nächsten Monat übertragen.`;
    },
    dialogs:         {
      quickCreateConfirmation: {
        title: 'Eintrag erstellen?',
        body:  ({ validFrom, validTo }: Pick<IApiDealDate, 'validFrom' | 'validTo'>): string => `Möchten Sie einen neuen Eintrag von ${commonLocale.format.time(
          validFrom)} bis ${commonLocale.format.time(validTo)} anlegen?`,
      },
      dealPublishConfirmation: {
        warningText:          (dealCount: number, plural: boolean) => {
          const deals = plural ? 'Einträge' : 'Eintrag';
          return `Momentan sind noch <b>${dealCount}</b> ${deals} in Ihrem Konto verfügbar. Veröffentlichte Einträge können nicht erstattet werden. Wenn Sie einen Eintrag veröffentlichen, wird dieser von allen Nutzern in der my-old-startups-domain App zu sehen sein.`;
        },
        validationFailed:     (error: string) => `Leider kam es zu einem Fehler. Bitte versuchen Sie es erneut oder senden Sie uns eine Nachricht damit wir den Fehler beheben können. \n Fehler: ${error}`,
        bulkPublishHint:      (count: number) => `Mit einem Klick auf "Veröffentlichen" wird der Eintrag insgesamt <b>${count}</b> mal veröffentlicht. Beim Speichern als Entwurf wird immer nur das naheliegenste Veröffentlichungsdatum gespeichert (falls mehrere Daten ausgewählt wurden).`,
        notEnoughCreditsHint: (needed: number, available: number) => `Ihr Guthaben reicht für diesen Vorgang nicht aus. Sie benötigen <b>${needed}</b> Einträge haben aber aktuell nur <b>${available}</b> zur Verfügung.`,
        imageHint:            'Bitte warten Sie bis das Bild gespeichert wurde.',
        imageMissingHint:     'Bitte wählen Sie ein Bild aus.',
        preview:              'Vorschau',
      },
    },
    header:          'my-old-startups-domain Partnerbereich',
    headerXs:        'my-old-startups-domain',
    hints:           {
      noCompanySelected: 'Bitte wählen Sie im Menü links ein Restaurant aus.',
      notCompleted:      'Bitte tragen Sie Beschreibung und Öffnunszeiten ein.',
      notApproved:       {
        header: 'Noch nicht freigeschaltet',
        text:
                'Ihr Account wurde noch nicht freigeschaltet. Bitte haben Sie noch etwas Geduld oder schreiben Sie uns eine E-Mail an <a href="mailto:support@my-old-startups-domain.de">support@my-old-startups-domain.de</a>.',
      },
      blocked:           {
        header: 'Gesperrt',
        text:   'Dieses Restaurant wurde gesperrt. Bitte kontaktieren Sie uns.',
      },
    },
    cards:           {
      // TODO:localize:toDE
      testing:      {
        header:        'my-old-startups-domain Testing',
        contentHeader: 'Welcome to the my-old-startups-domain public test!',
        body:          `Please follow the testing document instructions. If you have any problems, please contact us at ${TEST_FEEDBACK_EMAIL}`,
      },
      hotDeal:      {
        header:  'Beliebtester Eintrag',
        tooltip:
                 'Hier sehen Sie Ihren Eintrag, der am besten bei den my-old-startups-domain Nutzern angekommen ist. Schauen Sie bei der Seite mit den Statistiken vorbei, um zu lernen, welcher Eintrag am besten funktioniert hat.',
        noDeals: 'Sie haben bisher noch keine Einträge veröffentlicht.',
        testTitle:
                 'Hier wird in Zukunft Ihr beliebtester Eintrag zu sehen sein. Dieses Feature ist in der Testing-Phase noch nicht verfügbar.',
      },
      buttons:      {
        deals: 'Zeige alle Einträge',
      },
      dealCalendar: {
        header:   'Kalender',
        tooltip:
                  'Hier sehen Sie eine Übersicht über Ihre Einträge in der Kalenderansicht, die standardmäßig die aktuelle Woche anzeigt. Die Ansicht kann aber auch auf eine Tages- oder Monatsansicht umgestellt werden. An der rechten oberen Seite können Sie den Planungsmodus aktivieren. Wenn dieser aktiv ist, können Sie einfach auf eine beliebige Zeile im Kalender klicken und einen neuen Eintrag erstellen.',
        editMode: 'Planungsmodus',
        calendar: {
          date:      'Datum',
          time:      'Zeit',
          event:     'Event',
          allDay:    'Ganztags',
          week:      'Woche',
          work_week: 'Arbeitswoche',
          day:       'Tag',
          month:     'Monat',
          previous:  'Zurück',
          next:      'Weiter',
          yesterday: 'Gestern',
          tomorrow:  'Morgen',
          today:     'Heute',
          agenda:    'Agenda',
          showMore:  (count: number) => `Zeige ${count} mehr`,
        },
      },
      aboInfo:      {
        header:            'Abo Info',
        publishedUpcoming: 'Anstehende Einträge',
        remaining:         {
          deals:    'Verfügbare Einträge',
          topDeals: '*Top* Einträge verfügbar',
        },
      },
      companyInfo:  {
        header:            'Mein Account',
        tooltip:
                           'Hier sehen Sie zum einen eine Übersicht über Ihre Daten und zum anderen das Konto. Auf Letzterem sehen Sie, wieviele Einträge Sie diesen Monat noch zur Verfügung haben und wieviele Einträge schon veröffentlicht wurden. Außerdem haben Sie die Möglichkeit direkt einen neuen Eintrag hinzuzufügen.',
        hoursTable: {
          hoursSpan: (entry: OpeningHourEntry) =>
                       `${insertColon(entry.from)}–${insertColon(entry.to)}
`,
        },
        dealAccount:       {
          header: 'Ihr Konto',
        },
        createNewDealChip: {
          label: 'Neuer Eintrag',
          style(): CSSProperties {
            return {
              left: -10,
            };
          },
        },
      },
    },
    menuItems:       {
      header:    {
        loginHeader:
                'Bitte melden Sie sich an, um den my-old-startups-domain Partnerbereich zu nutzen.',
        loginHint:
                'Sie werden auf die Seite unseres Login-Systems weitergeleitet. Nach der Anmeldung werden Sie automatisch zu Ihrem my-old-startups-domain Partnerbereich weitergeleitet.',
        login:  'Login',
        signUp: 'Registrieren',
        logout: 'Abmelden',
        restaurantSelector:
                'Wählen Sie das Restaurant, das Sie bearbeiten möchten',
      },
      dashBoard: 'Dashboard',
      dealsPage: 'Einträge',
      dishes:    'Beliebte Gerichte',
      settings:  'Einstellungen',
      privacy:   'Datenschutz',
      terms:     'AGB',
      legal:     'Impressum',
      faq:       'FAQ',
      contact:   'Kontakt',
      dehoga:    'Informationen des DEHOGA NRW',
      feedback:  'Feedback',
      corona:    'Corona Auskunft',
    },
    companyPage:     {
      publicProfileButton: 'Öffentliches Profil anzeigen',
      mapHeader:           'Kartenansicht',
    },
    dealsPage:       {
      tabs:         {
        [DealTableVariant.Upcoming]: 'Aktive & Anstehende Einträge',
        [DealTableVariant.Archive]:  'Abgelaufene Einträge',
      },
      newHeader:    'Neuester Eintrag',
      header:       'Einträge',
      headerCreate: 'Neuen Eintrag anlegen',
      headerImage:  'Fügen Sie eine Bild hinzu, um den Einträge fertig zu stellen',
      headerEdit:   'Eintrag bearbeiten',
      imageDialog:  {
        publish:  'Veröffentlichen',
        continue: 'Entwurf speichern',
      },
      buttons:      {
        back:           'Zurück zur Übersicht',
        new:            'Neuen Eintrag',
        save:           'Speichern',
        create:         'Fortfahren',
        image:          'Bild ändern',
        refresh:        'Aktualisieren',
        customLocation: 'Standort festlegen',
      },
      legend:       {
        published:    'Veröffentlicht',
        special:      'Neuheit',
        notPublished: 'Nicht veröffentlicht',
        active:       'Gerade aktiv',
        old:          'Alt',
        selected:     'Selektiert',
      },
      location:     {
        searchInput: 'Bei Google Maps suchen',
        error:       'Bitte tragen Sie die Adresse für diesen Eintrag ein.',
      },
      messages:     {
        newTemplate:                (title: string) => `Sie verwenden "${title}" als Vorlage. Bitte überprüfen Sie das Datum des neuen Eintrages vor der Veröffentlichung.`,
        newDealSelectSlotFailed:    'Anlegen des Eintrages zu diesem Zeitpunkt ist fehlgeschlagen',
        newDeal:                    (title: string) => `"${title}" wurde anlegen`,
        newDealFailed:              'Eintrag anlegen ist fehlgeschlagen',
        updateDeal:                 (title: string) => `"${title}" wurde gespeichert`,
        updateDealFailed:           'Speichern des Eintrages fehlgeschlagen',
        published:                  (title: string) => `"${title}" erfolreich veröffentlicht`,
        deleted:                    (title: string) => `"${title}" erfolreich entfernt`,
        dealsFetchFailed:           (company: IApiCompany) => `Laden der Einträge für "${company.contact.title}" ist fehlgeschlagen`,
        dealsBulkPublishSuccess:    (count: number) => `${count} Einträge erfolgreich veröffentlicht`,
        dealsBulkPublishFailed:     (count: number) => `Das Veröffentlichen von ${count} Einträge ist fehlgeschlagen`,
        dealsBulkPublishFailedEach: (timestamp: Timestamp, error: string) => `Der Eintrag am ${moment(timestamp).format(
          'DD.MM.YYYY')} konnte nicht veröffentlicht werden. Grund: ${error}`,
      },
      table:        {
        header:       {
          [DealTableVariant.Archive]:    'Hier sehen Sie alle Einträge, die in der Vergangenheit liegen',
          [DealTableVariant.Upcoming]:   'Hier sehen Sie alle aktiven, sich wiederholende und anstehendene Einträge',
          [DealTableVariant.RecentDeal]: 'Ihr neuester Eintrag',
        },
        headerTopics: {
          facts:      'Details',
          value:      'Wert',
          conditions: 'Bedingungen',
        },
        columnHeader: {
          originalValue:      DE_IApiDealValue.originalValue,
          discountValue:      DE_IApiDealValue.discountValue,
          title:              'Titel',
          description:        'Beschreibung',
          tags:               'Kategorien',
          location:           'Ort',
          published:          'Veröffentlicht',
          isStatic:           'Wiederholt',
          validFromDate:      'Datum',
          time:               'Zeit',
          discountPercent:    'Rabatt',
          validFrom:          'Gültig ab',
          validTo:            'Gültig bis',
          minimumPersonCount: 'Min. Personenzahl',
          options:            'Optionen',
        },
        tooltips:     {
          published:    (x: number) =>
                          // eslint-disable-next-line @typescript-eslint/no-use-before-define
                          `Veröffentlich am ${locale.format.timestamp(x)}`,
          notPublished: 'Noch nicht veröffentlicht',
          isStatic:     'Wiederholen',
          notStatic:    'Nicht wiederholen',
        },
        dialog:       {
          delete:          (title: string) =>
                             `Möchten Sie den Eintrag <b>"${title}"</b> wirklich löschen? Dies kann nicht rückgangig gemacht werden.`,
          deletePublished: `<b>Achtung!</b> Der Eintrag ist bereits veröffentlicht. Sie bekommen keine Einträge erstattet, wenn Sie Ihn löschen`,
          header:          `Eintrag löschen?`,
        },
        buttons:      {
          showDetails:           'Eintrag anzeigen',
          publish:               'Veröffentlichen',
          notPublishableTooltip: 'Bitte wählen Sie ein Bild bevor Sie den Eintrag veröffentlichen',
          delete:                'Löschen',
          edit:                  'Bearbeiten',
          useTemplate:           'Als Vorlage verwenden',
          createTemplate:        'Vorlage erstellen',
        },
      },
    },
  },
  createDealWizard:  DE_WIZARD_LABEL,
};

// EN

const EN_WIZARD_LABEL = {
  buttons:     {
    back:    'Back',
    next:    'Next',
    publish: 'Publish',
    save:    'Save draft',
    preview: 'Preview',
  },
  help:        {
    header: 'Help',
  },
  steps:       {
    [WizardStep.KIND]:        'Type',
    [WizardStep.TYPE]:        'Category',
    [WizardStep.DESCRIPTION]: 'Description',
    [WizardStep.DETAILS]:     'Details',
    [WizardStep.VALUE]:       'Value',
    [WizardStep.DATE]:        'Date',
    [WizardStep.IMAGE]:       'Image',
    [WizardStep.SUMMARY]:     'Summary',
  },
  stepHeader:  {
    [WizardStep.KIND]:        () => 'Please select what you wish to create.',
    [WizardStep.TYPE]:        () => 'Please select a category.',
    [WizardStep.DESCRIPTION]: () => 'Please enter a title and a description for your entry.',
    [WizardStep.DETAILS]:     () => 'Please enter the details for this entry.',
    [WizardStep.VALUE]:       (deal: IApiDeal) => {
      if (deal.type === DealType.SPECIAL) {
        return 'Enter the price of the special or 0 if you don\'t want to show a price' as string;
      }
      return 'Please enter the price conditions of this entry.' as string;
    },
    [WizardStep.DATE]:        () => 'Please enter the time frame when this entry is valid.',
    [WizardStep.IMAGE]:       () => 'Please add an image to this entry.',
    [WizardStep.SUMMARY]:     (deal: IApiDeal) => `Do you want to publish "${deal.description.title}"?`,
  },
  image:       {
    noImagesFound: 'No images found',
    help:          {
      [ImageTab.UPLOAD]:  'If you want to use your own pictures for this entry, you can select this option and then click on the "Upload" button.',
      [ImageTab.STOCK]:   'We have some templates ready for you if you don\'t have a suitable picture for your entry. Our templates are quite nice, but don\'t forget that users prefer authentic images. ',
      [ImageTab.HISTORY]: 'Archive',
    },
    tab:           {
      [ImageTab.UPLOAD]:  'Own Image',
      [ImageTab.STOCK]:   'Suggestions',
      [ImageTab.HISTORY]: 'Archive',
    },
  },
  type:        {
    dealTypes:              {
      deal:                           'Deal',
      special:                        'News',
      header:                         'Deal Type',
      [DealType.DISCOUNT]:            'Discount Deal (single dish)',
      [DealType.DISCOUNT_2_FOR_1]:    'Discount Deal (2 for 1)',
      [DealType.DISCOUNT_CATEGORY]:   'Discount Deal (category)',
      [DealType.DISCOUNT_WHOLE_BILL]: 'Discount Deal (whole bill)',
      [DealType.SPECIAL]:             'Special Offer',
      [DealType.SPECIAL_MENU]:        'New Daily or Weekly Menu',
      [DealType.SPECIAL_NEW]:         'New Dish',
      [DealType.ADDON]:               'Add-on Deal',
    },
    mobileHint:             'Hint: You can find a explanation the selected type below.',
    addonHintOriginalValue: 'Please enter the normal price of your dish.',
    addonHintAddonValue:    'Please enter the normal price of the add-on that users receive free of charge when they order the meal.',

    help: {
      deal:                           'With a Deal you can give your customers a discount on dishes or the whole bill.',
      [DealType.SPECIAL]:             'With a news entry you are able to inform your guests about new dishes or menues.',
      [DealType.ADDON]:               'Sometimes you don’t want to give any discounts on a meal or a dish, but instead give people a little extra if they come visit your business. In this case, you can offer an Add-on Deal. This usually entails people eating at your business as they usually would, but with certain dishes they will get a little extra. As a top-up you can think of a soft drink, coffee, dessert, or even a bottle of (house)wine. \n' +
                                      '\n' +
                                      '\n' +
                                      'This deal does not require you to offer your meals for a lower value, but people are still inclined to visit your business and are more likely to return and recommend it to their friends.',
      [DealType.SPECIAL_MENU]:        'Promote a new daily, weekly or monthly menu with seasonal specials',
      [DealType.SPECIAL_NEW]:         'Promote a new creation pm your menu',
      [DealType.DISCOUNT_2_FOR_1]:    'The most famous version of the discount deal is used so often that we made it a separate category: the 2 for 1 deal. \n' +
                                      '\n' +
                                      'This deal basically means that you offer a 50% discount on certain products, as long as the guest buys two of them. \n' +
                                      '\n' +
                                      'It is among the most powerful discount deals, since guests often need to be in a group of people in order to make use of the deal. Let’s say you offer 2 burgers for the price of 1, this will most likely bring 2 guests to your business, who will most likely both order drinks and a side dish. This way you automatically earn back some of the money you missed out on when offering a large discount.',
      [DealType.DISCOUNT]:            'A discount is one of the oldest marketing tricks in the book, and it rarely fails to deliver. This is a typical deal to offer when you want to introduce new customers to your business, to get rid of your old stocks, to attract people to your business at slow hours, or simply to sell more meals' +
                                      '\n' +
                                      '\n' +
                                      'The discount deal for single meals is perfect if you want to give a discount on a specific meal.',
      [DealType.DISCOUNT_CATEGORY]:   'The category discount deal is perfect for deals where you do not want to give a discount on a single meal, but on all dishes in this category (e.g. 15% discount on all burgers).\n' +
                                      '\n' +
                                      'For my-old-startups-domain users, it is most attractive when these categories change regularly - for example daily or weekly - so they will always have an incentive to check out and buy your deals.',
      [DealType.DISCOUNT_WHOLE_BILL]: 'The discount deal for the whole bill is suitable if you want to give a discount on the full bill amount.' +
                                      '\n' +
                                      '\n' +
                                      'This deal is particularly suitable for filling the tables outside rush hours. You don\'t commit yourself to any dish or category and users have the greatest possible choice with a great discount.',
    },
    example: {
      header:                         'Example',
      deal:                           'e.g. a discount on a dish or the bill',
      [DealType.SPECIAL]:             'e.g. a new dish or menu',
      [DealType.DISCOUNT]:            'e.g. 20% discount on our cheeseburger',
      [DealType.DISCOUNT_2_FOR_1]:    'e.g. buy 2 burgers, pay 1',
      [DealType.DISCOUNT_CATEGORY]:   'e.g. 15% discount on all burgers',
      [DealType.DISCOUNT_WHOLE_BILL]: 'e.g. 10% discount on the whole bill',
      [DealType.SPECIAL_MENU]:        'e.g. the new seasonal menu',
      [DealType.SPECIAL_NEW]:         'e.g. a new creation on your menu',
      [DealType.ADDON]:               'e.g. a free softdrink with every cheeseburger',
    },
  },
  details:     {
    dealSpecialTypes:        {
      header:                    'What kind of special',
      type:                      'Category',
      kind:                      'Subcategory',
      [DealSpecialType.SPECIAL]: 'Special',
      [DealSpecialType.DAILY]:   'Daily Special',
      [DealSpecialType.WEEKLY]:  'Weekly Special',
      [DealSpecialType.MONTHLY]: 'Monthly Special',
      help:                      'Special offers are offers without a discount, which are valid for a limited time period, e.g. the burger of the month.',

    },
    dealSpecialMenuTypes:    {
      header:                    'What kind of menu',
      [DealSpecialType.DAILY]:   'Daily Menu',
      [DealSpecialType.WEEKLY]:  'Weekly Menu',
      [DealSpecialType.MONTHLY]: 'Monthly Menu',
      help:                      'This is the perfect choice for you if you have changing menues, e.g. daily, weekly or monthly menues.',
    },
    dealSpecialNewMenuTypes: {
      header: 'New dish',
      help:   'Guests love to be informed about new dishes. This is your perfect choice if you have a new dish on your menu that you want to keep for good.',
    },

  },
  description: {
    titleHint: {
      [DealType.DISCOUNT]:            '',
      [DealType.DISCOUNT_2_FOR_1]:    'Please choose a descriptive title for the discount deal (2 for 1), e.g. "2 burgers for the price of 1".',
      [DealType.DISCOUNT_CATEGORY]:   'Please choose a descriptive title for the discount deal (category), e.g. "15% discount on all burgers".',
      [DealType.DISCOUNT_WHOLE_BILL]: 'Please choose a descriptive title for the discount deal (whole bill), e.g. "10% discount on the whole bill".',
      [DealType.SPECIAL]:             '',
      [DealType.SPECIAL_MENU]:        '',
      [DealType.SPECIAL_NEW]:         '',
      [DealType.ADDON]:               'Please select a descriptive title for the Add-on Deal, e.g. "Every cheeseburger comes with 1 free soft drink". It should be directly clear to the users what the extra is.',
    },
  },
  price:       {
    menuPriceHint: 'Simply put the prices of each dish in the description text',
    menuPriceHelp: 'For new menus you can skip this test',

    help: {
      [DealType.DISCOUNT]:            {
        originalValue: 'The original price is the normal price for the deal you\'re offering.',
        discountValue: 'This is the price that my-old-startups-domain users pay for this deal.',
        discount:      'We automatically calculate the discount after you entered the original price and the deal price. Alternatively you can enter the original price and enter the discount, we will then calculate the deal price for you.',
      },
      [DealType.DISCOUNT_2_FOR_1]:    {
        discountValue: 'Enter the price of one meal here. If you\'re offering 2 burgers (worth €10 each) for the price of 1, simply enter the price of 1 burger (€10). We will automatically enter the discount of 50%.',
        originalValue: '',
        discount:      '',
      },
      [DealType.DISCOUNT_CATEGORY]:   {
        discount:      'Please enter the discount that will be applied to all meals in the category you chose earlier.',
        originalValue: '',
        discountValue: '',
      },
      [DealType.DISCOUNT_WHOLE_BILL]: {
        discount:      'Please enter the discount that my-old-startups-domain users will receive on their bill.\t',
        originalValue: '',
        discountValue: '',
      },
      [DealType.SPECIAL]:             {
        discountValue: 'Especially for single dishes it might makes sense to enter a price which you can manually do here. If you are advertising several dishes or a menu, please enter "0" and no price will be shown in the app.',
        originalValue: '',
        discount:      '',
      },
      [DealType.SPECIAL_MENU]:        {
        discountValue: 'Especially for single dishes it might makes sense to enter a price which you can manually do here. If you are advertising several dishes or a menu, please enter "0" and no price will be shown in the app.',
        originalValue: '',
        discount:      '',
      },
      [DealType.SPECIAL_NEW]:         {
        discountValue: 'Especially for single dishes it might makes sense to enter a price which you can manually do here. If you are advertising several dishes or a menu, please enter "0" and no price will be shown in the app.',
        originalValue: '',
        discount:      '',
      },
      [DealType.ADDON]:               {
        originalValue: 'Here you can enter the normal price of your meal. If, for example, you set the following deal "1 free soft drink with every cheeseburger", then simply enter the normal price of the cheeseburger here.',
        discountValue: '',
        discount:      '',
        addonValue:    'This is the normal price for the add-on that my-old-startups-domain users receive free of charge. In the example "1 free soft drink with every cheeseburger", you would enter the price of one soft drink here.',
      },
    },
  },
  date:        {
    header: {
      datepicker: 'Calendar',
      overnight:  'Deal goes overnight',
    },
    help:   {
      datepicker: 'Here you can define the validity of the entry. The entry can normally be set for a single day, multiple days, a whole week or a whole month (except new dishes). You can make this selection above the respective month name and then select the desired periods in the calendar. Be sure to set the deal within your opening hours to avoid misunderstandings.' +
                    '\n' +
                    '\n' +
                    'Give my-old-startups-domain users enough time to find you, so don\'t set the periods too short.',
      overnight:  'If your entry goes overnight, you can simply tick this box. Entrys that go overnight can only be valid until 6 am the next morning. Even though this entry spans two calendar days, only one deal will be deducted from your account.',
    },
  },
  summary:     {
    header: {
      publish: 'Publish',
      static:  'Reappearing entries',
      preview: 'Preview',
    },
    help: {
      publish: 'Here you have the possibility either to save the entry as draft or to publish it. If you save the entry as a draft, it will not be visible yet in our app, so you still have the opportunity to edit it at a later point in time. When you publish the entry, the entry will be visible in the my-old-startups-domain app for the period you selected, and a entry will be deducted from your account. my-old-startups-domain users only see published entrys.',
      static:  'Repeating entries will be created for this week an the next in advance. And automatically again at the end of each week. For repeating entries only 1 entry will be drawn from your account.',
      preview: 'Here you can preview how users will see your entry once published. You can also check all the details here.',
    },
  },

};

const EN_TABLE_LABEL = {
  textLabels: {
    body:         {
      noMatch: 'Sorry, no matching records found',
      toolTip: 'Sort',
    },
    pagination:   {
      next:        'Next Page',
      previous:    'Previous Page',
      rowsPerPage: 'Deals per page:',
      displayRows: 'of',
    },
    toolbar:      {
      search:      'Search',
      downloadCsv: 'Download CSV',
      print:       'Print',
      viewColumns: 'View Columns',
      filterTable: 'Filter Table',
    },
    filter:       {
      all:   'All',
      title: 'FILTERS',
      reset: 'RESET',
    },
    viewColumns:  {
      title:     'Show Columns',
      titleAria: 'Show/Hide Table Columns',
    },
    selectedRows: {
      text:       'rows(s) selected',
      delete:     'Delete',
      deleteAria: 'Delete Selected Rows',
    },
  },
};

const EN_FILEPOND_LABELS: any = {
  labelIdle:
    '<span class="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"><span class="filepond--label-action"> Upload </span></span>',
};

const EN_IApiUserContact: Locale<IApiUserContact> = {
  firstName: 'First name',
  lastName:  'Last name',
  telephone: 'Private contact number',
  email:     'Private contact email',
};

const EN_IApiUserContact_Tooltips: Locale<IApiUserContact> = {
  firstName:
    'Enter the first name of the person responsible for this account. We need this data to contact the person responsible for communications with my-old-startups-domain. This data will not be shared with my-old-startups-domain users.',
  lastName:
    'Enter the last name of the person responsible for this account. We need this data to contact the person responsible for communications with my-old-startups-domain. This data will not be shared with my-old-startups-domain users.',
  telephone:
    'Let us know on which number we can reach you to discuss your account. This data will not be shared with my-old-startups-domain users.',
  email:
    'Let us know on which email address we can reach you to send you updates and information about my-old-startups-domain. This data will not be shared with my-old-startups-domain users.',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyContact: Locale<IApiCompanyContactWithCity> = {
  title:                    'Name of your business, café etc.',
  address:                  'Street address (and city, if necessary)',
  zipCode:                  'Zip code',
  telephone:                'Public phone number',
  secondaryTelephone:       'Secondary phone number',
  secondaryTelephoneReason: 'Secondary number reason',
  email:                    'Public email',
  website:                  'Website',
  city:                     'City',
  type:                     'Type of business',
  hasAcceptedTerms:
                            'I have read and accept the <a target="_blank" rel="noopener noreferrer" href="https://my-old-startups-domain.de/agb-anbieter/">Terms and Conditions</a> and the <a href="https://www.my-old-startups-domain.de/datenschutz/"  rel="noopener noreferrer" target="_blank">Privacy Policy</a>.',
  hasSubscribedToNewsletter:
                            'I would like to stay up to date with latest developments through the my-old-startups-domain Newsletter!',
};

const EN_IApiCompanyContact_Tooltips: Locale<IApiCompanyContactWithCity> = {
  title:
                             'Enter the name of your business. This name will be displayed to my-old-startups-domain users with every deal you post and at your public profile.',
  address:                   'Make sure my-old-startups-domain users can find you! Enter your address here.',
  zipCode:                   'The postal code is selected based on your selection in the address field. You don\'t need to enter it yourself.',
  email:
                             'Let us know how my-old-startups-domain users can reach you! Enter the email address that will be connected to this business.',
  telephone:
                             'Let us know how my-old-startups-domain users can reach you! Enter the phone number that will be connected to this business.',
  secondaryTelephone:        'Here you can enter a secondary phone number for a specific reason',
  secondaryTelephoneReason:  'Here you can enter the reason for the secondary phone number ',
  website:                   'Help users find your website by including it in your profile.',
  city:
                             'The city is selected based on the street and postal code. You don\'t need to enter it yourself.',
  type:                      'Let us know more about your business. Is it a café, restaurant, food truck, bar or a snackbar? This helps my-old-startups-domain users to find you easier.',
  hasAcceptedTerms:          '',
  hasSubscribedToNewsletter: '',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyDetails: Locale<IApiCompanyDetails> = {
  description:         'Description of your restaurant',
  openingHours:        'Opening hours',
  prefersReservations: '"Reservation required" to be set as a default for entries',
  reservationsLink:    'Reservation service link',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyDetails_Tooltips: Locale<IApiCompanyDetails> = {
  description:
                       'Please tell potential customers something about your business. With your registration, we automatically create a business profile for you. On this page you can introduce yourself to the users of my-old-startups-domain. You can let them know what type of restaurant you are, in which area you are situated, what the house specialty is and anything else that makes your business special. The more you tell them, the higher the chances of attracting new customers.',
  openingHours:
                       'Let my-old-startups-domain users know when you are open! Click here and then on the boxes on the left to add opening hours for a specific day. If you have a break in your opening hours, please add the first part of the day until the break, and add the second part with the \'plus\' button on the right.\n',
  prefersReservations: 'Here you can set a default for the option whether you want guests to make a reservation before using an entry. If you usually require reservations, it\'s smart to use this option to have the reservation required banner on all of your entries by default. You can always change whether a reservation is required on any entry before you publish it.',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyDishes: Locale<IApiCompanyDishes & Dish> = {
  dishes:      'Dishes',
  title:       'Title',
  description: 'Description',
  price:       'Price',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyImages: Locale<IApiCompanyImages> = {
  background:   'Background image',
  logo:         'Logo',
  menuDocument: 'Menu',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiCompanyImages_Tooltips: Locale<IApiCompanyImages> = {
  background:
                'Add a background image for your profile to make it stand out. With this image you can give my-old-startups-domain users a sneak peak of the business, the atmosphere or the team.',
  logo:
                'Upload your company logo to make your profile stand out and to strengthen your brand. The ideal ratio for this image is 1:1, but you can also upload images with other sizes and edit them with the built-in image editor.',
  menuDocument: 'Here you can upload your menu',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealValue: Locale<IApiDealValue> = {
  originalValue: 'Original price',
  discountValue: 'Price',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealDescription: Locale<IApiDealDescription> = {
  title:       'Title',
  description: 'Description',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealDescription_Tooltips: Locale<IApiDealDescription> = {
  title:
    'Enter the title of the entry. This will be shown to all my-old-startups-domain users on the overview, in both the list and the map view.',
  description:
    'With this description you can convince the my-old-startups-domain users who are already interested in your entry, since this will be shown when they click on your entry.',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealLocation: Locale<IApiDealLocation> = {
  location: 'Location',
  address:  'Address',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealLocation_Tooltips: Locale<IApiDealLocation> = {
  location:
           'Tell your guests where they can find your food truck to use this entry. You can set the entry location by typing the address or spot (e.g. Rudolfplatz, Köln), or clicking on the map.',
  address: 'Address',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealDate: Locale<IApiDealDate> = {
  validFrom: 'Valid on',
  validTo:   'Valid to',
};

const EN_IApiDealDate_Tooltips: Locale<IApiDealDate> = {
  validFrom: 'Valid on',
  validTo:   'Valid to',
};

/* tslint:disable-next-line:variable-name */
const EN_IApiDealDetails: Locale<IApiDealDetails> = {
  tags:                'Categories',
  minimumPersonCount:  'Minimum person count',
  reservationRequired: 'Reservation Required',
};

const EN_IApiDealDetails_Tooltips: Locale<IApiDealDetails> = {
  tags:
                       'Please enter up to 3 tags to help people find your entry. The more accurate, the better. A minimum of 1 tag should be selected.',
  minimumPersonCount:  'Here you can select the number of people required to use the deal.',
  reservationRequired: 'Here you can select whether a reservation is required for this entry. If a reservation is required, we display this directly to the users in the app so that they can contact you by phone.  Don\'t forget to include your phone number on your profile page. ',
};

const EN = {
  culture:           'en-GB',
  common:            {
    privacyMessage: {
      header: 'This website uses cookies',
      text:
              'This website uses cookies to ensure you get the best experience on our website. By continuing to use this website you agree to the use of cookies. Learn more about our use of cookies in our <a href="https://www.my-old-startups-domain.de/datenschutz/">Privacy Policy</a>',
    },
    menuItems:      {
      showDeal: 'Show Deal',
    },
    weekday:        {
      monday:                'Monday',
      tuesday:               'Tuesday',
      wednesday:             'Wednesday',
      thursday:              'Thursday',
      friday:                'Friday',
      saturday:              'Saturday',
      sunday:                'Sunday',
      [DayOfWeek.Monday]:    'Monday',
      [DayOfWeek.Tuesday]:   'Tuesday',
      [DayOfWeek.Wednesday]: 'Wednesday',
      [DayOfWeek.Thursday]:  'Thursday',
      [DayOfWeek.Friday]:    'Friday',
      [DayOfWeek.Saturday]:  'Saturday',
      [DayOfWeek.Sunday]:    'Sunday',
    },
    buttons: {
      ok:       'Ok',
      save:     'Save',
      isDirty:  'Don\'t forget to save',
      publish:  'Publish',
      continue: 'Continue',
      cancel:   'Cancel',
      back:     'Back',
    },
    dropdown:       {
      all:          'All',
      pleaseChoose: 'Please choose',
    },
    search:         {
      placeholder: 'Search for address, landmark etc.',
    },
    error:          {
      restart:                  'Restart',
      retry:                    'Retry',
      contactSupport:           'Contact support',
      noCompany:
                                'You\'re only a few steps away from creating entries on my-old-startups-domain. Please fill out the form below to finish your registration.',
      emailNotVerified:         {
        header:        'Please confirm your email address',
        body:
                       'You\'re almost there! Please check your inbox for the confirmation email we have sent you. Click the link inside to activate your account.',
        bodyResend:
                       'If you did not receive any email, please check your spam folder or resend the email via the button below.',
        button:        'Resend verification email',
        resendFailed:  'Resend verification email failed. Please contact support.',
        resendSuccess: 'Resend verification email successful.',
      },
      telephoneReformatTooltip: 'Please only enter up to 13 digits',
      defaultErrorMessage:
                                'A technical error occurred. Please try again later.',
      notAuthorized:            'Your session has expired, please login again',
      validationErrorMessage:   'Please check the errors above',
      statusCode:               {
                                  [HttpStatusCode.NOT_FOUND]:      `Url invalid (${HttpStatusCode.NOT_FOUND})`,
                                  [HttpStatusCode.NOT_AUTHORIZED]: `Not logged in (${
                                    HttpStatusCode.NOT_AUTHORIZED
                                  })`,
                                  [HttpStatusCode.FORBIDDEN]:      `This action is not allowed ${
                                    HttpStatusCode.FORBIDDEN
                                  })`,
                                } as HttpStatusCodeMessages,
      errorCode:                {
                                  [ErrorCode.WEB_SERVER_NO_GEO_DATA_FOUND]:
                                    'We could not find this address, please check your input',
                                  [ErrorCode.WEB_SERVER_DUPLICATE_COMPANY]:
                                    'A company with these details already exists',
                                  [ErrorCode.WEB_SERVER_INVALID_USER_INPUT]:
                                    'The input is invalid, please check your form.',
                                  [ErrorCode.WEB_SERVER_INVALID_DEAL]:
                                    'Deal cannot be published. It either starts in the past, is too long or was already published',
                                } as ErrorCodeMessages,
    },
    upload:         EN_FILEPOND_LABELS,
  },
  format:            {
    dateString: 'DD.MM.YYYY',
    date(timestamp: number): string {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US');
    },
    timestamp(timestamp: number) {
      const date = new Date(timestamp);
      return (
        date.toLocaleDateString('en-US') +
        '\n' +
        date.toLocaleTimeString('en-US')
      );
    },
    timespan(from: number, to: number): string {
      return `${from} to ${to}`;
    },
    currency(valueInCents: number): string {
      return (valueInCents / 100).toFixed(2);
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    time:       commonLocales.EN.format.time,
    dateLocale: enLocale,
  },
  table:             EN_TABLE_LABEL,
  forms:             {
    contact:            {
      labels: {
        contactEmail:     'Your email',
        subject:          'Subject',
        body:             'Your message',
        hasAcceptedTerms: 'I consent to the electronic processing of my personal data in accordance with the <a  target="_blank" rel="noopener noreferrer" href="https://my-old-startups-domain.de/datenschutz/">data protection policy</a>.',
      },
    },
    apiCompanyContact:  {
      fields:      EN_IApiCompanyContact,
      tooltips:    EN_IApiCompanyContact_Tooltips,
      couponCode:  'Your Coupon-Code',
      header:      'Business details',
      subHeader:   'Please enter your business details, so your guests will always be able to find you. The data will also be used for your public my-old-startups-domain profile, where guests can find all important information about your business.\n',
      saveButton:  'Register now',
      saveMessage: 'Business details saved',
      saveBlocked:
                   'Please contact us to in case you want to change your contact details',
    },
    apiUserContact:     {
      fields:      EN_IApiUserContact,
      tooltips:    EN_IApiUserContact_Tooltips,
      header:      'Personal contact data',
      subheader:   'Please enter your personal contact data. We will use this to contact you whenever needed. This information will not be publicly available for other my-old-startups-domain users.',
      saveMessage: 'Contact data saved',
      successMessage:
                   'Thank you!<br/>We will contact you soon<br/>Please continue with the registration below',
    },
    apiCompanyDetails: {
      fields:                   EN_IApiCompanyDetails,
      tooltips:                 EN_IApiCompanyDetails_Tooltips,
      socialMediaForm:          {
        header:    'Social Media',
        hint:      'Click here to add your Social Media Profiles.',
        tooltip:   'Your Social Media profiles are a great opportunity to generate more interest for your business. Show your guests where they can find you online, so they can follow you and like your posts.',
        link:      'User Name',
        platform:  'Platform',
        platforms: {
          facebook:  'Facebook',
          instagram: 'Instagram',
          twitter:   'Twitter',
        },
      },
      openingHoursForm:         {
        header:             {
          modal:           (x: string) => `New timespan for ${x}`,
          open:            'Open?',
          openingHours:    'Opening hours',
          overlappingWarning:
                           'The chosen timespan overlaps with an existing one',
          description:     `Set the timespan when you will be open. Time between spans will be marked as closed`,
          invalidTimespan: 'Entered timespan is invalid',
        },
        hint:               'Click here to add a new time slot',
        hintDayClosed:      (day: string) => `Closed on ${day}. Click here to add opening hours for this day.`,
        hintDayClosedShort: (day: string) => `Closed on ${day}.`,
        hintDayOpen:        (day: string) => `Open on ${day} at these times.`,
        tooltipClear:       'Click here to remove all timespans of this day.',
        initTooltip:        `Click here to add a new timespan, copy or delete all timespans to the next day.`,
        tooltip:            (x: string) => `Click here to enter a new timespan for ${x}.`,
        tooltipChip:        (day: string, from: string, to: string) =>
                              `open from ${from} to ${to} on ${day}.`,
        tooltipClone:       (x: keyof OpeningHoursWeek) =>
                              // eslint-disable-next-line @typescript-eslint/no-use-before-define
                              `Click here to copy the time from ${locale.common.weekday[x]}.`,
        tooltipBreakChip:   (day: string, from: string, to: string) =>
                              `closed from ${from} to ${to} on ${day}.`,
        tooltipDelete:      `Remove this timespan.`,
      },
      register: {
        header:    'Further details',
        subHeader: 'Please enter further information about your business. This step is optional. All further informations like logo or background iamges can be set after the registration.',
        support:   'If you have any problems with the form just give us a call on 022336199750 / 017643222354 or write us an email at support@my-old-startups-domain.de.',
      },
      header:                   'Details',
      subHeader:                'Please enter some details about your company',
      saveMessage:              'Details saved',
      descriptionHint:          'Nowadays people are always looking for information before going out for dinner or drinks. In order to convince guests to visit your business, a good description is essential. my-old-startups-domain offers you the opportunity to tell guests everything they need to know about your business, so they can make the best decision.',
      descriptionHintLink1:     ' What should I put in my description?',
      descriptionHintLink2:     'Example',
      descriptionHintLink1Text: 'To start with, tell people some basic facts about your business: \n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  '- Where are you located? Is there anything special about the location?\n' +
                                  '- What type of food do you serve? \n' +
                                  '- What’s the atmosphere in your establishment like?\n' +
                                  '- How many people can you seat? Do you have a (roof)terrace, a garden, a second floor, or some other feature that makes your business stand out?\n' +
                                  '- Do you have parking space available? How can people reach you with public transport?\n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  'This is basic information many people look for when trying to find the perfect place to go to. However, you can make your description stand out even more by adding some extra information.\n' +
                                  '\n' +
                                  '_' +
                                  '\n' +
                                  'Go into detail about where your ingredients come from. Do you make everything yourself? Do you buy locally? Share it with your guests!\n' +
                                  '- What’s your signature dish or drink?\n' +
                                  '- What makes you special? What part of your philosophy should speak to the customers?\n' +
                                  '- Add anything else you want to tell potential guests about your business.\n',
      descriptionHintLink2Text: '“Ristorante Boccacio is an Italian restaurant offering a wide variety of Italian dishes and delicacies. In our classical establishment with modern interior, we can guarantee you a great night out. Start your night with a typical Italian aperitivo, followed by one of our many fine wines. Every bottle in our wine selection is hand picked and comes directly from our partner wineries in Italy. Our excellent and friendly staff can help you pick your favourite. \n' +
                                  '\n' +
                                  'We offer several antipasti, seasonal a la carte dishes, crunchy pizzas and delicious pastas. The pizzas are prepared in our handmade stone oven. \n' +
                                  '\n' +
                                  'Ristorante Bocaccio is located in Köln Lindenthal, on the first two floors of a classical building in a side street of the Zülpicher Straße. The building in combination with our modern interior gives Bocaccio a classy and friendly atmosphere. There is space for 40 people on the ground level, while the first floor is reserved for groups up to 25 people. In summer we also open our cozy garden, which seats another 14 people. We hope to welcome you soon!”\n',
    },
    corona:           {
      header:           'Corona Crisis Information',
      subheader:        'Please enter all relevant data for the corona crisis information. If you provide delivery, takout or coupons, please fill out the regarding forms below.',
      welcome:          (type: string) => `You entered all information regarding corona and completed your registration. Within a few minutes your business will be visible on <a target="_blank" href="https://www.my-old-startups-domain.de">www.my-old-startups-domain.de</a>. You can see a preview of your public profile by clicking on the "SHOW PUBLIC PROFILE" button above.
      <br/>      <br/>
 You can change the data whenever you want right here in your partner area. You are also able to complement your profile with a picture, background picture or your menu. In order to do this just press the “MY RESTAURANT”-Button at the top of this page. In order to do this just press the “${type.toUpperCase()}”-Button at the top of this page.
 <br/><br/>
Additionally, within the "POPULAR DISHES" section you are able to add your most popular dishes. As a result an overview with dishes which are well liked by your guests will be shown in your public profile.
 <br/><br/>
Thank you!`,
      saveMessage:      'Saved',
      reopen:           {
        header:                   'Reopened?',
        checkbox:                 'Is your business reopened',
        checkboxTooltip:          'If your business is reopened, check this box',
        textLabel:                'Description',
        description:              'If your business is reopened, guests will be able to take a seat inside in order to enjoy your service. Please let your guests know if there are any further restrictions such as wearing masks when entering your business or other important information.',
        descriptionHintLink1:     'Example',
        descriptionHintLink1Text: 'We are delighted to finally welcome you again! Please remember to keep the minimum distance of 1,5m to other guests who don\'t belong to your household.',
      },
      openRestrictions: {
        indoor:                'Indoor',
        outdoor:               'Outdoor',
        indoorOutdoor:         'Can your guests sit down indoor and / or outdoor?',
        reservationHeader:     'Do guests need a reservation at your business?',
        reservationKindHeader: 'Do you accept reservations online or via telephone?',
        reservationNecessary:  'Yes',
        reservationPreferred:  'No, but preferred',
        reservationNo:         'No',
        maxPersonCount:        'How many people per group are allowed to visit?',
        maxStayTime:           'How long may guests stay at your business?',
        noRestriction:         'No restriction',
        phoneReservations:     'By phone',
        people:                'people',
        hours:                 'hours',
      },
      delivery:         {
        header:                   'Delivery',
        checkbox:                 'Do you offer delivery?',
        checkboxTooltip:          'If you offer delivery check this box',
        textLabel:                'Description',
        description:              'Let your guests know if you have your own delivery service or if you are registered with Lieferando. Additionally, information about contactless delivery is highly appreciated by your guests.',
        descriptionHintLink1:     'Example',
        descriptionHintLink1Text: 'We deliver via Lieferando but we are also setting up our own conctactless delivery service at the moment.',
      },
      takeAway:         {
        header:                   'TakeAway',
        checkbox:                 'Do you offer takeaway?',
        checkboxTooltip:          'If you offer takeaway check this box',
        textLabel:                'Description',
        description:              'If takout is still available for you guests, please give your guests helpful information about this. ',
        saveMessage:              'Details saved',
        descriptionHintLink1:     'Example',
        descriptionHintLink1Text: 'If you consider takeaway please give us a call. Please keep the distance between you and other people once you arrive. ',
      },
      coupons:          {
        header:                   'Coupons',
        checkbox:                 'Do you offer coupons',
        checkboxTooltip:          'If you offer coupons check this box',
        textLabel:                'Description of your coupons',
        linkLabel:                'Coupon link',
        description:              'Coupons are a perfect tool to avoid current liquidity shortages. Guests can buy coupons now and redeem them after the crisis has passed. The best case scenario for guests is to purchase coupons completely without any personal contact. In case you are on another platform for coupons, please enter the address below.',
        saveMessage:              'Details saved',
        dehogaLink:               'DEHOGA NRW supports this solution',
        descriptionHintLink1:     'Example',
        descriptionHintLink1Text: 'You can support us by purchasing coupons which can be redeemed after the crisis. Please give us a call on 0221-000000 to let us know how you prefer to make your purchase. In case you want to purchase the coupons online, please click on the following link: ..',
      },
      donations: {
        header:                   'Donations',
        checkbox:                 'Do you accepts donations?',
        checkboxTooltip:          'If you accept donations check this box',
        textLabel:                'Description for donations',
        linkLabel:                'Donations link',
        description:              'You can leave your IBAN here in case you are in need of financiel help from family, friends or your guests. Please ask the donator to leave an according description for the wire transfer such as "donation". In case you are on another platform for donations, please enter the address below.',
        saveMessage:              'Details saved',
        descriptionHintLink1:     'Example',
        descriptionHintLink1Text: 'We highly appreciate financial help from those of you who want to support us during such a hard time. \n' +
                                    '\n' +
                                    'IBAN: DEXX XXXX XXXX XXXX XXXX\n' +
                                    '\n' +
                                    'Please mark the wire transfer with the description "donation". Thank you! ',
      },

    },
    apiCompanyDishes: {
      fields:              EN_IApiCompanyDishes,
      tooltip:             'Let your guests know which your most popular dishes are. Especially guests who are new to the city and use our platform to discover new places, are glad to be informed about your popular dishes. ',
      header:              'Your popular dishes',
      cardHeader:          'Dish',
      addButton:           'Add new dish',
      noDishes:            'No dishes added yet',
      deleteButton:        'Remove dish',
      saveMessage:         'Dishes saved',
      descriptionHint:     'Especially potential guests are interested in your most popular dishes. In this area you are easily able to add up to 10 dishes so guests can see them in your profile.',
      exampleHintLink:     'Example',
    },
    apiCompanyImages: {
      fields:                EN_IApiCompanyImages,
      tooltips:              EN_IApiCompanyImages_Tooltips,
      header:                'Images',
      saveMessage:           'Image saved',
      restoreMessage:        'Default restored',
      restoreDefault:        'Restore default ',
      selectImage:           'Select from library',
      uploadImage:           'Upload',
      uploadMenu:            'Upload menu',
      saveMessageBackground: 'New background images saved',
      saveMessageLogo:       'New logo saved',
      saveMessageMenu:       'New menu saved',
      oldDeviceHint:         'Your device does not support native preview. Please click here to see the picture',
    },
    apiDealValue:     {
      fields:             EN_IApiDealValue,
      addonOriginalPrice: 'Deal Price',
      addonValue:         'Price add-on',
      discountSlider:     'Discount %',
      header:             'Value',
      saveMessage:        'Value saved',
    },
    apiDealDescription: {
      fields:   EN_IApiDealDescription,
      tooltips: EN_IApiDealDescription_Tooltips,
    },
    apiDealLocation:    {
      fields:   EN_IApiDealLocation,
      tooltips: EN_IApiDealLocation_Tooltips,
    },
    apiDealFacts:       {
      fields:              EN_IApiDealDetails,
      tooltips:            EN_IApiDealDetails_Tooltips,
      header:              'Facts',
      saveMessage:         'Facts saved',
      saveMessageImage:    'Image saved',
      saveMessageLocation: 'Location saved',
      saveMessageLocationError:
                           'Error while saving the location. Save the facts first',
      hints:               {
        imageSaveFirst: 'Please save before adding an image',
        minTags:        'Please choose at least 1 tag',
        maxTags:        'A maximum of 3 categories may be chosen',
      },
    },
    apiDealConditions:  {
      datepicker:            {
        specialHint:    'News are always visible for 30 days',
        tabs:           {
          [MultiDatePickerVariant.Single]:   'Single',
          [MultiDatePickerVariant.Multiple]: 'Multiple',
          [MultiDatePickerVariant.Weekly]:   'Weekly',
          [MultiDatePickerVariant.Monthly]:  'Monthly',
        },
        header:         'Publication',
        dateListHeader: 'Selected dates',
        noneSelected:   'Nothing selected',
      },
      dealMustBeInTheFuture: 'Date cannot be in the past',
      fields:                EN_IApiDealDate,
      tooltips:              EN_IApiDealDate_Tooltips,
      timePickerValidFrom:   'Valid from',
      tooltip:
                             'Here you can tell my-old-startups-domain users when this entry is valid. Make sure the time is within your opening hours so possible misunderstandings are avoided. We want to leave the my-old-startups-domain users enough time to see your entry and find your restaurant. A entry can not exceed a calendar day.',
      header:                'Publication',
      saveMessage:           'Publication saved',
      daySpanningCheckBox:   'Entry goes overnight?',
      isStaticCheckBox:      'Repeat?',
      skipHolidays:          'Not valid on public holidays?',
    },
  },
  registrationForm:  {
    header:  'We are reviewing your information',
    successMessage:
             'Thank you for your registration. We have received your submission and will notify you via email as soon as we have reviewed your registration info.',
    buttons: {
      register: 'Register now',
    },
  },
  registrationIntro: {
    header:    'Welcome to my-old-startups-domain',
    subHeader: 'Please login to register your restaurant',
    buttons:   {
      login: 'Login now',
    },
  },
  dashboard:         {
    contactPage:     {
      button:            'Contact & Support',
      title:             'Contact',
      body:              ['Are there any questions or do you need further support? Please contact us via this contact form, phone, or email. We will answer your request as soon as possible.'],
      chatWithUs:        'Chat with us',
      callOrText:        'Call or Text',
      productsAndOrders: 'Products and Orders',
      success:           'Success',
      send:              'Send',
    },
    feedbackPage:    {
      title: 'Feedback',
      body:  [
        'Improving my-old-startups-domain on a daily basis is one of our main goals. To reach this goal we need your feedback since you are experts in the catering area. We take every feedback seriously, answer as soon as possible and try to find a satisfying solution for you.',
        'Please share your wishes and criticism with us and support us so we can offer you the best possible service. ',
      ],
    },
    dealAccountInfo: (): string => {
      const now = moment();
      now.date(1);
      const first = now.format('Do [of] MMMM');
      now.date(now.daysInMonth());
      const last = now.format('Do [of] MMMM');
      return `In this period from the <b>${first} to the ${last}</b> you have a total amount of <b>30 entries</b> to use. At the beginning of each month your Account will be reset to 30 entries. Unused entries are not carried over to the next month.`;
    },
    header:          'my-old-startups-domain Partner Area',
    headerXs:        'my-old-startups-domain',
    dialogs:         {
      quickCreateConfirmation: {
        title: 'Create Deal?',
        body:  ({ validFrom, validTo }: Pick<IApiDealDate, 'validFrom' | 'validTo'>): string => `Do you want to create a deal from ${commonLocale.format.time(
          validFrom)} to ${commonLocale.format.time(validTo)}?`,
      },
      dealPublishConfirmation: {
        warningText:          (dealCount: number, plural: boolean) => {
          const deals = plural ? 'deals' : 'deal';
          return `There are currently <b>${dealCount}</b> ${deals} left in your account. Published deals cannot be refunded. When you publish a deal, it will be visible for all users in the my-old-startups-domain App.`;
        },
        validationFailed:     (error: string) => `There was an error. Please try again or send us a message so we can fix the error. \n Error: ${error}`,
        bulkPublishHint:      (count: number) => `This entry will be published <b>${count}</b> times. When saving as draft, only the closest publish date will be saved (if multiple were selected).`,
        notEnoughCreditsHint: (needed: number, available: number) => `You do not have have sufficient entries left in your account. For this action you require <b>${needed}</b> entries, while there are <b>${available}</b> entries remaining`,
        imageHint:            'Please wait for the image to be processed.',
        imageMissingHint:     'Please choose an image.',
        preview:              'Preview',
      },
    },
    hints:           {
      noCompanySelected: 'Please select a restaurant from the menu on the left',
      notCompleted:
                         'Please fill in the details and opening hours for this restaurant first.',
      notApproved:       {
        header: 'Not approved yet',
        text:
                'Your profile has not been approved yet. If you have any questions or concerns please write us an email at <a href="mailto:support@my-old-startups-domain.de">support@my-old-startups-domain.de</a>',
      },
      blocked:           {
        header: 'Blocked',
        text:   'This restaurant was blocked. Please contact us.',
      },
    },
    cards:           {
      testing:      {
        header:        'my-old-startups-domain Testing',
        contentHeader: 'Welcome to the my-old-startups-domain public test!',
        body:          `Please follow the testing document instructions. If you have any problems, please contact us at ${TEST_FEEDBACK_EMAIL}`,
      },
      hotDeal:      {
        header:  'Hot Deal',
        tooltip:
                 'Here you can see your most popular entry. Go to the statistics page and learn which entries work best.',
        noDeals: 'You have not published any entries yet.',
        testTitle:
                 'This will be the restaurant\'s most popular entry in the future. This feature is not yet available in the testing phase.',
      },
      buttons:      {
        deals: 'Show Deals',
      },
      dealCalendar: {
        header:   'Schedule',
        tooltip:
                  'Here you can find an overview of your entries in the calendar. You can change the calendar view to see an overview per day, week or month. On the top right you find a toggle to activate the planning mode. When activated, you can create entries straight from the calendar. Simply switch on the planning mode and select the time you want to create the entry for.',
        editMode: 'Schedule mode',
        // keys are used in DatePicker
        calendar: {
          date:      'Date',
          time:      'Time',
          event:     'Event',
          allDay:    'All Day',
          week:      'Week',
          work_week: 'Work Week',
          day:       'Day',
          month:     'Month',
          previous:  'Previous',
          next:      'Next',
          yesterday: 'Yesterday',
          tomorrow:  'Tomorrow',
          today:     'Today',
          agenda:    'Agenda',
          showMore:  (count: number) => `Show ${count} more`,
        },
      },
      aboInfo:      {
        // Could also be "Account Info"?
        header:            'Subscription Info',
        publishedUpcoming: 'Upcoming Entries',
        remaining:         {
          deals:    'Available Entries',
          topDeals: '*Top* Entries left',
        },
      },
      companyInfo:  {
        header:            'My Account',
        tooltip:
                           'Here you see an overview of your account data. On the bottom of this card you find how many entries you still have left this month, and how many entries are already published. You can also click on the plus symbol to add a new entry.',
        hoursTable:        {
          hoursSpan: (entry: OpeningHourEntry) => `${insertColon(
            entry.from,
          )}–${insertColon(entry.to)}

`,
        },
        dealAccount:       {
          header: 'Your Account',
        },
        createNewDealChip: {
          label: 'New entry',
          style(): CSSProperties {
            return {
              left:        -26,
              marginRight: -2,
            };
          },
        },
      },
    },
    menuItems:       {
      header:    {
        loginHeader:        'Please log in to use the my-old-startups-domain Partner Area',
        loginHint:
                            'You will be redirected to our login system. After login you will automatically be redirected back here',
        signUp:             'SignUp',
        login:              'Login',
        logout:             'Logout',
        restaurantSelector: 'Choose the restaurant you want to work with',
      },
      dashBoard: 'Dashboard',
      dealsPage: 'Entries',
      dishes:    'Popular Dishes',
      settings:  'Settings',
      privacy:   'Privacy',
      terms:     'Terms and Conditions',
      legal:     'Legal',
      faq:       'FAQ',
      contact:   'Contact',
      dehoga:    'Information by DEHOGA NRW',
      feedback:  'Feedback',
      corona:    'Corona Info',
    },
    companyPage:     {
      publicProfileButton: 'Show public profile',
      mapHeader:           'Map',
    },
    dealsPage:       {
      tabs:         {
        [DealTableVariant.Upcoming]: 'Active & Upcoming Deals',
        [DealTableVariant.Archive]:  'Past Deals',
      },
      newHeader:    'Newest Deal',
      header:       'Deals',
      headerCreate: 'Create new deal',
      headerEdit:   'Edit deal',
      headerImage:  'Add a picture to complete your deal',
      imageDialog:  {
        publish:  'Publish',
        continue: 'Save Draft',
      },
      buttons:      {
        back:           'Back to Overview',
        new:            'Add new deal',
        save:           'Save Draft',
        create:         'Continue',
        image:          'Change image',
        refresh:        'Refresh',
        customLocation: 'Set Location',
      },
      legend:       {
        published:    'Published',
        special:      'Novelty',
        notPublished: 'Not published',
        active:       'Currently active',
        old:          'Old',
        selected:     'Selected',
      },
      location:     {
        searchInput: 'Search on Google Maps',
        error:       'Please select the address for this entry',
      },
      messages:     {
        newTemplate:                (title: string) => `You are using "${title}" as a template. Please make sure to check the date of the new deal before publishing.`,
        newDealSelectSlotFailed:
                                    'Failed to create a entry with the selected time',
        newDeal:                    (title: string) => `"${title}" was created`,
        newDealFailed:              'Creating new entry failed',
        updateDeal:                 (title: string) => `"${title}" was saved`,
        updateDealFailed:           'Saving the entry failed',
        published:                  (title: string) => `"${title}" successfully published`,
        deleted:                    (title: string) => `"${title}" successfully deleted`,
        dealsFetchFailed:           (company: IApiCompany) => `Fetching deals for company ${company.contact.title} failed`,
        dealsBulkPublishSuccess:    (count: number) => `${count} Entries successfully published`,
        dealsBulkPublishFailed:     (count: number) => `Publishing of ${count} Entry failed`,
        dealsBulkPublishFailedEach: (timestamp: Timestamp, error: string) => `The entry on ${moment(timestamp).format(
          'DD.MM.YYYY')} could not be published. Resaon: ${error}`,
      },
      table:        {
        header:       {
          [DealTableVariant.Archive]:    'See all of your past entries',
          [DealTableVariant.Upcoming]:   'See all of your active, repeating and upcoming entries',
          [DealTableVariant.RecentDeal]: 'Your most recent entry',
        },
        headerTopics: {
          facts:      'Details',
          value:      'Value',
          conditions: 'Conditions',
        },
        columnHeader: {
          originalValue:      EN_IApiDealValue.originalValue,
          discountValue:      EN_IApiDealValue.discountValue,
          title:              'Title',
          description:        'Description',
          image:              'Image',
          published:          'Published',
          companyId:          'CompanyId',
          tags:               'Categories',
          location:           'Location',
          validFromDate:      'Date',
          isStatic:           'Repeated',
          time:               'Time',
          discountPercent:    'Discount',
          validFrom:          'Start',
          validTo:            'End',
          minimumPersonCount: 'Minimum persons',
          options:            'Options',
        },
        tooltips:     {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          published:    (x: number) => `Published on ${locale.format.timestamp(x)}`,
          notPublished: 'Not yet published',
          notStatic:    'Don\'t repeat',
          isStatic:     'Repeat',
        },
        dialog:       {
          delete:          (title: string) => `Do you really want do delete "${title}"?\nThis cannot be undone.`,
          deletePublished: 'Warning! The Deal is already published. Deleted Deals are not subject to a refund.',
          header:          'Delete Deal?',
        },
        buttons:      {
          showDetails:           'Show Deal',
          delete:                'Delete',
          publish:               'Publish',
          notPublishableTooltip: 'Please choose an image bevore publishing the deal',
          edit:                  'Edit',
          useTemplate:           'Use as template',
          createTemplate:        'Create template',
        },
      },
    },
  },
  createDealWizard:  EN_WIZARD_LABEL,
};

export let locale = DE;
moment.locale('de');

if (window.navigator.language.startsWith('de') === false) {
  moment.locale('en');
  locale = EN;
}

overrideLocale(
  () => {
    locale = DE;
    moment.locale('de');
  },
  () => {
    moment.locale('en');
    locale = EN;
  });
