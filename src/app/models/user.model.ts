interface UserAdserverWallet {
  totalFunds: number;
  bonusBalance: number;
  totalFundsChange: number;
  totalFundsInCurrency: number;
  walletBalance: number;
}

interface ExchangeRate {
  currency: string;
  value: number;
}

interface User {
  id: number
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isEmailConfirmed: boolean;
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
}

interface LocalStorageUser extends User {
  remember: boolean;
  passwordLength: number;
  expiration: number;
}

interface UserRoles extends User {
  admin: string;
  publisher: string;
  advertiser: string;
}

export { UserAdserverWallet, User, LocalStorageUser, ExchangeRate };
