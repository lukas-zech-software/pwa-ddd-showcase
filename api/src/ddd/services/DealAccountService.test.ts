import { container }          from '../../container/inversify.config';
import { keys }               from '../../container/inversify.keys';
import { DealAccountService } from './DealAccountService';

describe('DealAccountService', () => {
  let dealAccountService: DealAccountService,
      dateNowMock: any;

  beforeEach(() => {
    dealAccountService    = container.get(keys.IDealAccountService);
  });

  beforeAll(() => {
    // Always use the same date in tests
    dateNowMock     = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 1547596800000);
    // days in month - "now" + 1
  });

  afterAll(() => {
    dateNowMock.mockRestore();
  });

  // This tests the mock ...
  xtest('getAccountForCompany returns the expected data', async () => {
    expect(await dealAccountService.getAccountForCompany('companyId')).toEqual({
      id:             'id',
      companyId:      'companyId',
      dealsRemaining: 10,
      created:        0,
      updated:        0,
    });
  });
});
