/* eslint-disable */
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { locale }                                                    from '../common/locales';
import {
  GeoPoint,
  IApiDealDate,
} from '../interfaces';

export function IsLessThanOrEqualTo(options: { otherPropertyName: string }, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isLessThanOrEqualTo',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments) {
          const object = validationArguments.object as any;

          if (typeof value !== 'number' || typeof object[options.otherPropertyName] !== 'number') {
            return false;
          }

          return value <= object[options.otherPropertyName];
        },
        defaultMessage: () => `${options.otherPropertyName} should be lower than or equal to ${propertyName}`,
      },
    });
  };
}

export function IsGreaterThanOrEqualTo(options: { otherPropertyName: string }, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isGreaterThanOrEqualTo',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments) {
          const object = validationArguments.object as any;

          if (typeof value !== 'number' || typeof object[options.otherPropertyName] !== 'number') {
            return false;
          }

          return value >= object[options.otherPropertyName];
        },
        defaultMessage: () => `${options.otherPropertyName} should be greater than or equal to${propertyName}`,
      },
    });
  };
}

export function IsLessThan(options: { lessThanPropertyName: string }, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isLessThan',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments) {
          const object = validationArguments.object as any;

          if (typeof value !== 'number' || typeof object[options.lessThanPropertyName] !== 'number') {
            return false;
          }

          return value < object[options.lessThanPropertyName];
        },
        defaultMessage: () => `${options.lessThanPropertyName} should be lower than ${propertyName}`,
      },
    });
  };
}

export function IsGreaterThan(options: { greaterThanPropertyName: string }, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isGreaterThan',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments) {
          const object = validationArguments.object as any;

          if (typeof value !== 'number' || typeof object[options.greaterThanPropertyName] !== 'number') {
            return false;
          }

          return value > object[options.greaterThanPropertyName];
        },
        defaultMessage: () => `${options.greaterThanPropertyName} should be bigger than ${propertyName}`,
      },
    });
  };
}

export function IsMaxDifference(options: { property: string, difference: number }, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isGreaterThan',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments) {
          const object = validationArguments.object as any;

          if (typeof value !== 'number' || typeof object[options.property] !== 'number') {
            return false;
          }

          return Math.abs(value - object[options.property]) <= options.difference;
        },
        defaultMessage: () => `${options.property} should be bigger than ${propertyName}`,
      },
    });
  };
}

export function IsMinDifference(options: { property: string, difference: number },
  validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isLessThan',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: any, validationArguments: ValidationArguments): boolean {
          const object = validationArguments.object as any;
          if (typeof value !== 'number' || typeof object[options.property] !== 'number') {
            return false;
          }

          return Math.abs(value - object[options.property]) >= options.difference;
        },
        defaultMessage: () => `${options.property} should be at least ${options.difference} bigger than ${propertyName}`,
      },
    });
  };
}

export function IsNotAfter6amWhenDealSpansOvernight(options: undefined, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'IsNotAfter6amWhenDealSpansOvernight',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: number, validationArguments: ValidationArguments): boolean {
          const dates: IApiDealDate = validationArguments.object as any;
          const validTo                        = new Date(value);
          if (new Date(dates.validFrom).getDate() !== validTo.getDate()) {
            return validTo.getHours() < 6 || (validTo.getHours() === 6 && validTo.getMinutes() === 0);
          }
          return true;
        },
        defaultMessage: () => 'Overnight Deal cannot span beyond 6am',
      },
    });
  };
}

export function IsFuture(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isFuture',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: number) {
          return value > Date.now();
        },
        defaultMessage: () => 'Timestamp must be in the future',
      },
    });
  };
}

export function IsGeoPoint(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name:        'isGeoPoint',
      target:      object.constructor,
      propertyName,
      constraints: [],
      options:     validationOptions,
      validator:   {
        validate(value: GeoPoint) {
          return isNaN(value.lat) === false && isNaN(value.lng) === false;
        },
        defaultMessage: () => locale.validationErrors.apiDeal.location.isGeoPoint,
      },
    });
  };
}
