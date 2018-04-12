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

interface UserInfoStats {
  id: number;
  email: string;
  isAdvertiser: boolean;
  isPublisher: boolean;
  profit: number;
  topKeywords: string[];
}

interface AdminSettings {
  earnings: number;
}

interface AdSharesAddress {
  adsharesAddress: string
}


export { BillingHistoryItem, NotificationItem, UserInfoStats, AdminSettings, AdSharesAddress };
