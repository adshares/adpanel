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

interface UserInfo {
  id: number;
  uuid: string;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
}

interface Users {
  data: UserInfo[],
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

interface PublisherInfo {
  email: string,
  domain: string,
  views: number,
  viewsDiff: number,
  viewsChange: number,
  ivr: number,
  ivrDiff: number,
  ivrChange: number,
  clicks: number,
  clicksDiff: number,
  clicksChange: number,
  ctr: number,
  ctrDiff: number,
  ctrChange: number,
  revenue: number,
  revenueDiff: number,
  revenueChange: number,
  rpm: number,
  rpmDiff: number,
  rpmChange: number,
}

interface Publishers {
  data: PublisherInfo[];
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

interface WithdrawalInfo {
  btc: BtcWithdrawInfo | null;
}

interface BtcWithdrawInfo {
  minAmount: number;
  maxAmount: number;
  exchangeRate: number;
}

interface DepositInfo {
  address: string;
  message: string;
  nowPayments: NowPaymentsInfo | null;
}

interface NowPaymentsInfo {
  minAmount: number;
  maxAmount: number;
  exchangeRate: number;
  currency: string;
}

interface NowPaymentsInit {
  nowPaymentsUrl: string;
}

interface CalculateWithdrawalItem {
  amount: number;
  fee: number;
  total: number;
}

interface ReportsList {
  [type: string]: ReportsListItem[],
}

interface ReportsListItem {
  id: string,
  name: string,
  state: string,
}

export {
  BillingHistoryItem,
  BillingHistory,
  BillingHistoryFilter,
  NotificationItem,
  Users,
  UserInfo,
  Publishers,
  PublisherInfo,
  AdminSettings,
  AdminWallet,
  AdsharesAddress,
  WithdrawalInfo,
  BtcWithdrawInfo,
  DepositInfo,
  NowPaymentsInfo,
  NowPaymentsInit,
  CalculateWithdrawalItem,
  AdminSettingsResponse,
  AdminWalletResponse,
  AdminPrivacyAndTermsSettingsResponse,
  TermsAndPrivacy,
  License,
  ReportsList,
  ReportsListItem,
};
