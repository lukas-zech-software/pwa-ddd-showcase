import { DatePicker as MuiDatePicker } from '@material-ui/pickers';
import moment, { Moment }              from 'moment';
import * as React                      from 'react';
import { Timestamp }                   from '../../../../../common/interfaces';
import { WrappedDatePickerDay }        from './WrappedDatePickerDay';

type Props = {
  onAccept: (timestamps: Timestamp[]) => void;
  selectedTimestamps: Timestamp[];
};

export class MonthlyDatePicker extends React.PureComponent<Props> {
  public componentDidMount(): void {
    this.onAccept(moment(this.props.selectedTimestamps[0]));
  }

  public render(): React.ReactNode {
    const { selectedTimestamps } = this.props;

    return (
      <MuiDatePicker
        views={['month']}
        openTo="month"
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
    const dateClone         = moment(date).clone();
    const selectedDateClone = moment(selectedDate).clone();

    const isSelected = dateClone.isSame(selectedDateClone, 'month');

    return <WrappedDatePickerDay
      date={date}
      isSelected={isSelected}
      dayInCurrentMonth={dayInCurrentMonth}/>;
  }

  private onAccept = (date: Moment) => {
    const start                 = moment(date).clone().startOf('month');
    const end                   = moment(date).clone().endOf('month');
    const timestamps: number [] = [start.valueOf()];

    const numberOfDays = end.diff(start, 'days');

    for (let i = 0; i < numberOfDays; i++) {
      start.add(1, 'd');
      timestamps.push(start.valueOf());
    }

    this.props.onAccept(timestamps);
  }
}
