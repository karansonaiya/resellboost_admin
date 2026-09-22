export type PlanTier = 'free' | 'pro' | 'enterprise';

export interface UserTelemetryItem {
  user_id: string;
  email?: string;
  tier: PlanTier;
  is_trial_active: boolean;
  trial_days_left: number;
  license_key?: string;
  version: string;
  total_shares: number;
  total_follows: number;
  total_offers: number;
  platform_preference?: string;
  status: 'active' | 'inactive' | 'banned';
  installed_at: string;
  last_active_at: string;
  updated_at?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  proUsers: number;
  trialUsers: number;
  freeUsers: number;
  totalShares: number;
  totalFollows: number;
  totalOffers: number;
  conversionRate: number; // percentage of pro / total
}

export type TierFilter = 'all' | 'pro' | 'trial' | 'free' | 'active_today';

export interface CanaryErrorItem {
  id: string;
  user_id?: string;
  platform: 'poshmark' | 'depop';
  action: 'follow' | 'share' | 'offer' | 'bump' | 'relist';
  error_type: string;
  selector_attempted?: string;
  page_url?: string;
  details?: string;
  created_at: string;
}

export interface RemoteSelectorRecord {
  id: string;
  platform: string;
  version: number;
  selectors: Record<string, string[]>;
  updated_at: string;
}
