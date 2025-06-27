import { createStyles, IconButton, InputAdornment, Theme, withStyles, WithStyles } from '@material-ui/core';
import { Today }                                                                   from '@material-ui/icons';
import { DatePicker as MUIDatePicker }                                             from '@material-ui/pickers';
// eslint-disable-next-line @typescript-eslint/tslint/config
import { Timestamp }                                                               from '@my-old-startup/common/interfaces';
import moment, { Moment }                                                          from 'moment';
import * as React                                                                  from 'react';
import { locale }                                                                  from '../locales';
import { WrappedDatePickerDay }                                                    from './WrappedDatePickerDay';

const styles = (theme: Theme) => createStyles({
  datePicker: {
    margin:    theme.spacing(1),
    '& input': {
      cursor: 'pointer',
    },
  },
});

type Props = WithStyles<typeof styles> & {
  selectedTimestamps: Timestamp[];

  onAccept(timestamps: Timestamp[]): void;
};

class _SingleDatePicker extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.props.onAccept([this.props.selectedTimestamps[0]]);
  }

  public render(): React.ReactNode {
    const { classes, selectedTimestamps } = this.props;

    return (
      <MUIDatePicker
        format={locale.format.dateString}
        autoOk
        disablePast
        variant="static"
        disableToolbar
        allowKeyboardControl={false}
        onChange={(x) => {
          if (x) { this.props.onAccept([x.valueOf()]); }
        }}
        showTodayButton
        todayLabel={locale.dashboard.cards.dealCalendar.calendar.today}
        value={selectedTimestamps[0]}
        className={classes.datePicker}
        renderDay={this.renderWrappedWeekDay}

        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <Today/>
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  }

  private renderWrappedWeekDay = (date: Moment, selectedDate: Moment, dayInCurrentMonth: boolean) => {
    const { selectedTimestamps } = this.props;

    const dateClone = moment(date);

    const isSelected = dateClone.isSame(moment(selectedTimestamps[0]), 'day');

    return <WrappedDatePickerDay date={date} isSelected={isSelected} dayInCurrentMonth={dayInCurrentMonth}/>;
  }
}

export const SingleDatePicker = withStyles(styles)(_SingleDatePicker);
