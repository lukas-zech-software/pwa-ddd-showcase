/* eslint-disable @typescript-eslint/no-unused-vars */
import { CompanyType }      from '@my-old-startup/common/enums';
import { CompanyFilter }    from '@my-old-startup/common/interfaces';
import { injectable }       from 'inversify';
import { IGeoSearchResult } from '../../src/api/interfaces/geo';
import { ICompanyFacade }   from '../../src/datastore/ICompanyFacade';
import {
  ICompany,
  ISearchResult,
}                           from '../../src/ddd/interfaces';
import { AutoSpy }          from '../utils/autoSpy';
import { BaseFacadeMock }   from './BaseFacadeMock';

@AutoSpy()
@injectable()
export class CompanyFacadeMock extends BaseFacadeMock<ICompany>
  implements ICompanyFacade {

  public get mockData(): ICompany[] {
    return [{
      id:                        'id',
      created:                   0,
      updated:                   0,
      address:                   'address',
      city:                      'city',
      description:               'description',
      email:                     'email',
      geoHash:                   'geoHash',
      isApproved:                true,
      hasAcceptedTerms:          true,
      hasSubscribedToNewsletter: true,
      isBlocked:                 false,
      isFirstLogin:              false,
      background:                'background',
      lat:                       0,
      lng:                       0,
      logo:                      'logo',
      openingHours:             {
        monday:  [{
          from: 1130,
          to:   1445,
        }],
        tuesday: [{
          from: 1015,
          to:   1633,
        }],
      },
      prefersReservations:      false,
      owners:                   ['authUserId'],
      telephone:                'telephone',
      secondaryTelephone:       'secondaryTelephone',
      secondaryTelephoneReason: 'secondaryTelephoneReason',
      title:                    'RESTAURANT',
      website:                  'website',
      menuDocument:             'menuDocument',
      zipCode:                  'zipCode',
      type:                     CompanyType.RESTAURANT,
      //CORONA
      offersDelivery:           true,
      deliveryDescription:      'deliveryDescription',
      offersReopen:             true,
      reopenDescription:        'reopenDescription',
      offersCoupons:            true,
      offersTakeAway:           true,
      takeAwayDescription:      'deliveryDescription',
      couponsDescription:       'couponsDescription',
      acceptsDonations:         true,
      donationsDescription:     'donationsDescription',
      //CORONA

    }, {
      id:                        'id2',
      created:                   0,
      updated:                   0,
      address:                   'address2',
      city:                      'city2',
      description:               'description2',
      email:                     'email2',
      geoHash:                   'geoHash2',
      isApproved:                true,
      hasAcceptedTerms:          true,
      hasSubscribedToNewsletter: true,
      isBlocked:                 false,
      isFirstLogin:              false,
      background:                'background2',
      lat:                       0,
      lng:                       0,
      logo:                      'logo2',
      openingHours:              {
        monday:  [{
          from: 1130,
          to:   1445,
        }],
        tuesday: [{
          from: 1015,
          to:   1633,
        }],
      },
      prefersReservations:       false,
      owners:                    ['authUserId2'],
      telephone:                 'telephone2',
      secondaryTelephone:        'secondaryTelephone2',
      secondaryTelephoneReason:  'secondaryTelephoneReason2',
      title:                     'FOODTRUCK',
      website:                   'website',
      menuDocument:              'menuDocument',
      zipCode:                   'zipCode',
      type:                      CompanyType.FOODTRUCK,
      //CORONA
      offersDelivery:            true,
      deliveryDescription:       'deliveryDescription',
      offersReopen:              true,
      reopenDescription:         'reopenDescription',
      offersTakeAway:            true,
      takeAwayDescription:       'deliveryDescription',
      offersCoupons:             true,
      couponsDescription:        'couponsDescription',
      acceptsDonations:          true,
      donationsDescription:      'donationsDescription',
      //CORONA

    }, {
      id:                        'id3',
      created:                   0,
      updated:                   0,
      address:                   'address3',
      city:                      'city3',
      description:               'description3',
      email:                     'email3',
      geoHash:                   'geoHash3',
      isApproved:                true,
      hasAcceptedTerms:          true,
      hasSubscribedToNewsletter: true,
      isBlocked:                 false,
      isFirstLogin:              false,
      background:                'background',
      lat:                       0,
      lng:                       0,
      logo:                      'logo',
      openingHours:              {
        monday:  [{
          from: 1130,
          to:   1445,
        }],
        tuesday: [{
          from: 1015,
          to:   1633,
        }],
      },
      prefersReservations:       false,
      owners:                    ['authUserId3'],
      telephone:                 'telephone3',
      secondaryTelephone:        'secondaryTelephone3',
      secondaryTelephoneReason:  'secondaryTelephoneReason3',
      title:                     'BAR',
      website:                   'website3',
      menuDocument:              'menuDocument3',
      zipCode:                   'zipCode3',
      type:                      CompanyType.BAR,
      //CORONA
      offersDelivery:            true,
      deliveryDescription:       'deliveryDescription',
      offersReopen:              true,
      reopenDescription:         'reopenDescription',
      offersTakeAway:            true,
      takeAwayDescription:       'deliveryDescription',
      offersCoupons:             true,
      couponsDescription:        'couponsDescription',
      acceptsDonations:          true,
      donationsDescription:      'donationsDescription',
      //CORONA

    }];
  }

  public get geoSerachResultMockData(): IGeoSearchResult<ICompany> {
    return {
      companies: this.mockData,
      location: {
        coordinates: {
          lat: 0,
          lng: 0,
        },
        city:        'city',

        zipCode: 'zipCode',
        address: 'address',
      },
    };
  }

  public async geoSearchByAddress(
    filter: CompanyFilter,
  ): Promise<IGeoSearchResult<ICompany>> {
    return this.geoSerachResultMockData;
  }

  public async geoSearchByCoordinates(
    filter: CompanyFilter,
  ): Promise<IGeoSearchResult<ICompany>> {
    return this.geoSerachResultMockData;
  }

  public async geoSearchFoodTruckDeals(
    filter: CompanyFilter,
    validFrom: number,
    validTo: number,
  ): Promise<ISearchResult[]> {
    return [{
      company:  this.mockData[1],
      distance: 0,
      deals:    [],
    }];
  }

  public async getAllActive(): Promise<ICompany[]> {
    return this.mockData;
  }

  public async getAllForUser(): Promise<ICompany[]> {
    return this.mockData;
  }

  public async getByMail(email: string): Promise<ICompany> {
    return this.mockData[0];
  }

  public async tryFindDoublets(
    company: ICompany,
  ): Promise<ICompany | undefined> {
    return undefined;
  }

  public async geoSearchByAreaBounds(filter: CompanyFilter): Promise<IGeoSearchResult<ICompany>> {
    throw new Error('Method not implemented.');
  }

}
