import { Moment } from 'moment';

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

interface BillingHistoryFilter {
  from: Moment;
  to: Moment;
  types: number[];
}

interface NotificationItem {
  name: string;
  notification: string;
  email: string;
}

interface UserInfoStats {
  id: number;
  uuid: string;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
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

interface AdminWallet {
  balance: number;
  unusedBonuses: number;
}

interface AdminSettingsResponse {
  settings: AdminSettings;
}

interface AdminWalletResponse {
  wallet: AdminWallet;
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

interface NowPaymentsInfo {
  minAmount: number;
  exchangeRate: number;
  currency: string;
  availableCurrencies: string[];
}

interface NowPaymentsInit {
  nowPaymentsUrl: string;
}

interface CalculateWithdrawalItem {
  amount: number;
  fee: number;
  total: number;
}

export {
  BillingHistoryItem,
  BillingHistory,
  BillingHistoryFilter,
  NotificationItem,
  Users,
  UserInfoStats,
  AdminSettings,
  AdminWallet,
  AdsharesAddress,
  DepositInfo,
  NowPaymentsInfo,
  NowPaymentsInit,
  CalculateWithdrawalItem,
  AdminSettingsResponse,
  AdminWalletResponse,
  AdminPrivacyAndTermsSettingsResponse,
  TermsAndPrivacy,
  License,
};
