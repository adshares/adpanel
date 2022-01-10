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
  id: number
  email: string;
  hasPassword: boolean;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isAgency: boolean;
  isEmailConfirmed: boolean;
  isAdminConfirmed: boolean,
  isConfirmed: boolean,
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

export { UserAdserverWallet, User, LocalStorageUser, ExchangeRate }
