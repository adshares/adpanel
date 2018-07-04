import { User } from 'models/user.model';

export const userInitialState: User = {
    id: 0,
    email: '',
    isAdvertiser: true,
    isPublisher: true,
    isAdmin: false,
    isEmailConfirmed: false,
    password: '',
    uuid: "dsdsadasdsa233232",
    adserverWallet: {
        adsharesAddress: '',
        paymentMemo: '',
        autoWithdrawPeriod: 3,
        autoWithdrawAmount: 300,
        totalFunds: 1276.60,
        totalFundsInCurrency: 4336.23,
        totalFundsChange: 20.30,
        lastPayment: 'Tue Feb 20 2018 12:24:00 GMT'
    }
};
