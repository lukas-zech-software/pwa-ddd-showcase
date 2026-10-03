/* eslint-disable @typescript-eslint/unbound-method */
import { getTestApiDeal, getTestDeal } from '../../../test/data/getTestData';
import { CompanyMock }                 from '../../../test/mocks/CompanyMock';
import { getAsMock }                   from '../../../test/utils/autoSpy';
import { DealAdapter }                 from '../../adapter/DealAdapter';
import { container }                   from '../../container/inversify.config';
import { keys }                        from '../../container/inversify.keys';
import { ICompanyInstance }            from '../interfaces';
import { DealService }                 from './DealService';
import { IDealService }                from './IDealService';

describe('DealService', () => {
  let dealService: DealService,
      testCompany: ICompanyInstance;

  beforeEach(() => {
    // rebind live implementation instead of mock
    container
      .rebind<IDealService>(keys.IDealService)
      .to(DealService)
      .inTransientScope();

    dealService            = container.get(keys.IDealService);

    testCompany = new CompanyMock();
  });

  test('#bulkPublish should publish each deal', async () => {
    const testApiDeals     = [getTestApiDeal(), getTestApiDeal(), getTestApiDeal()];
    const testDealInstance = [getTestDeal(), getTestDeal(), getTestDeal()];

    getAsMock(testCompany).getDeal.mockResolvedValue(testDealInstance[0]);
    getAsMock(testCompany)
      .addDeal.mockResolvedValueOnce(testDealInstance[1])
      .mockResolvedValueOnce(testDealInstance[2]);

    await dealService.bulkPublish(testCompany, testApiDeals);

    expect(testDealInstance[0].publish).toHaveBeenCalled();
    expect(testDealInstance[1].publish).toHaveBeenCalled();
    expect(testDealInstance[2].publish).toHaveBeenCalled();
  });

  test('#bulkPublish should not get and not create first deal', async () => {
    const testApiDeal1 = getTestApiDeal();
    const testApiDeal2 = getTestApiDeal();
    const testApiDeal3 = getTestApiDeal();

    const testApiDeals     = [testApiDeal1, testApiDeal2, testApiDeal3];
    const testDealInstance = [getTestDeal(), getTestDeal(), getTestDeal()];

    getAsMock(testCompany).getDeal.mockResolvedValue(testDealInstance[0]);
    getAsMock(testCompany)
      .addDeal.mockResolvedValueOnce(testDealInstance[1])
      .mockResolvedValueOnce(testDealInstance[2]);

    await dealService.bulkPublish(testCompany, testApiDeals);

    expect(testCompany.getDeal).toHaveBeenCalledWith(testApiDeal1.id);
    expect(testCompany.addDeal).not.toHaveBeenCalledWith(testApiDeal1.id);

    expect(testCompany.getDeal).not.toHaveBeenCalledWith(testApiDeal2.id);
    expect(testCompany.addDeal).toHaveBeenCalledWith(
      DealAdapter.apiToEntity(testApiDeal2),
    );

    expect(testCompany.getDeal).not.toHaveBeenCalledWith(testApiDeal3.id);
    expect(testCompany.addDeal).toHaveBeenCalledWith(
      DealAdapter.apiToEntity(testApiDeal3),
    );
  });
});
