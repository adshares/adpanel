interface OAuthAuthorizeResponse {
  location: string;
}

interface UserAdserverWallet {
  totalFunds: number;
  bonusBalance: number;
  totalFundsChange: number;
  totalFundsInCurrency: number;
  walletBalance: number;
  walletAddress: string | null;
  walletNetwork: string | null;
  isAutoWithdrawal: boolean;
  autoWithdrawalLimit: number;
}

interface ExchangeRate {
  currency: string;
  value: number;
}

interface User {
  id: number;
  email: string;
  hasPassword: boolean;
  /** @deprecated use roles instead */
  isAdvertiser: boolean;
  /** @deprecated use roles instead */
  isPublisher: boolean;
  /** @deprecated use roles instead */
  isAdmin: boolean;
  /** @deprecated use roles instead */
  isModerator: boolean;
  /** @deprecated use roles instead */
  isAgency: boolean;
  isEmailConfirmed: boolean;
  isAdminConfirmed: boolean;
  isConfirmed: boolean;
  isSubscribed: boolean;
  password: string;
  apiToken?: string;
  adserverWallet: UserAdserverWallet;
  isAdserverWalletValid: boolean;
  exchangeRate: ExchangeRate | null;
  uuid: string;
  referralToken?: string;
  referralRefundEnabled: boolean;
  referralRefundCommission: number;
  isBanned: boolean;
  banReason: string | null;
  roles: string[];
}

interface LocalStorageUser extends User {
  remember: boolean;
  passwordLength: number;
  expiration: number;
}

export { OAuthAuthorizeResponse, UserAdserverWallet, User, LocalStorageUser, ExchangeRate };
