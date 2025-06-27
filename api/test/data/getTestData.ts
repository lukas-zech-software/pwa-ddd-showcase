import {
  DealTagsDish,
  DealType,
}                        from '@my-old-startup/common/enums';
import { IApiDeal }      from '@my-old-startup/common/interfaces';
import { IDealInstance } from '../../src/ddd/interfaces';
import { DealMock }      from '../mocks/DealMock';

export function getTestApiDeal(): IApiDeal {
  return {
    id:           'deal.id' + Math.random(),
    published:    0,
    isStatic:     undefined,
    staticDays:   undefined,
    skipHolidays: undefined,
    image:        'deal.image',
    type:         DealType.DISCOUNT,
    value:        {
      originalValue: Math.random(),
      discountValue: Math.random(),
    },

    description: {
      title:       'deal.title',
      description: 'deal.description',
    },

    details: {
      tags:                [DealTagsDish.Burger],
      minimumPersonCount:  2,
      reservationRequired: false,
    },

    location: {
      location: {
        lat: 1,
        lng: 2,
      },
      address:  'deal.address',
    },

    date: {
      validFrom: 1000,
      validTo:   2000,
    },
  };
}

export function getTestDeal(): IDealInstance {
  const deal = new DealMock();
  deal.setData(
    {
      id:                  'deal.id' + Math.random(),
      type:                DealType.DISCOUNT,
      isSpecial:           false,
      published:           0,
      created:             0,
      originalValue:       2,
      discountValue:       1,
      title:               'apiDeal.facts.title',
      description:         'apiDeal.facts.description',
      image:               'apiDeal.facts.image',
      tags:                [DealTagsDish.Burger],
      location:            {
        lat: 1,
        lng: 2,
      },
      validFrom:           1000,
      validTo:             2000,
      minimumPersonCount:  2,
      reservationRequired: false,
    },
  );

  return deal;
}
