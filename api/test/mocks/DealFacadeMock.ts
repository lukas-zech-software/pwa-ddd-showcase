import { TimeInMs }       from '@my-old-startup/common/datetime';
import {
  DealTagsDish,
  DealType,
}                         from '@my-old-startup/common/enums';
import { injectable }     from 'inversify';
import { IDealFacade }    from '../../src/datastore/IDealFacade';
import { IDeal }          from '../../src/ddd/interfaces';
import { AutoSpy }        from '../utils/autoSpy';
import { BaseFacadeMock } from './BaseFacadeMock';

@AutoSpy()
@injectable()
export class DealFacadeMock extends BaseFacadeMock<IDeal> implements IDealFacade {
  public mockData: IDeal[] = [
    {
      id:                  'id',
      type:                DealType.DISCOUNT,
      companyId:           'companyId',
      created:             0,
      updated:             0,
      published:           1,
      lastGenerated:       1,
      isPublished:         true,
      isStatic:            false,
      isSpecial:           false,
      staticDays:          undefined,
      skipHolidays:        false,
      description:         'description',
      title:               'title',
      originalValue:       20,
      discountValue:       10,
      image:               'image.jpg',
      minimumPersonCount:  2,
      reservationRequired: false,
      tags:                [DealTagsDish.Burger],
      validFrom:           Date.now() + TimeInMs.ONE_HOUR,
      validTo:             Date.now() + TimeInMs.ONE_HOUR * 2,
    },
  ];

  public async getForCompany(): Promise<IDeal[]> {
    return this.mockData;
  }

  public async getStatic(): Promise<IDeal[]> {
    return this.mockData;
  }

  public async getByDateRange(): Promise<IDeal[]> {
    return this.mockData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getAllByDateRange(validFrom: number, validTo: number): Promise<IDeal[]> {
    return this.mockData;
  }
}
