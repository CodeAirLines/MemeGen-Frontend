import { AVAILABLE_COUPONS } from '../constants/subscription';
import type {
  Coupon,
  BillingDetails,
  PaymentDetails,
  PaymentResult,
  PlanId,
  BillingCycle,
} from '../types/subscription';

export interface PriceCalculation {
  basePrice: number;
  discountAmount: number;
  discountPercent: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
  totalPayable: number;
  appliedCoupon: Coupon | null;
}

export class PaymentService {
  /**
   * Validate a promo / coupon code
   */
  validateCoupon(code: string, currentAmount: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      return { valid: false, error: 'Please enter a coupon code.' };
    }

    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      return {
        valid: false,
        error: `Coupon "${trimmed}" is invalid or expired. Try "MEME20" or "PROMO50".`,
      };
    }

    if (found.minOrderAmount && currentAmount < found.minOrderAmount) {
      return {
        valid: false,
        error: `This coupon requires a minimum purchase of ₹${found.minOrderAmount}.`,
      };
    }

    return { valid: true, coupon: found };
  }

  /**
   * Calculate complete order pricing including coupon discounts and taxes
   */
  calculatePrice(basePrice: number, coupon: Coupon | null = null): PriceCalculation {
    let discountAmount = 0;
    let discountPercent = 0;

    if (coupon) {
      if (coupon.discountPercent) {
        discountPercent = coupon.discountPercent;
        discountAmount = Math.round((basePrice * coupon.discountPercent) / 100);
      } else if (coupon.discountAmount) {
        discountAmount = Math.min(basePrice, coupon.discountAmount);
        discountPercent = Math.round((discountAmount / (basePrice || 1)) * 100);
      }
    }

    const subtotalAfterDiscount = Math.max(0, basePrice - discountAmount);
    // 18% GST on digital services
    const taxAmount = Math.round(subtotalAfterDiscount * 0.18);
    const totalPayable = subtotalAfterDiscount + taxAmount;

    return {
      basePrice,
      discountAmount,
      discountPercent,
      subtotalAfterDiscount,
      taxAmount,
      totalPayable,
      appliedCoupon: coupon,
    };
  }

  /**
   * Validate user billing details
   */
  validateBillingDetails(details: BillingDetails): { valid: boolean; errors: Partial<Record<keyof BillingDetails, string>> } {
    const errors: Partial<Record<keyof BillingDetails, string>> = {};

    if (!details.fullName || details.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required (minimum 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!details.email || !emailRegex.test(details.email.trim())) {
      errors.email = 'Valid email address is required.';
    }

    const phoneDigits = details.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 10) {
      errors.phone = 'Valid 10-digit phone number is required.';
    }

    if (!details.address || details.address.trim().length < 5) {
      errors.address = 'Billing street address is required.';
    }

    if (!details.state || details.state.trim().length < 2) {
      errors.state = 'State / Province is required.';
    }

    const pinDigits = details.pinCode.replace(/\D/g, '');
    if (!pinDigits || pinDigits.length !== 6) {
      errors.pinCode = 'Valid 6-digit PIN code is required.';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate payment method fields
   */
  validatePaymentDetails(details: PaymentDetails): { valid: boolean; error?: string } {
    if (details.method === 'upi') {
      if (!details.upiApp && !details.upiId) {
        return { valid: false, error: 'Please select a UPI app or enter a valid UPI ID / VPA.' };
      }
      if (details.upiId) {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        if (!upiRegex.test(details.upiId.trim())) {
          return { valid: false, error: 'Invalid UPI ID format. Example: user@oksbi or 9876543210@paytm' };
        }
      }
    } else if (details.method === 'card') {
      const cardDigits = (details.cardNumber || '').replace(/\D/g, '');
      if (cardDigits.length < 15 || cardDigits.length > 16) {
        return { valid: false, error: 'Please enter a valid 16-digit card number.' };
      }
      if (!details.cardHolder || details.cardHolder.trim().length < 2) {
        return { valid: false, error: 'Cardholder name is required.' };
      }
      if (!details.expiry || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(details.expiry.trim())) {
        return { valid: false, error: 'Please enter a valid expiration date (MM/YY).' };
      }
      const cvvDigits = (details.cvv || '').replace(/\D/g, '');
      if (cvvDigits.length < 3 || cvvDigits.length > 4) {
        return { valid: false, error: 'Please enter a valid 3 or 4 digit CVV/CVC.' };
      }
    } else if (details.method === 'netbanking') {
      if (!details.bank) {
        return { valid: false, error: 'Please select your bank for Net Banking.' };
      }
    } else if (details.method === 'wallet') {
      if (!details.wallet) {
        return { valid: false, error: 'Please select a digital wallet.' };
      }
    }

    return { valid: true };
  }

  /**
   * Simulated mock transaction processor
   * Simulates realistic backend / gateway processing with delay
   */
  async processDemoPayment(options: {
    planId: PlanId;
    billingCycle: BillingCycle;
    amount: number;
    billingDetails: BillingDetails;
    paymentDetails: PaymentDetails;
    simulateFailure?: boolean;
    delayMs?: number;
  }): Promise<PaymentResult> {
    const delay = options.delayMs ?? 1500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (options.simulateFailure) {
      return {
        success: false,
        errorMessage: 'Payment simulated failure: Transaction declined by issuing bank (Demo Test Mode).',
      };
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `MH-SUB-${randomSuffix}`;
    const transactionId = `TXN_DEMO_${Date.now().toString(36).toUpperCase()}_${randomSuffix}`;

    return {
      success: true,
      orderId,
      transactionId,
      amount: options.amount,
    };
  }
}

export const paymentService = new PaymentService();

