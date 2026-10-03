import {
  Avatar,
  Chip,
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Hidden,
  Theme,
  Tooltip,
  Typography,
  withStyles,
  WithStyles,
}                                           from '@material-ui/core';
import {
  Delete,
  ExpandMore,
  FreeBreakfast,
  TimerOff,
}                                           from '@material-ui/icons';
import {
  IApiCompany,
  OpeningHourEntry,
  OpeningHoursDay,
  OpeningHoursWeek,
}                                           from '@my-old-startup/common/interfaces';
import { globalMessageService }             from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { getHourText }                      from '@my-old-startup/frontend-common/utils/format';
import Moment                               from 'moment';
import { extendMoment }                     from 'moment-range';
import * as React                           from 'react';
import { FormTooltip }                      from '../../../../common/FormTooltip';
import { locale }                           from '../../../../common/locales';
import { getYesterday }                     from '../../../../common/utils/utils';
import { companyStore }                     from '../../../../stores/CompanyStore';
import { CompanyOpeningHoursDialog }        from './CompanyOpeningHoursDialog';
import { CompanyOpeningHoursPickerOptions } from './CompanyOpeningHoursPickerOptions';
import { DayCheckbox }                      from './DayCheckBox';

const moment = extendMoment(Moment);

const styles = (theme: Theme) => createStyles({
                                                root:             {
                                                  width: '100%',
                                                },
                                                heading:          {
                                                  fontSize: theme.typography.pxToRem(15),
                                                },
                                                secondaryHeading: {
                                                  fontSize: theme.typography.pxToRem(15),
                                                  color:    theme.palette.text.secondary,
                                                },
                                                tooltip:          {
                                                  marginTop: theme.spacing(2.5),
                                                },
                                                icon:             {
                                                  verticalAlign: 'bottom',
                                                  height:        20,
                                                  width:         20,
                                                },
                                                details:          {
                                                  alignItems: 'center',
                                                },
                                                helper:           {
                                                  borderLeft: `2px solid ${theme.palette.divider}`,
                                                  padding:    `12px 2px 0px 0px!important`,

                                                  '& button': {
                                                    margin:  8,
                                                    padding: `4px !important`,
                                                  },
                                                },
                                                link:             {
                                                  color:          theme.palette.primary.main,
                                                  textDecoration: 'none',
                                                  '&:hover':      {
                                                    textDecoration: 'underline',
                                                  },
                                                },
                                                closedAvatar:     {
                                                  backgroundColor: theme.palette.grey[300],
                                                },
                                                breakAvatar:      {
                                                  backgroundColor: theme.palette.grey[200],
                                                  height:          30,
                                                  width:           30,
                                                  '& svg':         {
                                                    fontSize: 16,
                                                  },
                                                },
                                                chipsContainer:   {
                                                  display:    'flex',
                                                  flexWrap:   'wrap',
                                                  alignItems: 'center',
                                                },
                                                chip:             {
                                                  margin:   theme.spacing(1),
                                                  minWidth: 120,
                                                },
                                                buttonGroup:      {
                                                  margin:     theme.spacing(1),
                                                  '& button': {
                                                    margin: 0,
                                                  },
                                                },
                                              });

type Props = {
  company: IApiCompany;
  defaultOpen?: boolean;
} & WithStyles<typeof styles>;

type State = {
  firstOpen: boolean;
  isDialogOpen: boolean;
  isSectionOpen: boolean;
  currentDay: keyof OpeningHoursWeek | undefined;
};

// TODO: REFACTOR
// The logic should be extracted to a service the data should be handled in a store
// and having something like a *TimeSpan* class _to collect the logic of comparing would be great

class _CompanyOpeningHoursPicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      firstOpen:     false,
      isSectionOpen: !!props.defaultOpen,
      isDialogOpen:  false,
      currentDay:    undefined,
    };
  }

  public render(): JSX.Element {
    const { classes, defaultOpen } = this.props;

    return (
      <div className={classes.root}>
        <ExpansionPanel defaultExpanded={defaultOpen}
                        expanded={this.state.isSectionOpen}
                        onChange={(e, isSectionOpen) =>
                          this.setState({
                                          isSectionOpen,
                                          firstOpen: true,
                                        })}>
          <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography component={'div' as any}
                            className={classes.heading}>{locale.forms.apiCompanyDetails.fields.openingHours}
                  <FormTooltip inline title={locale.forms.apiCompanyDetails.tooltips.openingHours}/>
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={classes.secondaryHeading}>
                  {locale.forms.apiCompanyDetails.openingHoursForm.hint}
                </Typography>
              </Grid>
            </Grid>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails className={classes.details}>
            <Grid container spacing={3} style={{ flexWrap: 'wrap' }}>

              <Hidden xsDown>
                <Grid item sm={3}>
                  <Typography className={classes.heading}>
                    {locale.forms.apiCompanyDetails.openingHoursForm.header.open}
                  </Typography>
                </Grid>

                <Grid item sm={8}>
                  <Typography className={classes.heading}>
                    {locale.forms.apiCompanyDetails.openingHoursForm.header.openingHours}
                  </Typography>
                </Grid>
              </Hidden>

              {this.getRow(locale.common.weekday.monday, 'monday')}

              {this.getRow(locale.common.weekday.tuesday, 'tuesday')}

              {this.getRow(locale.common.weekday.wednesday, 'wednesday')}

              {this.getRow(locale.common.weekday.thursday, 'thursday')}

              {this.getRow(locale.common.weekday.friday, 'friday')}

              {this.getRow(locale.common.weekday.saturday, 'saturday')}

              {this.getRow(locale.common.weekday.sunday, 'sunday')}

            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <CompanyOpeningHoursDialog
          label={locale.common.weekday[this.state.currentDay || 'monday']}
          open={this.state.isDialogOpen}
          onSubmit={(entry) => this.addEntry(entry)}
          onAbort={() => this.setState({ isDialogOpen: false })}/>
      </div>
    );
  }

  private getRow(label: string, currentDay: keyof OpeningHoursWeek): React.ReactNode {
    const { classes, company } = this.props;

    const openingHours           = company.details.openingHours || {};
    const hours: OpeningHoursDay = Array.from(openingHours[currentDay] || []).sort((a, b) => a.from - b.from);
    const closedTooltip          = locale.forms.apiCompanyDetails.openingHoursForm.hintDayClosed(label);
    const closedTooltipShort     = locale.forms.apiCompanyDetails.openingHoursForm.hintDayClosedShort(label);

    return (
      <>
        <Grid item xs={12} sm={3}>
          <DayCheckbox checked={openingHours[currentDay] !== undefined} label={label} tooltip={closedTooltip}
                       onChange={() => {
                         if (openingHours[currentDay] === undefined) {
                           this.setState({
                                           isDialogOpen: true,
                                           currentDay,
                                         });
                         } else {
                           openingHours[currentDay] = undefined;
                           this.setState({
                                           isDialogOpen: false,
                                           currentDay:   undefined,
                                         });
                         }
                       }}/>
        </Grid>

        <Grid item xs={11} sm={8} className={classes.chipsContainer}>
          {hours.length === 0 && (
            <Tooltip title={closedTooltipShort}>
              <Avatar className={classes.closedAvatar}>
                <TimerOff/>
              </Avatar>
            </Tooltip>)}

          {hours.map((x, i) => (
            [
              <Tooltip key={i}
                       disableHoverListener
                       title={locale.forms.apiCompanyDetails.openingHoursForm.tooltipChip(label,
                                                                                          getHourText(x.from),
                                                                                          getHourText(x.to))}>
                <Chip label={`${getHourText(x.from)} - ${getHourText(x.to)}`}
                      className={classes.chip}
                      color="secondary"
                      deleteIcon={(
                        <Tooltip title={locale.forms.apiCompanyDetails.openingHoursForm.tooltipDelete}>
                          <Delete/>
                        </Tooltip>
                      )}
                      onDelete={() => this.removeEntry(i, currentDay)}/>
              </Tooltip>,
              i !== hours.length - 1 && (
                <Tooltip key={'break-' + i}
                         title={locale
                           .forms
                           .apiCompanyDetails
                           .openingHoursForm
                           .tooltipBreakChip(label,
                                             getHourText(x.to),
                                             getHourText(hours[i + 1].from))}>
                  <Avatar className={classes.breakAvatar}>
                    <FreeBreakfast/>
                  </Avatar>
                </Tooltip>
              ),
            ]
          ))}
        </Grid>

        <Grid item xs={1} className={classes.helper}>
          <CompanyOpeningHoursPickerOptions label={label}
                                            firstOpen={this.state.firstOpen && currentDay === 'monday'}
                                            cloneDay={(x) => this.cloneDay(x)}
                                            removeAllEntries={(x) => this.removeAllEntries(x)}
                                            openDialog={() => this.setState({
                                                                              isDialogOpen: true,
                                                                              currentDay,
                                                                            })}
                                            currentDay={currentDay}

          />
        </Grid>
      </>
    );
  }

  private removeAllEntries(currentDay: keyof OpeningHoursWeek): void {
    const { company } = this.props;
    if (company.details.openingHours !== undefined) {
      company.details.openingHours[currentDay] = undefined;
    }
    this.forceUpdate();
  }

  private removeEntry(index: number, currentDay: keyof OpeningHoursWeek): void {
    const { company } = this.props;
    if (company.details.openingHours !== undefined) {
      const weekdays = company.details.openingHours[currentDay];
      if (weekdays !== undefined) {
        weekdays.splice(index, 1);
        if (weekdays.length === 0) {
          company.details.openingHours[currentDay] = undefined;
        }
        this.forceUpdate();
      }
    }
  }

  private cloneDay(currentDay: keyof OpeningHoursWeek): void {
    const { company } = this.props;

    const yesterday = getYesterday(currentDay);

    if (company.details.openingHours === undefined || company.details.openingHours[yesterday] === undefined) {
      company.details.openingHours             = company.details.openingHours || {};
      company.details.openingHours[currentDay] = undefined;
      return;
    }

    // clone the array, else all rows would have the same ref to one array
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    company.details.openingHours[currentDay] = Array.from(company.details.openingHours[yesterday]);
    this.forceUpdate();
  }

  private addEntry(newEntry: OpeningHourEntry): void {
    const currentDay = this.state.currentDay;

    if (currentDay === undefined) {
      this.setState({ isDialogOpen: false });
      return;
    }

    const { company } = this.props;

    if (companyStore.currentCompany) {
      companyStore.addDirty('openingHours');
    }

    if (company.details.openingHours === undefined) {
      company.details.openingHours = {};
    }

    const openingHourEntries = company.details.openingHours[currentDay] || [];

    const isOverlappingWithPreviousEntry = openingHourEntries.reduce(
      (flag, entry) => {
        const newEntryRange = moment.range(moment(newEntry.from), moment(newEntry.to));
        const entryRange    = moment.range(moment(entry.from), moment(entry.to));
        return flag || newEntryRange.overlaps(entryRange);
      },
      false,
    );

    if (isOverlappingWithPreviousEntry) {
      globalMessageService.pushMessage({
                                         message: locale.forms.apiCompanyDetails.openingHoursForm.header.overlappingWarning,
                                         variant: 'warning',
                                       });

      return;
    }
    openingHourEntries.push(newEntry);
    company.details.openingHours[currentDay] = [...openingHourEntries.sort((a, b) => a.to - b.to)];

    this.setState({ isDialogOpen: false });
  }
}

export const CompanyOpeningHoursPicker = withStyles(styles)(_CompanyOpeningHoursPicker);

