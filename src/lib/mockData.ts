import { Subscription, AlertSettings, UserSettings } from '@/types/subscription';

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    category: 'OTT',
    cost: 499,
    billingCycle: 'Monthly',
    nextRenewalDate: '2023-10-24',
    alertsEnabled: true,
  },
  {
    id: '2',
    name: 'Spotify Premium',
    category: 'OTT',
    cost: 119,
    billingCycle: 'Monthly',
    nextRenewalDate: '2023-10-28',
    alertsEnabled: true,
  },
  {
    id: '3',
    name: 'Adobe Creative Cloud',
    category: 'Software',
    cost: 4299,
    billingCycle: 'Monthly',
    nextRenewalDate: '2023-11-05',
    alertsEnabled: false,
  },
  {
    id: '4',
    name: 'Fitness First Gym',
    category: 'Fitness',
    cost: 2500,
    billingCycle: 'Monthly',
    nextRenewalDate: '2023-10-30',
    alertsEnabled: true,
  },
];

export const mockAlertSettings: AlertSettings = {
  daysBeforeAlert: 3,
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
};

export const mockUserSettings: UserSettings = {
  name: 'Aakash Mehta',
  email: 'aakash@example.com',
  currency: '₹',
  theme: 'light',
  billingAlertsEnabled: true,
  promotionalOffersEnabled: false,
};
