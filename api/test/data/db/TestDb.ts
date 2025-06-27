import { TimeInMs }       from '@my-old-startup/common/datetime';
import {
  CompanyType,
  DealTagsDish,
  DealTagsRegion,
  DealTagsType,
  DealType,
}                         from '@my-old-startup/common/enums';
import {
  inject,
  injectable,
}                         from 'inversify';
import * as loremIpsum    from 'lorem-ipsum';
import { keys }           from '../../../src/container/inversify.keys';
import { ICompanyFacade } from '../../../src/datastore/ICompanyFacade';
import { IUserFacade }    from '../../../src/datastore/IUserFacade';
import { Company }        from '../../../src/ddd/entities/Company';
import { CompanyFactory } from '../../../src/ddd/factories/CompanyFactory';
import { DealFactory }    from '../../../src/ddd/factories/DealFactory';
import {
  ICompany,
  IDeal,
}                         from '../../../src/ddd/interfaces';
import { NumberUtils }    from '../../../src/utils/NumberUtils';

function getRnd(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomTag(enumType: any): string {
  const keys1 = Object.keys(enumType);
  const item  = getRnd(keys1);
  return enumType[item];
}

@injectable()
export class TestDb {
  @inject(keys.ICompanyFactory) private companyFactory: CompanyFactory;
  @inject(keys.IDealFactory) private dealFactory: DealFactory;
  @inject(keys.ICompanyFacade) private companyFacade: ICompanyFacade;
  @inject(keys.IUserFacade) private userFacade: IUserFacade;

  public constructor(@inject(keys.GoogleCloudProjectId) googleCloudProjectId: string) {
    if (googleCloudProjectId !== 'my-old-startup-dev') {
      throw new Error('TestDB only for test environment');
    }
  }

  public async init(): Promise<void> {
    const user = await this.userFacade.create(
      {
        id:               '-',
        created:          Date.now(),
        updated:          Date.now(),
        lastLogin:        Date.now(),
        authId:           'auth0|5b517e829a0b8834e8fa9b2e',
        email:            'user@test-restaurant.test',
        displayName:      'TestUser',
        contactFirstName: '',
        contactName:      '',
        contactPhone:     '',
        contactEmail:     '',
      },
    );

    const company = await this.companyFactory.create();
    company.setData(
      {
        id:               '-',
        created:          Date.now(),
        updated:          Date.now(),
        address:          'Domkloster 4',
        city:             'Köln',
        description:      'Dies ist ein Test Restaurant',
        email:            'restaurant@test-restaurant.test',
        geoHash:          'geoHash',
        type:             CompanyType.RESTAURANT,
        isApproved:       true,
        isBlocked:        false,
        isFirstLogin:     true,
        hasAcceptedTerms: true,
        background:       '/company/default_background.jpg',
        lat:              50.941474,
        lng:              6.958281,
        logo:             '/company/default_logo.jpg',
        openingHours:     {
          monday:  [{
            from: 1130,
            to:   1445,
          }],
          tuesday: [{
            from: 1015,
            to:   1633,
          }],
        },
        owners:           [user.authId],
        telephone:        '01234/56789',
        title:            'Test-Restaurant',
        website:          'www.test.test',
        zipCode:          '50667',
      } as ICompany,
    );

    await company.updateGeoHash();

    await company.create();

    await this.addTestDeals(company);
  }

  public async addTestDeals(
    company: Company,
    date = Date.now(),
  ): Promise<void> {
    const isFoodTruck = company.type === CompanyType.FOODTRUCK;
    await this.addDeal(
      company,
      {
        published:   date,
        isPublished: true,
        validFrom:   date,
        validTo:     date + TimeInMs.ONE_HOUR * 5,
        address:     isFoodTruck ? 'Domkloster 4, 50667 Köln' : undefined,
        location:    isFoodTruck ? {
          lat: 50.941278,
          lng: 6.958281,
        } : undefined,
      },
      date,
    );

    await this.addDeal(
      company,
      {
        published:   null,
        isPublished: false,
        validFrom:   date + TimeInMs.ONE_HOUR * 5,
        validTo:     date + TimeInMs.ONE_HOUR * 9,
        address:     isFoodTruck ? 'Domkloster 4, 50667 Köln' : undefined,
        location:    isFoodTruck ? {
          lat: 50.941278,
          lng: 6.958281,
        } : undefined,
      },
      date,
    );

    await this.addDeal(
      company,
      {
        published:   date,
        isPublished: true,
        validFrom:   date + TimeInMs.ONE_HOUR * 9,
        validTo:     date + TimeInMs.ONE_HOUR * 12,
        address:     isFoodTruck ? 'Domkloster 4, 50667 Köln' : undefined,
        location:    isFoodTruck ? {
          lat: 50.941278,
          lng: 6.958281,
        } : undefined,
      },
      date,
    );
  }

  private async addDeal(
    company: Company,
    dealInput: Partial<IDeal>,
    date: number,
  ): Promise<void> {
    let titlePrefix: string = '';
    let originalValue       = Math.round(Math.random() * 1000000 / 100);
    const discount          = Math.round(Math.random() * 100000 / 100);
    // prevent negative discounts
    const discountValue     = Math.abs(originalValue - discount);

    const deal           = await this.dealFactory.create();
    const rndImage       = NumberUtils.getRandomNumber(1, 57);
    const rndType        = NumberUtils.getRandomNumber(0, 5);
    const rndSpecialType = NumberUtils.getRandomNumber(0, 2);

    if (rndType === DealType.DISCOUNT_2_FOR_1) {
      originalValue = discountValue * 2;
    }
    if (rndType === DealType.DISCOUNT_CATEGORY) {
      titlePrefix = 'Category - ';
    }
    if (rndType === DealType.ADDON) {
      titlePrefix = 'Addon - ';
    }

    deal.setData(
      Object.assign(
        deal,
        {
          id:                 '-',
          created:            Date.now(),
          updated:            Date.now(),
          published:          null,
          isPublished:        null,
          type:               rndType,
          specialType:        rndSpecialType,
          description:        loremIpsum(
            {
              count:               3,
              units:               'paragraphs',
              paragraphUpperBound: 2,
              sentenceUpperBound:  8,
            },
          ),
          title:              titlePrefix + loremIpsum(
            {
              count:              1,
              units:              'sentences',
              sentenceUpperBound: 8,
            },
          ),
          companyId:          company.id,
          originalValue,
          discountValue,
          image:              `/company/0/deals/example_deal_${rndImage}.jpg`,
          minimumPersonCount: 2,
          tags:               [
            getRandomTag(DealTagsDish),
            getRandomTag(DealTagsType),
            getRandomTag(DealTagsRegion),
          ],
          validFrom:          date + TimeInMs.ONE_DAY + TimeInMs.ONE_HOUR * 4,
          validTo:            date + TimeInMs.ONE_DAY + TimeInMs.ONE_HOUR * 8,
        },
        dealInput,
      ),
    );

    await company.addDeal(deal);
  }
}
