import { container }          from '../container/inversify.config';
import { DealAccount }        from '../ddd/entities/DealAccount';
import { DealAccountAdapter } from './DealAccountAdapter';

describe('DealAccountAdapter', () => {
  let dealAccount: DealAccount;

  beforeEach(() => {
    dealAccount = container.get(DealAccount).setData({
      id:             'id',
      companyId:      'companyId',
      dealsRemaining: 10,
      created:        0,
      updated:        0,
    });
  });

  test('entityToApi should preserve expected values', async () => {
    const apiVersion = DealAccountAdapter.entityToApi(dealAccount);

    expect(apiVersion.id).toEqual('id');
    expect(apiVersion.companyId).toEqual('companyId');
    expect(apiVersion.dealsRemaining).toEqual(10);
  });
});
