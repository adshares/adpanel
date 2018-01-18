interface BillingHistoryItem {
  status: number;
  date: Date;
  address: string;
  link: string;
}

interface NotificationItem {
  type: string;
  notification: string;
  email: string;
}

export { BillingHistoryItem, NotificationItem };
