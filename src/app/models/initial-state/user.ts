import { User } from 'models/user.model';

export const userInitialState: User = {
  id: 0,
  email: '',
  isAdvertiser: false,
  isPublisher: false,
  isAdmin: false,
  isEmailConfirmed: false,
  password: '',
  uuid: null,
  adserverWallet: {
    totalFunds: 0,
    bonusBalance: 0,
    lastPaymentAt: 0,
    totalFundsChange: 0,
    totalFundsInCurrency: 0,
    walletBalance: 0,
    lastPayment: null
  }
};
