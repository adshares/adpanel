import { User } from 'models/user.model';

export const userInitialState: User = {
  id: 0,
  email: '',
  isAdvertiser: true,
  isPublisher: true,
  isAdmin: false,
  userEthAddress: '',
  userMemo: '',
  userAutomaticWithdrawPeriod: 3,
  userAutomaticWithdrawAmount: 300,
  isEmailConfirmed: false,
  totalFunds: 1276.60,
  totalFundsInCurrency: 4336.23,
  totalFundsChange: 20.30
};
