/* eslint-disable no-multi-spaces */
import { EventArgs } from 'react-ga';

export enum AddNewDealLabel {
  NewDealFab         = 'new-deal-fab',
  AccountSummaryChip = 'account-summary-chip',
  CalendarSelect     = 'calendar-select',
  DealListButton     = 'deal-list-button',
}

export type DashboardEvent = {
  category: 'dashboard';
  action: 'add-new-deal';
  label: AddNewDealLabel;
} & EventArgs;
