export interface Subscription {
  id: string;
  name: string;
  category: 'OTT' | 'Fitness' | 'Software' | 'Other';
  cost: number;
  billingCycle: 'Monthly' | 'Yearly';
  nextRenewalDate: string;
  alertsEnabled: boolean;
  logo?: string;
}

export interface AlertSettings {
  daysBeforeAlert: 1 | 3 | 7;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

export interface UserSettings {
  name: string;
  email: string;
  currency: '₹' | '$' | '€';
  theme: 'light' | 'dark';
  billingAlertsEnabled: boolean;
  promotionalOffersEnabled: boolean;
}
