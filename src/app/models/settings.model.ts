interface BillingHistoryItem {
  amount: number,
  status: number;
  type: number;
  date: Date;
  address: string;
  txid: string;
  id: number;
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
  uuid: string;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
}

interface Users {
  data: UserInfoStats[],
  currentPage: number,
  firstPageUrl: string,
  from: number,
  lastPage: number,
  lastPageUrl: string,
  nextPageUrl: string,
  path: string,
  perPage: number,
  prevPageUrl: string | null,
  to: number,
  total: number,
}

interface AdminSettings {
  adserverName: string;
  coldWalletAddress: string;
  hotwalletMaxValue: number;
  hotwalletMinValue: number;
  supportEmail: string;
  technicalEmail: string;
  publisherCommission?: number;
  advertiserCommission?: number;
  coldWalletIsActive?: number;
}

interface AdminSettingsResponse {
  settings: AdminSettings;
}

interface TermsAndPrivacy {
  privacy: string
  terms: string
}

interface License {
  type: string,
  dateStart: string,
  dateEnd: string,
  owner: string,
  detailsUrl: string
}

interface AdminPrivacyAndTermsSettingsResponse {
  content: string;
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
  Users,
  UserInfoStats,
  AdminSettings,
  AdsharesAddress,
  DepositInfo,
  CalculateWithdrawalItem,
  AdminSettingsResponse,
  AdminPrivacyAndTermsSettingsResponse,
  TermsAndPrivacy,
  License,
};
