import { User } from 'models/user.model';

export const userInitialState: User = {
  id: 0,
  email: '',
  hasPassword: false,
  isAdvertiser: false,
  isPublisher: false,
  isAdmin: false,
  isModerator: false,
  isAgency: false,
  isEmailConfirmed: false,
  isAdminConfirmed: false,
  isConfirmed: false,
  isSubscribed: false,
  password: '',
  uuid: null,
  apiToken: null,
  isBanned: false,
  banReason: null,
  roles: [],
  adserverWallet: {
    totalFunds: 0,
    bonusBalance: 0,
    totalFundsChange: 0,
    totalFundsInCurrency: 0,
    walletBalance: 0,
    walletAddress: null,
    walletNetwork: null,
    isAutoWithdrawal: false,
    autoWithdrawalLimit: 0,
  },
  isAdserverWalletValid: false,
  exchangeRate: null,
  referralToken: null,
  referralRefundEnabled: false,
  referralRefundCommission: 0,
};
