import {
  ALL_OPENING_HOURS_WEEK,
  IApiCompany,
  OpeningHoursWeek,
}                          from '@my-old-startup/common/interfaces';
import { ValidationError } from 'class-validator';

export function getValidationError(errors: ValidationError[] | undefined, propertyName: string): string | undefined {
  if (errors === undefined) {
    return undefined;
  }

  const error = errors.find(x => x.property === propertyName);

  let errorMessage: string | undefined;

  if (error) {
    errorMessage = Object.values<string>(error.constraints)[0];
  }

  return errorMessage;
}

export function getYesterday(currentDay: keyof OpeningHoursWeek): keyof OpeningHoursWeek {
  const dayIndex = ALL_OPENING_HOURS_WEEK.indexOf(currentDay);
  return ALL_OPENING_HOURS_WEEK[dayIndex === 0 ? 0 : dayIndex - 1];
}
