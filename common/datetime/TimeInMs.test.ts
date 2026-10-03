import { TimeInMs } from './TimeInMs';

describe('TimeInMs', () => {
  /**
   * Kind of silly, but can never be too safe...
   */
  test('affects dates as expected', () => {
    const date       = new Date(0);
    const plusSecond = new Date(date.valueOf() + TimeInMs.ONE_SECOND);
    const plusMinute = new Date(date.valueOf() + TimeInMs.ONE_MINUTE);
    const plusHour   = new Date(date.valueOf() + TimeInMs.ONE_HOUR);
    const plusDay    = new Date(date.valueOf() + TimeInMs.ONE_DAY);
    const plusWeek   = new Date(date.valueOf() + TimeInMs.ONE_WEEK);

    expect(plusSecond.getSeconds()).toEqual(date.getSeconds() + 1);
    expect(plusMinute.getMinutes()).toEqual(date.getMinutes() + 1);
    expect(plusHour.getHours()).toEqual(date.getHours() + 1);
    expect(plusDay.getDate()).toEqual(date.getDate() + 1);
    expect(plusWeek.getDate()).toEqual(date.getDate() + 7);
  });
});
