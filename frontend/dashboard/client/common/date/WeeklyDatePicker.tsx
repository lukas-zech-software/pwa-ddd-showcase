import { DatePicker as MuiDatePicker } from '@material-ui/pickers';
import moment, { Moment }              from 'moment';
import * as React                      from 'react';
import { Timestamp }                   from '../../../../../common/interfaces';
import { WrappedDatePickerDay }        from './WrappedDatePickerDay';

type Props = {
  onAccept: (timestamps: Timestamp[]) => void;
  selectedTimestamps: Timestamp[];
};

class _WeeklyDatePicker extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.onAccept(moment(this.props.selectedTimestamps[0]));
  }

  public render(): React.ReactNode {
    const { selectedTimestamps } = this.props;

    return (
      <MuiDatePicker
        disablePast
        disableToolbar
        allowKeyboardControl={false}
        variant="static"
        label="Week picker"
        value={selectedTimestamps[0]}
        onChange={this.onAccept}
        renderDay={this.renderWrappedWeekDay}
      />
    );
  }

  private renderWrappedWeekDay = (date: Moment, selectedDate: Moment, dayInCurrentMonth: boolean) => {
    const { selectedTimestamps } = this.props;

    const dateClone = moment(date);

    const isSelected = selectedTimestamps.some((x) => dateClone.isSame(moment(x), 'day'));
    const isFirstDay = dateClone.isSame(selectedTimestamps[0], 'day');
    const isLastDay  = dateClone.isSame(selectedTimestamps[selectedTimestamps.length - 1], 'day');

    return <WrappedDatePickerDay
      date={date}
      isSelected={isSelected}
      isFirst={isFirstDay}
      isLast={isLastDay}
      dayInCurrentMonth={dayInCurrentMonth}/>;
  }

  private onAccept = (date: Moment) => {
    const start                 = moment(date).clone().startOf('week');
    const timestamps: number [] = [start.valueOf()];
    for (let i = 0; i < 6; i++) {
      start.add(1, 'd');
      timestamps.push(start.valueOf());
    }

    this.props.onAccept(timestamps);
  }
}

export const WeeklyDatePicker = _WeeklyDatePicker;
