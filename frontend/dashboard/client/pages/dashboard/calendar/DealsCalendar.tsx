/* eslint-disable @typescript-eslint/tslint/config */
import { CircularProgress, createStyles, Theme, withStyles, WithStyles, withWidth } from '@material-ui/core';
import { WithWidth }                                                                from '@material-ui/core/withWidth';
import { locale as commonLocale }                                                   from '@my-old-startup/common/common/locales';
import { IApiDeal }                                                       from '@my-old-startup/common/interfaces';
import { Timestamp }                                                      from '@my-old-startup/common/interfaces/types';
import { DashboardRoutes }                                                from '@my-old-startup/frontend-common/routes';
import { globalMessageService }                                           from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }                                                     from '@my-old-startup/frontend-common/services/LogService';
import clsx                                                               from 'clsx';
import { observer }                                                       from 'mobx-react';
import moment                                                             from 'moment';
import * as React                                                         from 'react';
import BigCalendar, { DateLocalizer, DateRange, Formats, SlotInfo, View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { isSpecialType }                                                  from '../../../../../../common/enums';
import { IS_IOS, IS_SAFARI }                                              from '../../../common/constants';
import { AddNewDealLabel }                                                from '../../../common/GAEvent';
import { locale }                                                         from '../../../common/locales';
import { routeService }                                                   from '../../../services/CdbRouteService';
import { dashboardAnalyticsService }                                      from '../../../services/dashboardAnalyticsService';
import { companyStore }                                                   from '../../../stores/CompanyStore';
import { dealStore }                                                      from '../../../stores/DealStore';
import { getDealColors }                                                  from '../../../styles/common';
import { createDealWizardStore }                                          from '../deals/wizard/CreateDealWizardStore';
import { DealsCalendarEvent }                                             from './DealsCalendarEvent';
import { QuickCreateConfirmationDialog } from './QuickCreateConfirmationDialog';

const momentLocalizer: DateLocalizer = BigCalendar.momentLocalizer(moment);

const formats: Formats = {
  dateFormat: 'DD.MM',

  dayFormat:        (date, culture, localizer) => localizer.format(date, 'DD.MM', culture),
  agendaDateFormat: (date, culture, localizer) => localizer.format(date, 'ddd DD.MM', culture),

  timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'HH:mm', culture),

  monthHeaderFormat: (date, culture, localizer) => localizer.format(date, 'MMMM YYYY', culture),
  dayHeaderFormat:   (date, culture, localizer) => localizer.format(date, 'ddd DD.MM.YYYY', culture),

  dayRangeHeaderFormat: ({ start, end }: DateRange, culture, localizer) =>
    `${localizer.format(start, 'DD.MM', culture)} - ${localizer.format(end, 'DD.MM', culture)}`,

  agendaHeaderFormat: ({ start, end }: DateRange, culture, localizer) =>
  /* tslint:disable-next-line:max-line-length */
    `${localizer.format(start, 'DD.MM.YYYY', culture)} - ${localizer.format(end,
                                                                            'DD.MM.YYYY',
                                                                            culture)}`,

  selectRangeFormat: ({ start, end }: DateRange, culture, localizer) =>
    `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,

  agendaTimeRangeFormat: ({ start, end }: DateRange, culture, localizer) =>
    `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,

  eventTimeRangeFormat: ({ start, end }: DateRange, culture, localizer) => (
    `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`
  ),
};

const styles = (theme: Theme) => {
  const dealColors = getDealColors(theme);

  return createStyles({
    tableContainer: {
      height: '800px',
      '& *':  {
        fontFamily: theme.typography.fontFamily,
      },

      '& .rbc-current-time-indicator': {
        height: 3,
        zIndex: 1010,
      },

      '& .rbc-now, .rbc-now ~ .rbc-time-column': {
        '& .rbc-time-slot': {
          zIndex:    50,
          '&:hover': {
            cursor:          'pointer',
            backgroundColor: !IS_IOS
              ? theme.palette.primary.light + ' !important'
              : 'inherit',
          },
        },
      },
    },
    eventContainer: {
      backgroundColor: 'transparent !important',
      borderColor:     'transparent !important',
      color:           'transparent !important',
      marginTop:       '-20px',
    },
    weekEvent: {
      minHeight: '40px !important',
    },
    monthEvent: {
      minHeight: '19px !important',
    },
    special: {
      backgroundColor: dealColors.special + ' !important',
    },
    activeEvent: {
      backgroundColor: dealColors.active + ' !important',
    },
    publishedEvent: {
      zIndex:      100,
      // do not apply on agenda view
      '&:not(tr)': {
        backgroundColor: dealColors.published,
      },
    },
    notPublishedEvent: {
      zIndex:      100,
      // do not apply on agenda view
      '&:not(tr)': {
        backgroundColor: dealColors.notPublished,
      },
    },
    old: dealColors.old,
  });
};

