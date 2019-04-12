interface UserAdserverWallet {
  totalFunds: number;
  bonusBalance: number;
  lastPaymentAt: number;
  totalFundsChange: number;
  totalFundsInCurrency: number;
  walletBalance: number;
  lastPayment: string;
  //TODO: check usages of the below fields
  adsharesAddress: string;
  paymentMemo: string;
  autoWithdrawPeriod: number;
  autoWithdrawAmount: number;
}

interface User {
  id: number
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isEmailConfirmed: boolean;
  password: string;
  apiToken?: string;
  adserverWallet: UserAdserverWallet;
  uuid: string;
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

export { UserAdserverWallet, User, LocalStorageUser, UserRoles };
