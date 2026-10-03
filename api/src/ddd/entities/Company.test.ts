/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { CompanyType } from '@my-old-startup/common/enums';
import 'jest';
import { ErrorCode }                     from '../../../../common/error/ErrorCode';
import { FactoryMock }                   from '../../../test/mocks/BaseFactoryMock';
import { CompanyFacadeMock }             from '../../../test/mocks/CompanyFacadeMock';
import { DealAccountServiceMock }        from '../../../test/mocks/DealAccountServiceMock';
import { GeoCodingServiceMock }          from '../../../test/mocks/GeoCodingServiceMock';
import { MailMock }                      from '../../../test/mocks/MailMock';
import { IAutoMock }                     from '../../../test/utils/autoSpy';
import { IGeoHashLocation }              from '../../api/interfaces/geo';
import { ApiError }                      from '../../common/ApiError';
import { container }                     from '../../container/inversify.config';
import { keys }                          from '../../container/inversify.keys';
import { BusinessError }                 from '../common/BusinessError';
import { BusinessErrorCode }             from '../common/BusinessErrorCode';
import { ICompanyContact, IUserContact } from '../interfaces';
import { Company }                       from './Company';
import { IMail, Mail }                   from './Mail';

describe.skip('Company Entity', () => {

  let company: Company,
      companyFacadeMock: IAutoMock<CompanyFacadeMock>,
      mailFactoryMock: IAutoMock<FactoryMock<IMail, Mail>>,
      geoCodingServiceMock: IAutoMock<GeoCodingServiceMock>,
      dealAccountServiceMock: IAutoMock<DealAccountServiceMock>;

  beforeEach(() => {
    dealAccountServiceMock = container.get(keys.IDealAccountService);
    companyFacadeMock      = container.get(keys.ICompanyFacade);
    mailFactoryMock        = container.get(keys.IMailFactory);
    geoCodingServiceMock   = container.get(keys.IGeoCodingService);
    company                = container.get(Company);
  });

  describe('#constructor', () => {
    test('should apply defaults', async () => {

      expect(typeof company.updated).toBe('number');
      expect(typeof company.created).toBe('number');
      expect(company.isApproved).toBe(false);
      expect(company.isBlocked).toBe(false);
      expect(company.isFirstLogin).toBe(true);
      expect(company.owners).toHaveLength(0);
    });
  });

  describe('#register', () => {
    let companyContact: ICompanyContact;

    let geoResult: IGeoHashLocation;

    let testMail: MailMock;

    const userContact: IUserContact = {
      contactFirstName: 'test',
      contactName:      'McTesterson',
      contactPhone:     '12345',
      contactEmail:     'test@example.com',
    };

    describe('success', () => {
      beforeEach(() => {
        companyContact = {
          address:                   'address',
          email:                     'email',
          telephone:                 'telephone',
          title:                     'title',
          website:                   'website',
          zipCode:                   'zipCode',
          type:                      CompanyType.RESTAURANT,
          hasAcceptedTerms:          true,
          // @ts-ignore
          hasSubscribedToNewsletter: true,
        };

        geoResult = {
          address: 'address',
          city:    'city',
          zipCode: 'zipCode',
          geoHash: 'geoHash',
        coordinates: {
          lat: 0,
          lng: 0,
        },
        };

        testMail = new MailMock();

        geoCodingServiceMock.getLocationForAddress.mockResolvedValue(geoResult);
        mailFactoryMock.create.mockReturnValue(testMail);

      });

      test('should set the provided contact data', async () => {
        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact);

        expect(company.address).toEqual(companyContact.address);
        expect(company.email).toEqual(companyContact.email);
        expect(company.telephone).toEqual(companyContact.telephone);
        expect(company.title).toEqual(companyContact.title);
        expect(company.website).toEqual(companyContact.website);
        expect(company.zipCode).toEqual(companyContact.zipCode);
      });

      test('should create the company in db', async () => {
        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact);

        expect(companyFacadeMock.create).toHaveBeenCalledWith(company);
      });

      test('should update the geoHash of the company', async () => {
        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact);

        expect(geoCodingServiceMock.getLocationForAddress).toHaveBeenCalledWith(company.address, company.zipCode);
      });

      test('should add provided user as owner', async () => {
        const authUserId = 'authUserId';

        // @ts-ignore
        await company.register(companyContact, authUserId, userContact);

        expect(company.owners).toContain(authUserId);
      });

      test('should send application mail to company', async () => {
        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact);

        expect(mailFactoryMock.create).toHaveBeenCalledWith({
          template: 'register/company_application',
          from:     'partner@my-old-startups-domain.de',
          to:       company.email,
          data:     { company },
        });
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(testMail.send).toHaveBeenCalled();
      });

      test('should send application mail to back office', async () => {
        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact);

        expect(mailFactoryMock.create).toHaveBeenCalledWith({
          template: 'hub/company_application',
          // TODO: Inject
          from:     'partner@my-old-startups-domain.de',
          to:       'registration@my-old-startups-domain.de',
          data:     { company },
        });
        // same mail mock is used for company and back_office
        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(testMail.send).toHaveBeenCalledTimes(2);
      });
    });

    describe('fail', () => {

      test('should throw if company is already approved', async () => {
        company.isApproved = true;

        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact).then(fail).catch((error: BusinessError) => {
          expect(error).toBeInstanceOf(BusinessError);
          expect(error.code).toEqual(BusinessErrorCode.COMPANY_ALREADY_APPROVED);
        });
      });

      test('should throw if company is blocked', async () => {
        company.isBlocked = true;

        // @ts-ignore
        await company.register(companyContact, 'authUserId', userContact).then(fail).catch((error: BusinessError) => {
          expect(error).toBeInstanceOf(BusinessError);
          expect(error.code).toEqual(BusinessErrorCode.COMPANY_BLOCKED);
        });
      });
    });
  });

  describe('#approve', () => {
    let testMail: MailMock;

    beforeEach(() => {
      testMail = new MailMock();

      mailFactoryMock.create.mockReturnValue(testMail);
    });

    test('should set approved to true', async () => {
      await company.approve();

      expect(company.isApproved).toEqual(true);
    });

    test('should send approved mail to company', async () => {
      const baseUrl = container.get(keys.BaseUrl);
      await company.approve();

      expect(mailFactoryMock.create).toHaveBeenCalledWith({
        template: 'register/company_approved',
        from:     'registration@my-old-startups-domain.de',
        to:       company.email,
        data:     { loginUrl: baseUrl },
      });
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(testMail.send).toHaveBeenCalled();
    });

    test('should throw if company is already approved', async () => {
      company.isApproved = true;

      await expect(company.approve()).rejects.toThrow(BusinessError);
    });

    test('should create a deal account for the company', async () => {
      company.id = 'companyId';
      await company.approve();

      expect(dealAccountServiceMock.setDealsRemaining).toHaveBeenCalledWith(company.id);
    });

  });

  test('should create the company in db', async () => {
    await company.approve();

    expect(companyFacadeMock.update).toHaveBeenCalledWith(company);
  });

  describe('#removeOwner', () => {
    test('should remove the given owner', () => {
      company.addOwner('foo');
      company.addOwner('bar');
      company.addOwner('baz');

      expect(company.owners).toEqual(['foo', 'bar', 'baz']);

      company.removeOwner('bar');

      expect(company.owners).toEqual(['foo', 'baz']);
    });

    test('should throw if only one user is an owner', () => {
      company.addOwner('foo');

      expect(() => company.removeOwner('foo'))
        .toThrowError(
          new ApiError('Company must have at least one owner', ErrorCode.WEB_SERVER_INVALID_USER_INPUT),
        );
    });
  });

});
