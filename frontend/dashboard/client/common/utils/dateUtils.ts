import * as moment   from 'moment';
import { TimeInMs }  from '../../../../../common/datetime';
import { Timestamp } from '../../../../../common/interfaces';

export function todayOrAfter(selectedTimestamps: number[]): number[] {
  return selectedTimestamps.filter((x) => x !== undefined && moment(x).isSameOrAfter(moment(), 'day'));
}

export function roundMinutes(timestamp: Timestamp, offset: number): Timestamp {
  let date      = moment(timestamp);
  const minutes = date.minutes();

  if (minutes % offset !== 0) {
    let minute = Math.ceil(date.minutes() / offset) * offset;
    if (minute >= 60) {
      date   = moment(date.valueOf() + TimeInMs.ONE_HOUR);
      minute = minute % 60;
    }
    date.minute(minute);
  }

  return date.valueOf();
}

export function getDateTomorrow(timestamp: number): number {
  const tomorrow = moment().add(1, 'day');
  const date     = moment(timestamp);
  tomorrow.minute(date.minute());
  tomorrow.hour(date.hour());

  return tomorrow.valueOf();
}
