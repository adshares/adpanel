import { User } from '../user.model';

export const userInitialState: User = {
  id: 0,
  email: '',
  isAdvertiser: true,
  isPublisher: true,
  isAdmin: false,
  userEthAddress: '0xe99356bde974bbe08721d77712168fa070aa8da4',
  userAutomaticWithdrawPeriod: 3,
  userAutomaticWithdrawAmount: 300,
  isEmailConfirmed: false
};
