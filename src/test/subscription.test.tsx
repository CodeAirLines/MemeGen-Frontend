import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { paymentService } from '../services/paymentService';
import { BillingToggle } from '../features/subscription/BillingToggle';
import { PlanCard } from '../features/subscription/PlanCard';
import { SUBSCRIPTION_PLANS, AVAILABLE_COUPONS } from '../constants/subscription';
import type { PaymentResult } from '../types/subscription';

describe('Subscription & Payment Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    useSubscriptionStore.getState().resetToFree();
    useSubscriptionStore.getState().setBillingCycle('monthly');
    useSubscriptionStore.getState().removeCoupon();
    useSubscriptionStore.getState().clearErrors();
  });

  describe('PaymentService Unit Tests', () => {
    it('calculates price correctly without coupon', () => {
      const calc = paymentService.calculatePrice(199, null);
      expect(calc.basePrice).toBe(199);
      expect(calc.discountAmount).toBe(0);
      expect(calc.subtotalAfterDiscount).toBe(199);
      // 18% GST on 199 is round(35.82) = 36
      expect(calc.taxAmount).toBe(36);
      expect(calc.totalPayable).toBe(235);
    });

    it('calculates price with percent discount coupon (MEME20)', () => {
      const coupon = AVAILABLE_COUPONS.find((c) => c.code === 'MEME20')!;
      const calc = paymentService.calculatePrice(199, coupon);
      // 20% of 199 = round(39.8) = 40
      expect(calc.discountAmount).toBe(40);
      expect(calc.subtotalAfterDiscount).toBe(159);
      // 18% GST on 159 is round(28.62) = 29
      expect(calc.taxAmount).toBe(29);
      expect(calc.totalPayable).toBe(188);
    });

    it('validates coupon codes accurately', () => {
      const validRes = paymentService.validateCoupon('MEME20', 199);
      expect(validRes.valid).toBe(true);
      expect(validRes.coupon?.code).toBe('MEME20');

      const lowerCaseRes = paymentService.validateCoupon('meme20', 199);
      expect(lowerCaseRes.valid).toBe(true);

      const invalidRes = paymentService.validateCoupon('INVALID99', 199);
      expect(invalidRes.valid).toBe(false);
      expect(invalidRes.error).toContain('invalid');
    });

    it('validates billing details correctly', () => {
      const validDetails = {
        fullName: 'Test Creator',
        email: 'creator@test.com',
        phone: '9876543210',
        address: '123 Meme Street',
        state: 'Tamil Nadu',
        pinCode: '600001',
      };
      const valid = paymentService.validateBillingDetails(validDetails);
      expect(valid.valid).toBe(true);
      expect(Object.keys(valid.errors).length).toBe(0);

      const invalidDetails = {
        fullName: '',
        email: 'not-an-email',
        phone: '123',
        address: '',
        state: '',
        pinCode: '12',
      };
      const invalid = paymentService.validateBillingDetails(invalidDetails);
      expect(invalid.valid).toBe(false);
      expect(invalid.errors.fullName).toBeDefined();
      expect(invalid.errors.email).toBeDefined();
      expect(invalid.errors.phone).toBeDefined();
      expect(invalid.errors.pinCode).toBeDefined();
    });

    it('validates payment methods properly', () => {
      // Valid UPI
      const validUpi = paymentService.validatePaymentDetails({
        method: 'upi',
        upiApp: 'gpay',
      });
      expect(validUpi.valid).toBe(true);

      // Valid Card
      const validCard = paymentService.validatePaymentDetails({
        method: 'card',
        cardNumber: '4532890123456789',
        cardHolder: 'John Doe',
        expiry: '12/28',
        cvv: '123',
      });
      expect(validCard.valid).toBe(true);

      // Invalid Card
      const invalidCard = paymentService.validatePaymentDetails({
        method: 'card',
        cardNumber: '1234',
        cardHolder: '',
        expiry: '99/99',
        cvv: '1',
      });
      expect(invalidCard.valid).toBe(false);
    });
  });

  describe('useSubscriptionStore State Management', () => {
    it('initializes with default free subscription', () => {
      const sub = useSubscriptionStore.getState().currentSubscription;
      expect(sub.planId).toBe('free');
      expect(sub.status).toBe('active');
    });

    it('toggles billing cycle and selects plan for checkout', () => {
      act(() => {
        useSubscriptionStore.getState().setBillingCycle('yearly');
        useSubscriptionStore.getState().selectPlanForCheckout('premium');
      });

      const state = useSubscriptionStore.getState();
      expect(state.billingCycle).toBe('yearly');
      expect(state.selectedPlanId).toBe('premium');
    });

    it('applies valid coupon and handles invalid coupon error', () => {
      let applied = false;
      act(() => {
        applied = useSubscriptionStore.getState().applyCoupon('MEME20');
      });
      expect(applied).toBe(true);
      expect(useSubscriptionStore.getState().appliedCoupon?.code).toBe('MEME20');
      expect(useSubscriptionStore.getState().couponError).toBeNull();

      act(() => {
        applied = useSubscriptionStore.getState().applyCoupon('BOGUS_COUPON');
      });
      expect(applied).toBe(false);
      expect(useSubscriptionStore.getState().couponError).toBeTruthy();
    });

    it('successfully processes demo payment and activates Pro tier', async () => {
      useSubscriptionStore.getState().selectPlanForCheckout('pro', 'monthly');

      const billing = {
        fullName: 'Jane Creator',
        email: 'jane@creator.io',
        phone: '9876543210',
        address: '10 Meme Lane',
        state: 'Karnataka',
        pinCode: '560001',
      };
      const payment = {
        method: 'upi' as const,
        upiApp: 'phonepe' as const,
      };

      let result: PaymentResult | undefined;
      await act(async () => {
        result = await useSubscriptionStore.getState().processPayment(billing, payment, false);
      });

      expect(result?.success).toBe(true);
      expect(result?.orderId).toMatch(/^MH-SUB-/);

      const current = useSubscriptionStore.getState().currentSubscription;
      expect(current.planId).toBe('pro');
      expect(current.status).toBe('active');
      expect(current.amountPaid).toBeGreaterThan(0);
      expect(current.renewalDate).toBeDefined();

      // Verify localStorage persistence
      const stored = JSON.parse(localStorage.getItem('memehub_subscription') || '{}');
      expect(stored.planId).toBe('pro');
    });

    it('handles simulated payment failure correctly', async () => {
      useSubscriptionStore.getState().selectPlanForCheckout('premium', 'monthly');

      const billing = {
        fullName: 'Jane Creator',
        email: 'jane@creator.io',
        phone: '9876543210',
        address: '10 Meme Lane',
        state: 'Karnataka',
        pinCode: '560001',
      };
      const payment = {
        method: 'card' as const,
        cardNumber: '4532890123456789',
        cardHolder: 'Jane Creator',
        expiry: '10/28',
        cvv: '999',
      };

      let result: PaymentResult | undefined;
      await act(async () => {
        result = await useSubscriptionStore.getState().processPayment(billing, payment, true);
      });

      expect(result?.success).toBe(false);
      expect(useSubscriptionStore.getState().paymentError).toContain('declined');
      expect(useSubscriptionStore.getState().currentSubscription.planId).toBe('free');
    });

    it('allows cancelling an active subscription and resetting to free', () => {
      // Set to Pro first
      useSubscriptionStore.setState({
        currentSubscription: {
          planId: 'pro',
          status: 'active',
          billingCycle: 'monthly',
          startDate: new Date().toISOString(),
          renewalDate: 'Nov 28, 2026',
          amountPaid: 235,
          orderId: 'MH-SUB-123456',
          paymentMethod: 'UPI',
        },
      });

      act(() => {
        useSubscriptionStore.getState().cancelSubscription();
      });
      expect(useSubscriptionStore.getState().currentSubscription.status).toBe('cancelled');

      act(() => {
        useSubscriptionStore.getState().resetToFree();
      });
      expect(useSubscriptionStore.getState().currentSubscription.planId).toBe('free');
      expect(useSubscriptionStore.getState().currentSubscription.status).toBe('active');
    });
  });

  describe('Subscription UI Components', () => {
    it('BillingToggle switches billing frequency when clicked', () => {
      const onChange = vi.fn();
      render(<BillingToggle cycle="monthly" onChange={onChange} />);

      const yearlyBtn = screen.getByRole('button', { name: /Yearly Billing/i });
      fireEvent.click(yearlyBtn);
      expect(onChange).toHaveBeenCalledWith('yearly');
    });

    it('PlanCard renders features and triggers selection callback', () => {
      const onSelect = vi.fn();
      const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'pro')!;

      render(
        <PlanCard
          plan={proPlan}
          billingCycle="monthly"
          isCurrentPlan={false}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Pro')).toBeInTheDocument();
      expect(screen.getByText('₹199')).toBeInTheDocument();
      expect(screen.getByText('Watermark-free exports on all memes')).toBeInTheDocument();

      const upgradeBtn = screen.getByRole('button', { name: /Upgrade to Pro/i });
      fireEvent.click(upgradeBtn);
      expect(onSelect).toHaveBeenCalledWith('pro');
    });

    it('PlanCard displays Active Plan badge when user is already subscribed', () => {
      const onSelect = vi.fn();
      const freePlan = SUBSCRIPTION_PLANS.find((p) => p.id === 'free')!;

      render(
        <PlanCard
          plan={freePlan}
          billingCycle="monthly"
          isCurrentPlan={true}
          onSelect={onSelect}
        />
      );

      expect(screen.getByText('Active Plan')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Current Active Plan/i })).toBeDisabled();
    });
  });
});

