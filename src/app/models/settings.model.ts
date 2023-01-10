import { Moment } from 'moment';
import { UserAdserverWallet } from 'models/user.model';

interface BillingHistoryItem {
  amount: number;
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

interface UserInfo {
  id: number;
  uuid: string;
  email: string;
  name: string;
  hasPassword: boolean;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isAgency: boolean;
  isEmailConfirmed: boolean;
  isAdminConfirmed: boolean;
  isConfirmed: boolean;
  isSubscribed: boolean;
  adserverWallet: UserAdserverWallet;
  isBanned: number;
  banReason: string | null;
}

interface Users {
  data: UserInfo[];
  currentPage: number;
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  nextPageUrl: string;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
}

interface AdvertiserInfo {
  userIds: number[];
  email: string;
  domain: string;
  name: string;
  views: number;
  viewsDiff: number;
  viewsChange: number;
  viewsUnique: number;
  viewsUniqueDiff: number;
  viewsUniqueChange: number;
  clicks: number;
  clicksDiff: number;
  clicksChange: number;
  ctr: number;
  ctrDiff: number;
  ctrChange: number;
  cost: number;
  costDiff: number;
  costChange: number;
  cpm: number;
  cpmDiff: number;
  cpmChange: number;
  cpc: number;
  cpcDiff: number;
  cpcChange: number;
}

interface Advertisers {
  data: AdvertiserInfo[];
}

interface PublisherInfo {
  userIds: number[];
  email: string;
  domain: string;
  rank: string;
  info: string;
  url: string;
  views: number;
  viewsDiff: number;
  viewsChange: number;
  ivr: number;
  ivrDiff: number;
  ivrChange: number;
  clicks: number;
  clicksDiff: number;
  clicksChange: number;
  ctr: number;
  ctrDiff: number;
  ctrChange: number;
  revenue: number;
  revenueDiff: number;
  revenueChange: number;
  rpm: number;
  rpmDiff: number;
  rpmChange: number;
}

interface Publishers {
  data: PublisherInfo[];
}

interface AdminSettings {
  adUserInfoUrl: string;
}

interface AdminSettingsResponse {
  settings: AdminSettings;
}

interface License {
  type: string;
  dateStart: string;
  dateEnd: string;
  owner: string;
  detailsUrl: string;
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
  unwrappers: UnwrappersInfo[] | null;
  fiat: FiatInfo | null;
}

interface NowPaymentsInfo {
  minAmount: number;
  maxAmount: number;
  exchangeRate: number;
  currency: string;
}

interface UnwrappersInfo {
  chainId: number;
  networkName: string;
  contractAddress: string;
}

interface FiatInfo {
  minAmount: number;
  maxAmount: number;
  currencies: string[];
}

interface Country {
  code: string;
  name: string;
  euTax: boolean | null;
}

interface NowPaymentsInit {
  nowPaymentsUrl: string;
}

interface CalculateWithdrawalItem {
  amount: number;
  fee: number;
  total: number;
  receive: number;
}

interface ReportsList {
  [type: string]: ReportsListItem[];
}

interface ReportsListItem {
  id: string;
  name: string;
  state: string;
}

interface RefLink {
  id: number;
  token: string;
  comment: string;
  validUntil: string;
  singleUse: boolean;
  used: boolean;
  usageCount: number;
  bonus: number;
  refund: number;
  keptRefund: number;
  refunded: number;
  refundValidUntil: string;
}

interface PaginatorResponse<T> {
  currentPage: number;
  data: T[];
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: {
    active: boolean;
    label: string;
    url: string;
  }[];
  nextPageUrl: string | null;
  path: string;
  perPage: number;
  prevPageUrl: string | null;
  to: number;
  total: number;
}

interface RefLinkInfo {
  token: string;
  status: string;
}

interface SiteOptions {
  classifierLocalBanners: string;
  acceptBannersManually: number;
}

interface Invoice {
  id: number;

  downloadUrl: string;
}

interface UserRoles {
  defaultUserRoles: string[];
}

interface WalletGateway {
  code: string;
  name: string;
  description: string;
  chainId: number;
  address: string;
  contractAddress: string;
  format: string;
  prefix: string;
}

interface WalletToken {
  token: string;
  message: string;
  gateways: {
    bsc: WalletGateway;
  };
}

interface UserBanDetails {
  id: number;
  reason: string;
}

export {
  BillingHistoryItem,
  BillingHistory,
  BillingHistoryFilter,
  Users,
  UserInfo,
  Advertisers,
  AdvertiserInfo,
  Publishers,
  PublisherInfo,
  AdminSettings,
  AdsharesAddress,
  WithdrawalInfo,
  BtcWithdrawInfo,
  DepositInfo,
  NowPaymentsInfo,
  NowPaymentsInit,
  UnwrappersInfo,
  FiatInfo,
  Country,
  CalculateWithdrawalItem,
  AdminSettingsResponse,
  License,
  PaginatorResponse,
  ReportsList,
  ReportsListItem,
  RefLink,
  RefLinkInfo,
  SiteOptions,
  Invoice,
  UserRoles,
  WalletGateway,
  WalletToken,
  UserBanDetails,
};
