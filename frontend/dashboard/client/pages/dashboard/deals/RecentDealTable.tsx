import {
  observer,
  useObserver,
}                       from 'mobx-react';
import React            from 'react';
import { companyStore } from '../../../stores/CompanyStore';
import { dealStore }    from '../../../stores/DealStore';
import {
  DealsTable,
  DealTableVariant,
}                       from './DealsTable';

export const RecentDealTable: React.FC<{ newDealId?: string }> = observer(({ newDealId }) => {
  if (newDealId === undefined) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentCompany = companyStore.currentCompany!;

  const recentDeal = (dealStore.allDeals || []).find((deal) => deal.id === newDealId);
  const deals      = recentDeal !== undefined ? [recentDeal] : [];

  return useObserver(() => (
    <DealsTable deals={deals} currentCompany={currentCompany} variant={DealTableVariant.RecentDeal}/>
  ));
});