type Props = WithStyles<typeof styles> & WithWidth;

type State = {
  selectedDeal: IApiDeal | undefined;
  currentAnchor: any;
  view: View;
  isConfirmationOpen: boolean;
  selectedFrom: Timestamp | undefined;
  selectedTo: Timestamp | undefined;
  readonly defaultView: View;
};

@observer
class _DealsCalendar extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    let defaultView = BigCalendar.Views.WEEK;

    if (props.width === 'sm' || props.width === 'xs') {
      defaultView = BigCalendar.Views.DAY;
    }

    this.state = {
      selectedDeal:       undefined,
      currentAnchor:      undefined,
      view:               defaultView,
      isConfirmationOpen: false,
      selectedFrom:       undefined,
      selectedTo:         undefined,
      defaultView,
    };
  }

  public render(): JSX.Element {
    const { classes } = this.props;

    const company = companyStore.currentCompany;
    const deals   = dealStore.allDeals;

    if (deals === undefined) {
      return (
        <CircularProgress/>
      );
    }

    const { defaultView, view, isConfirmationOpen, selectedFrom, selectedTo } = this.state;

    const { min, max } = IS_SAFARI
      ? { min: undefined, max: undefined }
      : {
        min: new Date(moment().format('YYYY-MM-DDT06:00:00')),
        max: new Date(moment().format('YYYY-MM-DDT22:00:00')),
      };

    return (
      <div className={classes.tableContainer}>
        <QuickCreateConfirmationDialog isOpen={isConfirmationOpen} validFrom={selectedFrom || 0}
                                       validTo={selectedTo || 0} onContinue={() => this.createDealWithSelected()}
                                       onCancel={() => this.hideConfirmation()}/>
        <BigCalendar<IApiDeal>
          min={min}
          max={max}

          culture={locale.culture}
          messages={locale.dashboard.cards.dealCalendar.calendar}
          formats={formats}

          views={[BigCalendar.Views.DAY, BigCalendar.Views.WEEK, BigCalendar.Views.MONTH]}
          defaultView={defaultView}
          localizer={momentLocalizer}
          events={deals}
          startAccessor={x => new Date(x.date.validFrom)}
          endAccessor={x => new Date(x.date.validTo)}
          titleAccessor={x => x.description.title}
          onSelectSlot={(slot) => this.selectTimeSlot(slot)}
          onSelectEvent={(dealEvent: any, e) => dealEvent.handleClick(e)}
          selectable={!IS_IOS}
          onView={(view) => this.setState({ view })}

          components={{
            event: (props: any) =>
              (
                <DealsCalendarEvent
                         view={view}
                         company={company}
                         deal={props.event}
                         {...props}
                />
              ),
          }}

          eventPropGetter={(deal: IApiDeal) => {
            const now = Date.now();
            return {
              className: clsx(
                {
                  [classes.special]:   isSpecialType(deal.type),
                  [classes.weekEvent]:   view === 'week',
                  [classes.monthEvent]:  view === 'month',
                  [classes.old]:         deal.date.validTo < now,
                  [classes.activeEvent]: deal.date.validFrom < now
                                         && now < deal.date.validTo
                                         && deal.published !== null,
                  [classes.publishedEvent]:    deal.published !== null,
                  [classes.notPublishedEvent]: deal.published === null,
                }),
            };
          }}
        />
      </div>
    );
  }

  private selectTimeSlot(slotInfo: SlotInfo): void {
    const selectedFrom = (slotInfo.start as Date).valueOf();
    const selectedTo   = (slotInfo.end as Date).valueOf();

    if (selectedFrom < Date.now()) {
      globalMessageService.pushMessage({
        message: commonLocale.validationErrors.apiDeal.date.validFrom.isFuture,
        variant: 'warning',
      });
      return;
    }

    this.setState({ isConfirmationOpen: true, selectedFrom, selectedTo });
  }

  private createDealWithSelected(): void {
    const { selectedFrom, selectedTo } = this.state;

    if (selectedFrom && selectedFrom < Date.now()) {
      globalMessageService.pushMessage({
        message: commonLocale.validationErrors.apiDeal.date.validFrom.isFuture,
        variant: 'warning',
      });
      return;
    }

    const company = companyStore.currentCompany;

    if (company === undefined) {
      return;
    }

    createDealWizardStore.reset();
    createDealWizardStore.setDate({ validFrom: selectedFrom, validTo: selectedTo });

    dashboardAnalyticsService.trackEvent({
      category: 'dashboard',
      action:   'add-new-deal',
      label:    AddNewDealLabel.CalendarSelect,
    });
    routeService.routeTo(DashboardRoutes.NewDeal, { companyId: company.id });
  }

  private hideConfirmation(): void {
    this.setState({ isConfirmationOpen: false });
  }
}

export const DealsCalendar = withWidth()(withStyles(styles)(_DealsCalendar));
