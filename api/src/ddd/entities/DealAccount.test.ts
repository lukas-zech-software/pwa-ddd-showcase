import 'jest';
import { DealAccountFacadeMock } from '../../../test/mocks/DealAccountFacadeMock';
import { IAutoMock }             from '../../../test/utils/autoSpy';
import { container }             from '../../container/inversify.config';
import { keys }                  from '../../container/inversify.keys';
import { IDealAccount }          from '../interfaces';
import { DealAccount }           from './DealAccount';

describe('DealAccount Entity', () => {
  let dealAccount: DealAccount,
      dateNowMock: any,
      daysLeftInMonth: number,
      dealAccountFacadeMock: IAutoMock<DealAccountFacadeMock>;

  beforeEach(() => {
    dealAccountFacadeMock = container.get(keys.IDealAccountFacade);
    dealAccount           = container.get(DealAccount);
  });

  beforeAll(() => {
    // Always use the same date in tests
    dateNowMock     = jest.spyOn(Date, 'now').mockImplementation(() => 1547596800000);
    // days in month - "now" + 1
    daysLeftInMonth = 16;
  });

  afterAll(() => {
    dateNowMock.mockRestore();
  });

  describe('#constructor', () => {
    test('should apply defaults', async () => {
      expect(dealAccount.dealsRemaining).toEqual(daysLeftInMonth);
    });
  });

  describe('#create', () => {
    test('should create the dealAccount', async () => {
      await dealAccount.create('companyId');

      expect(dealAccountFacadeMock.create).toHaveBeenCalledWith({
        id:             'id',
        companyId:      'companyId',
        dealsRemaining: daysLeftInMonth,
        created:        0,
        updated:        0,
      });
    });
  });

  describe('#withdraw', () => {
    test('should throw if no more deals remaining', async () => {
      dealAccount.dealsRemaining = 0;

      await expect(dealAccount.withdraw()).rejects.toThrow('No deals available');
    });

    test('should decrement on success', async () => {
      const start = dealAccount.dealsRemaining;
      await dealAccount.withdraw();

      expect(dealAccount.dealsRemaining).toEqual(start - 1);
      expect(dealAccountFacadeMock.update).toHaveBeenCalledWith({ dealsRemaining: dealAccount.dealsRemaining });
    });
  });

  describe('#reset', () => {
    test('should set the dealsRemaining to the number of days in the month', async () => {
      dealAccount.dealsRemaining = 0;

      await dealAccount.reset();

      expect(dealAccount.dealsRemaining).toEqual(daysLeftInMonth);
      expect(dealAccountFacadeMock.update).toHaveBeenCalledWith({ dealsRemaining: dealAccount.dealsRemaining });
    });

    test('should accept an optional argument to reset to a given value', async () => {
      await dealAccount.reset(100);

      expect(dealAccount.dealsRemaining).toEqual(100);
      expect(dealAccountFacadeMock.update).toHaveBeenCalledWith({ dealsRemaining: 100 });
    });

    test('passing 0 as the number of deals', async () => {
      await dealAccount.reset(0);

      expect(dealAccount.dealsRemaining).toEqual(0);
      expect(dealAccountFacadeMock.update).toHaveBeenCalledWith({ dealsRemaining: 0 });
    });

    test('cannot be set to a negative value', async () => {
      await dealAccount.reset(-1);

      expect(dealAccount.dealsRemaining).toEqual(daysLeftInMonth);
    });

    test('should not touch the database if being reset to the same value', async () => {
      await dealAccount.reset(dealAccount.dealsRemaining);

      expect(dealAccountFacadeMock.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('#setData', () => {
    test('should return the given data', async () => {
      const newValues: IDealAccount = {
        id:             'newId',
        companyId:      'newCompanyId',
        dealsRemaining: 500,
        created:        42,
        updated:        42,
      };

      const updatedDealAccount = dealAccount.setData(newValues);

      expect(updatedDealAccount.dealsRemaining).toEqual(500);
    });
  });
});
