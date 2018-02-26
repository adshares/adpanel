import { User } from '../user.model';

export const userInitialState: User = {
  id: 0,
  email: '',
  isAdvertiser: true,
  isPublisher: true,
  isAdmin: false,
  userAutomaticWithdrawPeriod: 'month',
  userAutomaticWithdrawAmount: 300,
  isEmailConfirmed: false
};
