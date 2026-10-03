import MomentUtils                 from '@date-io/moment';
import {
  Badge,
  CardHeader,
  createStyles,
  Tab,
  Tabs,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                  from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Timestamp }               from '@my-old-startup/common/interfaces';
import * as React                  from 'react';
import { isSpecialType }           from '../../../../../common/enums';
import { createDealWizardStore }   from '../../pages/dashboard/deals/wizard/CreateDealWizardStore';
import { locale }                  from '../locales';
import { MonthlyDatePicker }       from './MonthlyDatePicker';
import { MultipleDatePicker }      from './MultipleDatePicker';
import { SelectedDates }           from './SelectedDates';
import { SingleDatePicker }        from './SingleDatePicker';
import { WeeklyDatePicker }        from './WeeklyDatePicker';

export enum MultiDatePickerVariant {
  Single,
  Multiple,
  Weekly,
  Monthly,
}

const styles = (theme: Theme) => createStyles(
  {
    root:      {
      [theme.breakpoints.down('sm')]: {
        marginLeft:  -24,
        marginRight: -20,
      },

      '& .MuiPickersCalendar-transitionContainer': {
        minHeight: 196,
      },

      '& .MuiPickersMonthSelection-container': {
        margin: '0 auto',
      },

      '& .MuiPickersBasePicker-pickerView': {
        width:          '100%',
        maxWidth:       'none',
        minHeight:      310,
        justifyContent: 'flex-start',

        '& .MuiPickersCalendarHeader-dayLabel': {
          width: '100%',
        },

        '& .MuiPickersCalendar-week [role=presentation]': {
          width: '100%',
        },
      },
    },
    tab:       {
      minWidth:                       'fit-content',
      [theme.breakpoints.down('sm')]: {
        fontSize: '60%',
        width:    '25%',
      },
    },
    badge:     {
      padding: theme.spacing(0.5),
    },
    subheader: {},
  },
);

type Props = WithStyles<typeof styles> & {
  selectedTimestamps: Timestamp[];

  onSubmit: (timestamps: Timestamp[]) => void;
};

type State = {
  selectedVariant: MultiDatePickerVariant;
};

class _DatePickerCard extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      selectedVariant: MultiDatePickerVariant.Single,
    };
  }

  public getDatePickerVariant(): React.ReactNode {
    const { selectedVariant }              = this.state;
    const { onSubmit, selectedTimestamps } = this.props;
    // eslint-disable-next-line default-case
    switch (selectedVariant) {
      case MultiDatePickerVariant.Single:
        return <SingleDatePicker
          selectedTimestamps={selectedTimestamps}
          onAccept={onSubmit}/>;
      case MultiDatePickerVariant.Multiple:
        return <MultipleDatePicker
          selectedTimestamps={selectedTimestamps}
          onAccept={onSubmit}/>;
      case MultiDatePickerVariant.Weekly:
        return <WeeklyDatePicker
          selectedTimestamps={selectedTimestamps}
          onAccept={onSubmit}/>;
      case MultiDatePickerVariant.Monthly:
        return <MonthlyDatePicker
          selectedTimestamps={selectedTimestamps}
          onAccept={onSubmit}/>;
    }
  }

  public getTabs(): React.ReactNode {
    const { classes }         = this.props;
    const isSpecial           = isSpecialType(createDealWizardStore.deal.type);
    const { selectedVariant } = this.state;

    if (isSpecial) {
      return (
        <>
          <Typography variant="h6" style={{fontSize:'100%', textAlign:'center'}}>
            {locale.forms.apiDealConditions.datepicker.specialHint}
          </Typography>
          <Tabs indicatorColor="secondary"
                centered
                value={selectedVariant}
                onChange={(event, n) => this.selectTab(n)}
          >
            <Tab key={'Single'}
                 className={classes.tab}
                 label={locale.forms.apiDealConditions.datepicker.tabs[MultiDatePickerVariant.Single]}/>
          </Tabs>
        </>
      );
    }

    return (
      <Tabs indicatorColor="secondary"
            centered
            value={selectedVariant}
            onChange={(event, n) => this.selectTab(n)}
      >
        <Tab key={'Single'}
             className={classes.tab}
             label={locale.forms.apiDealConditions.datepicker.tabs[MultiDatePickerVariant.Single]}/>
        <Tab key={'Multiple'}
             className={classes.tab}
             label={locale.forms.apiDealConditions.datepicker.tabs[MultiDatePickerVariant.Multiple]}/>
        <Tab key={'Weekly'}
             className={classes.tab}
             label={locale.forms.apiDealConditions.datepicker.tabs[MultiDatePickerVariant.Weekly]}/>
        <Tab key={'Monthly'}
             className={classes.tab}
             label={locale.forms.apiDealConditions.datepicker.tabs[MultiDatePickerVariant.Monthly]}/>
      </Tabs>
    );
  }

  public render(): React.ReactNode {
    const { classes, selectedTimestamps, onSubmit } = this.props;
    const { selectedVariant }                       = this.state;

    return (
      <>
        {this.getTabs()}
        <MuiPickersUtilsProvider utils={MomentUtils} locale={locale.format.dateLocale}>
          <div className={classes.root}>
            {this.getDatePickerVariant()}
          </div>
        </MuiPickersUtilsProvider>

        <CardHeader className={classes.subheader}
                    subheader={(
                      <Badge color="primary" className={classes.badge} badgeContent={selectedTimestamps.length}>
                        {locale.forms.apiDealConditions.datepicker.dateListHeader}
                      </Badge>
                    )}/>
        <SelectedDates selectedTimestamps={selectedTimestamps} selectedVariant={selectedVariant} onChange={onSubmit}/>
      </>
    );
  }

  private selectTab(variant: MultiDatePickerVariant): void {
    this.setState({ selectedVariant: variant });
  }
}

export const DatePickerCard = withStyles(styles)(_DatePickerCard);
