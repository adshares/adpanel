interface User {
  id: number;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  isEmailConfirmed: boolean;

  userEthAddress: string;
  userMemo: string;
  userAutomaticWithdrawPeriod: number;
  userAutomaticWithdrawAmount: number;

  authToken?: string;
}

interface LocalStorageUser extends User {
  remember: boolean;
  passwordLength: number;
  expiration: number;
}

export { User, LocalStorageUser };
