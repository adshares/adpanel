export interface Notification {
  type: number;
  message: string;
}

export interface Notifications {
  advertiser?: Notification[];
  publisher?: Notification[];
  general?: Notification[];
}
