interface BillingHistoryItem {
  status: number;
  date: Date;
  address: string;
  link: string;
}

interface NotificationItem {
  name: string;
  notification: string;
  email: string;
}

export { BillingHistoryItem, NotificationItem };
