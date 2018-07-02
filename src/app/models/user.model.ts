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
    id: number
    email: string;
    isAdvertiser: boolean;
    isPublisher: boolean;
    isAdmin: boolean;
    isEmailConfirmed: boolean;
    password: string;
    authToken?: string;
    financialData: UserFinancialData;
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

export { UserFinancialData, User, LocalStorageUser, UserRoles };
