import { BillingHistory } from 'models/settings.model';

export const billingHistoryInitialState: BillingHistory = {
  limit: 10,
  offset: 0,
  itemsCount: 0,
  itemsCountAll: 0,
  items: [],
};
