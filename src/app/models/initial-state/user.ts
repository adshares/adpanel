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
        adsharesAddress: '',
        paymentMemo: '',
        autoWithdrawPeriod: 3,
        autoWithdrawAmount: 300,
        totalFunds: 0.0,
        totalFundsInCurrency: 0.0,
        totalFundsChange: 0.0,
        lastPayment: null
    }
};
