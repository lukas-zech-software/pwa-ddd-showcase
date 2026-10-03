import { CompanyType }        from '@my-old-startup/common/enums';
import { Company }            from '../../src/ddd/entities/Company';
import { IRepository }        from '../../src/ddd/repository/IRepository';
import { BaseRepositoryMock } from './BaseRepositoryMock';

export class CompanyRepositoryMock extends BaseRepositoryMock<Company> implements IRepository<Company> {
  public mockData: Company[] = [{
    id:               'companyId',
    created:          0,
    updated:          0,
    address:          'address',
    city:             'city',
    description:      'description',
    email:            'email',
    geoHash:          'geoHash',
    isApproved:       true,
    hasAcceptedTerms: true,
    isBlocked:        false,
    isFirstLogin:     false,
    background:       'background',
    lat:              0,
    lng:              0,
    logo:             'logo',
    openingHours:     {
      monday:  [{ from: 1130, to: 1445 }],
      tuesday: [{ from: 1015, to: 1633 }],
    },
    owners:    ['authUserId'],
    telephone: 'telephone',
    title:     'title',
    website:   'website',
    zipCode:   'zipCode',
    type:      CompanyType.RESTAURANT,
  } as Company,
  ];
}
