interface BillingHistoryItem {
  amount: number,
  status: number;
  type: number;
  date: Date;
  address: string;
  txid: string;
}

interface BillingHistory {
  limit: number;
  offset: number;
  itemsCount: number;
  itemsCountAll: number;
  items: BillingHistoryItem[];
}

interface NotificationItem {
  name: string;
  notification: string;
  email: string;
}

interface UserInfoStats {
  id: number;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  profit: number;
  topKeywords: string[];
}

interface AdminSettings {
  earnings: number;
}

interface AdsharesAddress {
  adsharesAddress: string;
}

interface DepositInfo {
  address: string;
  message: string;
}

interface CalculateWithdrawalItem {
  amount: number;
  fee: number;
  total: number;
}

export {
  BillingHistoryItem,
  BillingHistory,
  NotificationItem,
  UserInfoStats,
  AdminSettings,
  AdsharesAddress,
  DepositInfo,
  CalculateWithdrawalItem
};
