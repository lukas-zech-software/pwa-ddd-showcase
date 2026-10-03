import { DatePicker as MuiDatePicker } from '@material-ui/pickers';
import moment, { Moment }              from 'moment';
import * as React                      from 'react';
import { Timestamp }                   from '../../../../../common/interfaces';
import { WrappedDatePickerDay }        from './WrappedDatePickerDay';

type Props = {
  onAccept: (timestamps: Timestamp[]) => void;
  selectedTimestamps: Timestamp[];
};

class _MultipleDatePicker extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { onAccept, selectedTimestamps } = this.props;

    return (
      <MuiDatePicker
        disablePast
        disableToolbar
        variant="static"
        allowKeyboardControl={false}
        value={selectedTimestamps[selectedTimestamps.length - 1]}
        onChange={(date: Moment) => {
          // don't mutate parents props directly
          const clonedValues = [...selectedTimestamps];
          const index        = clonedValues.indexOf(date.valueOf());

          if (index !== -1) {
            clonedValues.splice(index, 1);
            onAccept(clonedValues);
          } else {
            onAccept([...clonedValues, date.valueOf()]);
          }
        }}
        renderDay={this.renderWrappedWeekDay}
      />
    );
  }

  private renderWrappedWeekDay = (date: Moment, selectedDate: Moment, dayInCurrentMonth: boolean) => {
    const { selectedTimestamps } = this.props;

    const dateClone = moment(date);

    const isSelected = selectedTimestamps.some((x) => dateClone.isSame(moment(x), 'day'));

    return <WrappedDatePickerDay date={date} isSelected={isSelected} dayInCurrentMonth={dayInCurrentMonth}/>;
    // eslint-disable-next-line @typescript-eslint/tslint/config
  };
}

export const MultipleDatePicker = _MultipleDatePicker;
