/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DayOfWeek,
  DealTags,
  DealType,
}                  from '@my-old-startup/common/enums';
import {
  DealImageUrl,
  GeoPoint,
  Monetary,
  Timestamp,
}                  from '@my-old-startup/common/interfaces';
import { Deal }    from '../../src/ddd/entities/Deal';
import {
  IDeal,
  IDealInstance,
}                  from '../../src/ddd/interfaces';
import { AutoSpy } from '../utils/autoSpy';

@AutoSpy()
export class DealMock implements IDealInstance {
  public address: string;
  public companyId: string;
  public created: number;
  public description: string;
  public discountValue: Monetary;
  public id: string;
  public type: DealType;
  public image: DealImageUrl;
  public isPublished: boolean | null;
  public lastGenerated: number | undefined;
  public isStatic: boolean | undefined;
  public isSpecial: boolean;
  public staticDays: DayOfWeek[] | undefined;
  public skipHolidays: boolean | undefined;
  public isStatiskipHolidays: boolean | undefined;
  public location: GeoPoint;
  public minimumPersonCount: number;
  public reservationRequired: boolean;
  public originalValue: Monetary;
  public published: number | null;
  public tags: DealTags[];
  public updated: number;
  public validFrom: Timestamp;
  public title: string;
  public validTo: Timestamp;

  public async delete(): Promise<void> {
  }

  public async publish(): Promise<void> {
  }

  public async create(companyId: string): Promise<Deal> {
    throw new Error('DealMock.create');
  }

  public async update(inputDeal?: Partial<IDeal>): Promise<void> {
  }

  public async updateImage(path: string, companyId: string): Promise<void> {
  }

  public setData(deal: Partial<IDeal>): IDealInstance {
    Object.assign(this, deal);
    return this;
  }
}
