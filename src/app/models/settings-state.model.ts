import { BillingHistoryItem } from './billing-history-item.model';
import { NotificationSetting } from './notification-setting.model';

export interface SettingsState {
  billingHistory: BillingHistoryItem[];
  notificationsSettings: NotificationSetting[];
}
