export interface User {
  id: number;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  isAdmin: boolean;
  activeUserType: string;
}
