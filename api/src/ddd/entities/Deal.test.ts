import { TimeInMs } from '@my-old-startup/common/datetime';
import 'jest';
import { FactoryMock }            from '../../../test/mocks/BaseFactoryMock';
import { CompanyFacadeMock }      from '../../../test/mocks/CompanyFacadeMock';
import { DealAccountServiceMock } from '../../../test/mocks/DealAccountServiceMock';
import { DealFacadeMock }         from '../../../test/mocks/DealFacadeMock';
import { MailMock }               from '../../../test/mocks/MailMock';
import { IAutoMock }              from '../../../test/utils/autoSpy';
import { container }              from '../../container/inversify.config';
import { keys }                   from '../../container/inversify.keys';
import { ICompany }               from '../interfaces';
import { Deal }                   from './Deal';
import { IMail, Mail }            from './Mail';

describe('Deal Entity', () => {
  let deal: Deal,
      dealFacadeMock: IAutoMock<DealFacadeMock>,
      companyFacadeMock: IAutoMock<CompanyFacadeMock>,
      dealAccountService: IAutoMock<DealAccountServiceMock>,
      mailFactoryMock: IAutoMock<FactoryMock<IMail, Mail>>;

  beforeEach(() => {
    dealFacadeMock         = container.get(keys.IDealFacade);
    companyFacadeMock      = container.get(keys.ICompanyFacade);
    dealAccountService     = container.get(keys.IDealAccountService);
    mailFactoryMock        = container.get(keys.IMailFactory);
    deal                   = container.get(Deal);
  });

  describe('#constructor', () => {
    test('should apply defaults', async () => {
      expect(typeof deal.updated).toBe('number');
      expect(typeof deal.created).toBe('number');
      expect(deal.published).toBe(null);
    });
  });

  describe('#create', () => {
    test('should throw if deal time is too long', async () => {
      deal.validFrom   = Date.now();
      deal.validTo     = Date.now() + TimeInMs.ONE_DAY * 2;
      deal.description = 'new description';
      await expect(deal.create('1')).rejects.toThrow('Deal time too long');
    });

    test('should create deal', async () => {
      deal.description = 'new description';
      await deal.create('1');

      expect(dealFacadeMock.create).toHaveBeenCalledWith(deal, '1');
    });
  });

  describe('#update', () => {
    test('should throw if deal time is too long', async () => {
      deal.validFrom   = Date.now();
      deal.validTo     = Date.now() + TimeInMs.ONE_DAY * 2;
      deal.description = 'new description';
      await expect(deal.update()).rejects.toThrow('Deal time too long');
    });

    test('should throw if deal is already published', async () => {
      deal.published   = 1;
      deal.description = 'new description';
      await expect(deal.update()).rejects.toThrow('Deal already published');
    });

    test('should update deal', async () => {
      deal.companyId   = '1';
      deal.description = 'new description';
      await deal.update();

      expect(dealFacadeMock.update).toHaveBeenCalledWith(deal, '1');
    });
  });

  describe('#publish', () => {
    let testMail: MailMock;

    beforeEach(() => {
      deal.image = 'someImage.jpg';

      testMail = new MailMock();
      mailFactoryMock.create.mockReturnValue(testMail);
    });

    test('should throw if deal is already published', async () => {
      deal.published = 1;

      await expect(deal.publish()).rejects.toThrow('Deal already published');
    });

    test('should throw if deal image is still default', async () => {
      deal.image = 'default.png';

      await expect(deal.publish()).rejects.toThrow('Deal image still default');
    });

    test('should set published to now and isPublished to true', async () => {
      const testTimestamp = 123;
      deal.companyId      = '1';
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Date.now            = jest.fn().mockReturnValue(testTimestamp);

      await deal.publish();

      expect(typeof deal.published).toBe('number');
      expect(deal.published).toBe(testTimestamp);
      expect(deal.isPublished).toBe(true);
      expect(dealFacadeMock.update).toHaveBeenCalledWith(deal, '1');
    });

    test('should withdraw deal credit from account', async () => {
      deal.id        = '1';
      deal.companyId = '2';
      await deal.publish();
      expect(dealAccountService.useDeal).toHaveBeenCalledWith(
        deal.id,
        deal.companyId,
      );
    });

    xtest('should send publish mail to deals company', async () => {
      const testCompany: Partial<ICompany> = {
        id:    'testId',
        email: 'testEmail',
      };
      companyFacadeMock.get.mockReturnValue(testCompany);

      await deal.publish();

      expect(mailFactoryMock.create).toHaveBeenCalledWith({
        template: 'deal/deal_published',
        from:     'partner@my-old-startups-domain.de',
        to:       testCompany.email,
        data:     { loginUrl: 'http://localhost:8181' },
      });
      expect(companyFacadeMock.get).toHaveBeenCalledWith(testCompany.id);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(testMail.send).toHaveBeenCalled();
    });
  });
});
