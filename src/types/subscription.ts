export type PlanId = 'free' | 'pro' | 'premium';

export type BillingCycle = 'monthly' | 'yearly';

export type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'wallet';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
  tooltip?: string;
}

export interface SubscriptionPlan {
  id: PlanId;
  name: string;
  tagline: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  limitations?: string[];
  ctaText: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
  minOrderAmount?: number;
}

export interface BillingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  pinCode: string;
}

export interface PaymentDetails {
  method: PaymentMethodType;
  upiId?: string;
  upiApp?: 'gpay' | 'phonepe' | 'paytm' | 'bhim';
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
  bank?: string;
  wallet?: string;
}

export interface Subscription {
  planId: PlanId;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  renewalDate: string;
  amountPaid: number;
  orderId: string;
  paymentMethod: string;
  billingDetails?: BillingDetails;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  amount?: number;
  errorMessage?: string;
}

export interface FeatureComparisonItem {
  feature: string;
  category: string;
  free: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
}

