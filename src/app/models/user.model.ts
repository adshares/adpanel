interface UserFinancialData {
  userAddress: string;
  userMemo: string;
  userAutomaticWithdrawPeriod: number;
  userAutomaticWithdrawAmount: number;
  totalFunds: number;
  totalFundsInCurrency: number;
  totalFundsChange: number;
  lastPayment: string;
}

interface User {
  id: number;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isEmailConfirmed: boolean;
  failedLoginAttemps: number;
  maxFailedLoginAttemps: number;
  authToken?: string;
  passwordLifeTime: string;

  financialData: UserFinancialData;
}

interface LocalStorageUser extends User {
  remember: boolean;
  passwordLength: number;
  expiration: number;
}

export { UserFinancialData, User, LocalStorageUser };
