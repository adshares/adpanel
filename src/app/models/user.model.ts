interface UserAdserverWallet {
    adsharesAddress: string;
    paymentMemo: string;
    autoWithdrawPeriod: number;
    autoWithdrawAmount: number;
    totalFunds: number;
    totalFundsInCurrency: number;
    totalFundsChange: number;
    lastPayment: string;
}

interface User {
    id: number
    email: string;
    isAdvertiser: boolean;
    isPublisher: boolean;
    isAdmin: boolean;
    isEmailConfirmed: boolean;
    password: string;
    authToken?: string;
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
