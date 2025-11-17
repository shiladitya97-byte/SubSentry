import { z } from 'zod';

export const subscriptionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Cost must be a positive number'
  }).refine((val) => Number(val) <= 999999, {
    message: 'Cost cannot exceed ₹999,999'
  }),
  category: z.enum(['OTT', 'Fitness', 'Software', 'Other']),
  billingCycle: z.enum(['Monthly', 'Yearly']),
  renewalDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, {
    message: 'Renewal date must be today or in the future'
  }),
  alertsEnabled: z.boolean()
});

export const userSettingsSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  currency: z.string().min(1, 'Currency is required').max(10, 'Currency symbol too long'),
  theme: z.enum(['light', 'dark']),
  billingAlertsEnabled: z.boolean(),
  promotionalOffersEnabled: z.boolean()
});

export const alertSettingsSchema = z.object({
  daysBeforeAlert: z.number().int().min(1, 'Must be at least 1 day').max(30, 'Cannot exceed 30 days'),
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  pushEnabled: z.boolean()
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long')
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type AlertSettingsFormData = z.infer<typeof alertSettingsSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
