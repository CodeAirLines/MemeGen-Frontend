import type { SubscriptionPlan, Coupon, FeatureComparisonItem } from '../types/subscription';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'Essential meme creation for casual creators and starters',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Access to 100+ standard templates',
      'Basic text customization & fonts',
      'Standard 720p HD image exports',
      'Up to 5 AI captions generated per day',
      'Basic GIF maker (3-sec clip, 10 fps)',
      'Community feed sharing & voting',
      'Save up to 5 drafts in browser',
    ],
    limitations: [
      'Standard MemeHub watermark on exports',
      'No AI background removal tool',
      'No batch template exports',
      'Standard community support',
    ],
    ctaText: 'Get Started Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Unleash full creative power with premium tools and zero watermarks',
    badge: 'Most Popular',
    popular: true,
    monthlyPrice: 199,
    yearlyPrice: 1999, // ~₹166/month (Save 16%)
    features: [
      'Everything in Free Plan',
      'Watermark-free exports on all memes',
      '500+ premium & trending templates',
      'High-Resolution 1080p Full HD exports',
      'Up to 100 AI captions generated per day',
      'Enhanced GIF Maker (15-sec clip, 30 fps)',
      'AI Smart Caption generator & style tunes',
      'Store up to 100 drafts with cloud sync',
      'Custom fonts & sticker uploads',
      'Priority email & discord support',
    ],
    ctaText: 'Upgrade to Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'The ultimate powerhouse for viral creators, influencers, and meme pages',
    badge: 'VIP Creator',
    monthlyPrice: 499,
    yearlyPrice: 4999, // ~₹416/month (Save 17%)
    features: [
      'Everything in Pro Plan',
      'Unlimited AI Captions & AI Suggestions',
      'AI Background Removal & Auto-Cutouts',
      'Ultra 4K Ultra-HD resolution exports',
      'Pro GIF Suite (60-sec clip, 60 fps, sound loop)',
      'Exclusive early access to viral template drops',
      'Unlimited draft storage & backup restore',
      'Custom brand watermark & social handle overlays',
      'Team collaboration & shared asset folder',
      'Dedicated 24/7 VIP priority support',
    ],
    ctaText: 'Unlock Premium VIP',
  },
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'MEME20',
    discountPercent: 20,
    description: '20% discount on any Pro or Premium subscription',
  },
  {
    code: 'PROMO50',
    discountPercent: 50,
    description: 'Special 50% discount for community creators',
  },
  {
    code: 'WELCOME10',
    discountPercent: 10,
    description: '10% welcome discount for new subscribers',
  },
  {
    code: 'MEMEHUB',
    discountAmount: 100,
    description: 'Flat ₹100 instant off on your subscription',
  },
];

export const FEATURE_COMPARISONS: FeatureComparisonItem[] = [
  // Creation & Quality
  {
    feature: 'Meme Template Library',
    category: 'Creation & Studio',
    free: '100+ Standard',
    pro: '500+ Premium & Trending',
    premium: 'Unlimited VIP + Early Drops',
  },
  {
    feature: 'Export Resolution',
    category: 'Creation & Studio',
    free: '720p HD',
    pro: '1080p Full HD',
    premium: '4K Ultra-HD',
  },
  {
    feature: 'Watermark Removal',
    category: 'Creation & Studio',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'Custom Watermark / Social Handle',
    category: 'Creation & Studio',
    free: false,
    pro: false,
    premium: true,
  },
  {
    feature: 'Custom Fonts & Sticker Uploads',
    category: 'Creation & Studio',
    free: false,
    pro: true,
    premium: true,
  },
  // AI Tools
  {
    feature: 'AI Caption Generator',
    category: 'AI Superpowers',
    free: '5 / day',
    pro: '100 / day',
    premium: 'Unlimited',
  },
  {
    feature: 'AI Smart Tone & Humor Selector',
    category: 'AI Superpowers',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'AI Background Remover & Cutout',
    category: 'AI Superpowers',
    free: false,
    pro: false,
    premium: true,
  },
  // GIF Generator
  {
    feature: 'GIF Duration & Quality',
    category: 'GIF Maker',
    free: '3s / 10 fps',
    pro: '15s / 30 fps',
    premium: '60s / 60 fps HD',
  },
  {
    feature: 'Video to GIF Conversion',
    category: 'GIF Maker',
    free: 'Basic MP4/WebM',
    pro: 'All Formats + High Res',
    premium: 'Pro Multi-pass Encoding',
  },
  // Storage & Management
  {
    feature: 'Drafts Storage',
    category: 'Drafts & Assets',
    free: '5 Local Drafts',
    pro: '100 Drafts + Sync',
    premium: 'Unlimited Drafts + Backup',
  },
  {
    feature: 'Priority Rendering Queue',
    category: 'Performance & Support',
    free: false,
    pro: true,
    premium: true,
  },
  {
    feature: 'Support Channel',
    category: 'Performance & Support',
    free: 'Community Discord',
    pro: 'Priority Email',
    premium: '24/7 Dedicated VIP Chat',
  },
];

export const SUBSCRIPTION_FAQS = [
  {
    question: 'How does the Demo Payment work?',
    answer:
      'This checkout runs in demo simulation mode for testing and frontend evaluation. No real payment gateway credentials, CVVs, or real money will be charged. All payment methods simulate a realistic transaction flow safely.',
  },
  {
    question: 'Can I switch between monthly and yearly billing anytime?',
    answer:
      'Yes! You can switch your billing frequency or upgrade to another plan at any time. When switching to yearly, you immediately receive up to 20% off your active subscription.',
  },
  {
    question: 'What happens when my subscription ends or is cancelled?',
    answer:
      'If you cancel your subscription, you retain all Pro or Premium benefits until the end of your current billing period. Afterwards, your account smoothly transitions back to the Free plan with all your created memes safely intact.',
  },
  {
    question: 'Which payment methods are supported in the demo?',
    answer:
      'We support all major Indian and international payment options including UPI (Google Pay, PhonePe, Paytm, BHIM, VPA), Credit & Debit cards (Visa, Mastercard, RuPay), Net Banking (HDFC, ICICI, SBI, Axis, Kotak), and popular Wallets.',
  },
  {
    question: 'Are there any hidden fees or extra taxes?',
    answer:
      'No hidden fees. In demo checkout, GST (18%) and coupon discounts are calculated transparently before you confirm the mock order.',
  },
];

export const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'UTIB' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', code: 'KKBK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB' },
  { id: 'bob', name: 'Bank of Baroda', code: 'BARB' },
];

export const POPULAR_WALLETS = [
  { id: 'paytm', name: 'Paytm Wallet', iconColor: '#00BAF2' },
  { id: 'phonepe', name: 'PhonePe Wallet', iconColor: '#5f259f' },
  { id: 'amazonpay', name: 'Amazon Pay', iconColor: '#FF9900' },
  { id: 'mobikwik', name: 'MobiKwik', iconColor: '#2B83EA' },
];

