export interface Notification {
  id: number;
  notificationType: number;
  userType: number;
  title?: string;
  message: string;
  availableActions: number[];
  assetId?: number;
}
