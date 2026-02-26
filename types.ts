
export interface StyleTemplate {
  id: string;
  name: string;
  imageUrl: string;
  prompt: string;
  description: string;
  autoGenerate?: boolean;
  displayOrder?: number;
  created_at?: string;
}

export interface SampleVideo {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  prompt: string;
  displayOrder: number;
}

export interface ApiKeyRecord {
  id: string;
  key: string;
  label: string;
  status: 'active' | 'exhausted' | 'invalid';
  addedAt: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface PaymentConfig {
  gateway: 'Razorpay';
  keyId: string;
  keySecret: string;
  currency: string;
  enabled: boolean;
  photoPrice: number;
  videoBasePrice: number;
  creditBundlePrice: number;
  creditBundleAmount: number;
}

export interface TrackingConfig {
  metaPixelId?: string;
}

export interface AffiliateRecord {
  id: string;
  user_id?: string;
  name: string;
  referral_code: string;
  email: string;
  balance: number;
  total_earned: number;
  created_at?: string;
}

export interface CommissionRecord {
  id: string;
  affiliate_id: string;
  transaction_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid';
  created_at?: string;
}

export interface AffiliateConfig {
  enabled: boolean;
  defaultCommissionPercentage: number;
}

export interface AdminSettings {
  passwordHash: string;
  username: string;
  payment: PaymentConfig;
  tracking: TrackingConfig;
  affiliate?: AffiliateConfig;
  geminiApiKey?: string;
  geminiApiKeys?: ApiKeyRecord[];
  coupons?: Coupon[];
  klingAccessKey?: string;
  klingSecretKey?: string;
  videoSamples?: SampleVideo[];
}

export interface CartItem {
  id: string;
  styledImage: string;
  styleName: string;
  price: number;
  isBundle?: boolean;
}

export interface User {
  id: string;
  email: string;
  isLoggedIn: boolean;
  credits: number;
  full_name?: string;
  avatar_url?: string;
}

export interface TransactionRecord {
  id?: string;
  razorpay_payment_id: string;
  user_email: string;
  amount: number;
  items: string[];
  status: 'authorized' | 'captured' | 'failed' | 'refund_requested' | 'refunded';
  render_status?: 'pending' | 'completed' | 'failed';
  referral_code?: string;
  created_at?: string;
}

export interface UserActivity {
  id?: string;
  event_name: string;
  event_data?: any;
  session_id: string;
  created_at?: string;
}

export type ViewType = 'hot' | 'photo' | 'video' | 'aitools' | 'admin' | 'about' | 'contact' | 'terms' | 'privacy' | 'refund' | 'shipping' | 'affiliate' | 'reset-password' | 'dashboard';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
    Razorpay: any;
  }
}
