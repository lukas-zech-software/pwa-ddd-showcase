import { sanitize }     from 'class-sanitizer';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TimeInMs }     from '../datetime';
import {
  DealTagsDish,
  DealType,
}                       from '../enums';
import {
  IApiDeal,
  IApiDealDate,
  IApiDealDescription,
  IApiDealDetails,
  IApiDealValue,
}                       from '../interfaces';
import {
  ApiDeal,
  ApiDealDate,
  ApiDealDescription,
  ApiDealDetails,
  ApiDealValue,
}                       from './ApiDeal';

const isValid = (cls: any, data: any): boolean => {
  const instance = plainToClass(cls, data);
  sanitize(instance);
  return validateSync(instance).length === 0;
};

describe('validation', () => {
  describe('ApiDealValue', () => {
    test('originalValue must be bigger than discountValue', () => {
      const originalValueBigger: IApiDealValue = {
        originalValue: 200,
        discountValue: 100,
      };

      const originalValueSmaller: IApiDealValue = {
        originalValue: 200,
        discountValue: 300,
      };

      const valuesEqual: IApiDealValue = {
        originalValue: 200,
        discountValue: 200,
      };

      expect(isValid(ApiDealValue, originalValueBigger)).toBe(true);
      expect(isValid(ApiDealValue, originalValueSmaller)).toBe(false);
      expect(isValid(ApiDealValue, valuesEqual)).toBe(true);
    });

    test('values must be sane', () => {
      const originalValueZero: IApiDealValue = {
        originalValue: 0,
        discountValue: -100,
      };

      const discountValueZero: IApiDealValue = {
        originalValue: 100,
        discountValue: 0,
      };

      const discountValueNegative: IApiDealValue = {
        originalValue: 100,
        discountValue: -1,
      };

      expect(isValid(ApiDealValue, originalValueZero)).toBe(false);
      expect(isValid(ApiDealValue, discountValueZero)).toBe(true);
      expect(isValid(ApiDealValue, discountValueNegative)).toBe(false);
    });
  });

  describe('ApiDealDescription', () => {
    test('title must be between 10 and 55 characters', () => {
      const tooShort: IApiDealDescription = {
        description: 'a'.repeat(20),
        title:       'a',

      };

      const tooLong: IApiDealDescription = {
        description: 'a'.repeat(20),
        title:       'a'.repeat(200),

      };

      const correct: IApiDealDescription = {
        description: 'a'.repeat(20),
        title:       'a'.repeat(20),

      };

      expect(isValid(ApiDealDescription, tooShort)).toBe(false);
      expect(isValid(ApiDealDescription, tooLong)).toBe(false);
      expect(isValid(ApiDealDescription, correct)).toBe(true);
    });

    test('description must be between 10 and 600 characters', () => {
      const tooShort: IApiDealDescription = {
        description: 'a',
        title:       'a'.repeat(20),

      };

      const tooLong: IApiDealDescription = {
        description: 'a'.repeat(1000),
        title:       'a'.repeat(20),

      };

      const correct: IApiDealDescription = {
        description: 'a'.repeat(20),
        title:       'a'.repeat(20),

      };

      expect(isValid(ApiDealDescription, tooShort)).toBe(false);
      expect(isValid(ApiDealDescription, tooLong)).toBe(false);
      expect(isValid(ApiDealDescription, correct)).toBe(true);
    });

    test('tags must be from 1 through 3', () => {
      const noTags: IApiDealDetails = {
        minimumPersonCount:  1,
        reservationRequired: false,
        tags:                [],
      };

      const twoTags: IApiDealDetails = {
        minimumPersonCount:  1,
        reservationRequired: false,
        tags:                [DealTagsDish.Burger, DealTagsDish.Pizza],
      };

      const fourTags: IApiDealDetails = {
        minimumPersonCount:  1,
        reservationRequired: false,
        tags:                [DealTagsDish.Burger, DealTagsDish.Bowl, DealTagsDish.Falafel, DealTagsDish.Pasta],
      };

      expect(isValid(ApiDealDetails, noTags)).toBe(false);
      expect(isValid(ApiDealDetails, twoTags)).toBe(true);
      expect(isValid(ApiDealDetails, fourTags)).toBe(false);
    });
  });

  describe('ApiDealDate', () => {
    test('validFrom must be in the future', () => {
      const now = new Date().valueOf();

      const past: IApiDealDate = {
        validFrom: now - TimeInMs.ONE_HOUR,
        validTo:   now + TimeInMs.ONE_HOUR,
      };

      const hourFromNow: IApiDealDate = {
        validFrom: now + TimeInMs.ONE_HOUR,
        validTo:   now + (TimeInMs.ONE_HOUR * 2),
      };

      expect(isValid(ApiDealDate, past)).toBe(false);
      expect(isValid(ApiDealDate, hourFromNow)).toBe(true);
    });

    test('validFrom must be lower than validTo', () => {
      const now = new Date().valueOf();

      const toBeforeFrom: IApiDealDate = {
        validFrom: now + (TimeInMs.ONE_HOUR * 2),
        validTo:   now + TimeInMs.ONE_HOUR,
      };

      const same: IApiDealDate = {
        validFrom: now + TimeInMs.ONE_HOUR,
        validTo:   now + TimeInMs.ONE_HOUR,
      };

      const fromBeforeTo: IApiDealDate = {
        validFrom: now + TimeInMs.ONE_HOUR,
        validTo:   now + (TimeInMs.ONE_HOUR * 2),
      };

      expect(isValid(ApiDealDate, toBeforeFrom)).toBe(false);
      expect(isValid(ApiDealDate, same)).toBe(false);
      expect(isValid(ApiDealDate, fromBeforeTo)).toBe(true);
    });

    test('validTo must be no more than one day after validFrom', () => {
      const lessThanOneDay: IApiDealDate = {
        validFrom: new Date('2030-01-01T00:00:01').valueOf(),
        validTo:   new Date('2030-01-02T00:00:00').valueOf(),
      };

      const moreThanOneDay: IApiDealDate = {
        validFrom: new Date('2030-01-01T00:00:00').valueOf(),
        validTo:   new Date('2030-01-03T00:00:00').valueOf(),
      };

      expect(isValid(ApiDealDate, lessThanOneDay)).toBe(true);
      expect(isValid(ApiDealDate, moreThanOneDay)).toBe(false);
    });

    test('validTo must be at least 30 minutes after validFrom', () => {
      const now = new Date().valueOf() + TimeInMs.ONE_DAY;

      const lessThan30Minutes: IApiDealDate = {
        validFrom: now,
        validTo:   now + (TimeInMs.ONE_MINUTE * 29),
      };

      const exactly30Minutes: IApiDealDate = {
        validFrom: now,
        validTo:   now + (TimeInMs.ONE_MINUTE * 30),
      };

      const greaterThan30Minutes: IApiDealDate = {
        validFrom: now,
        validTo:   now + (TimeInMs.ONE_MINUTE * 31),
      };

      expect(isValid(ApiDealDate, lessThan30Minutes)).toBe(false);
      expect(isValid(ApiDealDate, exactly30Minutes)).toBe(true);
      expect(isValid(ApiDealDate, greaterThan30Minutes)).toBe(true);
    });

    test('validTo is invalid if after 7am the following day', () => {
      const validFrom = new Date('2030-01-01T17:00:00').valueOf();
      const validTo   = new Date('2030-01-02T07:00:00').valueOf();

      const dealConditions = {
        validFrom,
        validTo,
        minimumPersonCount: 1,
      };

      expect(isValid(ApiDealDate, dealConditions)).toBe(false);
    });

    test('validTo is invalid if between 6 and 7am the following day', () => {
      const validFrom = new Date('2030-01-01T17:00:00').valueOf();
      const validTo   = new Date('2030-01-02T06:55:00').valueOf();

      const dealConditions = {
        validFrom,
        validTo,
        minimumPersonCount: 1,
      };

      expect(isValid(ApiDealDate, dealConditions)).toBe(false);
    });
  });
  describe('canBePublished', () => {
    let publishableDeal: ApiDeal;

    beforeEach(() => {
      const data: IApiDeal = {
        id:          'foo',
        published:   null,
        isStatic:    false,
        staticDays:  undefined,
        skipHolidays:    false,
        image:       'some_valid_image',
        type:        DealType.DISCOUNT,
        description: {
          title:       '0123456789',
          description: '0123456789',
        },
        details:     {
          tags:                [DealTagsDish.Burger],
          minimumPersonCount:  1,
          reservationRequired: false,
        },
        date:        {
          validFrom: Date.now() + TimeInMs.ONE_HOUR,
          validTo:   Date.now() + TimeInMs.ONE_HOUR * 2,
        },
        value:       {
          originalValue: 100,
          discountValue: 50,
        },
      };
      publishableDeal      = plainToClass(ApiDeal, data);
    });

    it('should return false if the deal is published', () => {
      publishableDeal.published = Date.now();

      expect(publishableDeal.canBePublished).toBeFalsy();
    });

    it('should return false if the image file is `default_deal.png`', () => {
      publishableDeal.image = 'http://domain.tld/default_deal.png';

      expect(publishableDeal.canBePublished).toBeFalsy();
    });

    it('should return false if the deal starts in the past', () => {
      publishableDeal.date.validFrom = Date.now() - 1;

      expect(publishableDeal.canBePublished).toBeFalsy();
    });

    it('should return false if the deal has validation errors', () => {
      publishableDeal.description.title = '';

      expect(publishableDeal.canBePublished).toBeFalsy();
    });

    it('should return true when all conditions are met', () => {
      expect(publishableDeal.published).toBeNull();
      expect(publishableDeal.date.validFrom).toBeGreaterThan(Date.now());
      expect(publishableDeal.image.match(/default_deal\.png/)).toBeFalsy();
      expect(validateSync(publishableDeal)).toHaveLength(0);

      expect(publishableDeal.canBePublished).toBeTruthy();
    });
  });
});
