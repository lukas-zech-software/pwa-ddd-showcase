import { DealAccountFacadeMock } from '../../../test/mocks/DealAccountFacadeMock';
import { IAutoMock }             from '../../../test/utils/autoSpy';
import { container }             from '../../container/inversify.config';
import { keys }                  from '../../container/inversify.keys';
import { DealAccountRepository } from './DealAccountRepository';

describe('DealAccountRepository', () => {
  let dealAccountRepository: DealAccountRepository,
      dealAccountFacadeMock: IAutoMock<DealAccountFacadeMock>;

  beforeEach(() => {
    dealAccountFacadeMock = container.get(keys.IDealAccountFacade);
    dealAccountRepository = container.get(DealAccountRepository);
  });

  // TODO: currently jest.spyOn does not support getters
  test.skip('findByCompany should return expected data', async () => {
    const found = await dealAccountRepository.findByCompany('companyId');

    expect(dealAccountFacadeMock.getByCompanyId).toBeCalledWith('companyId');

    expect(found).toEqual({
      id:             'id',
      companyId:      'companyId',
      created:        0,
      updated:        0,
      dealsRemaining: 10,
    });
  });
});
