import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserTelemetryItem, DashboardMetrics, TierFilter, CanaryErrorItem, RemoteSelectorRecord } from '../types/dashboard';
import { MOCK_USERS, computeMetrics } from './mockData';

const CONFIG_KEY_URL = 'resellboost_admin_supabase_url';
const CONFIG_KEY_KEY = 'resellboost_admin_supabase_key';
const CONFIG_KEY_DEMO_MODE = 'resellboost_admin_demo_mode';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isDemoMode: boolean;
}

export const EMPTY_METRICS: DashboardMetrics = {
  totalUsers: 0,
  activeToday: 0,
  activeThisWeek: 0,
  proUsers: 0,
  trialUsers: 0,
  freeUsers: 0,
  totalShares: 0,
  totalFollows: 0,
  totalOffers: 0,
  conversionRate: 0,
};

export function getStoredConfig(): SupabaseConfig {
  const url = localStorage.getItem(CONFIG_KEY_URL) || '';
  const anonKey = localStorage.getItem(CONFIG_KEY_KEY) || '';
  const isDemo = localStorage.getItem(CONFIG_KEY_DEMO_MODE);

  // Default to Demo Mode until an admin explicitly configures + saves real
  // credentials - never default to a live project nobody opted into.
  const isDemoMode = isDemo === null ? true : isDemo === 'true';

  return { url, anonKey, isDemoMode };
}

export function saveStoredConfig(config: Partial<SupabaseConfig>): void {
  if (config.url !== undefined) localStorage.setItem(CONFIG_KEY_URL, config.url.trim());
  if (config.anonKey !== undefined) localStorage.setItem(CONFIG_KEY_KEY, config.anonKey.trim());
  if (config.isDemoMode !== undefined) localStorage.setItem(CONFIG_KEY_DEMO_MODE, String(config.isDemoMode));
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredConfig();
  if (!url || !anonKey) {
    return null;
  }
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export function resetClient(): void {
  supabaseInstance = null;
}

/**
 * Admin authentication (issue #2: the dashboard used to have no login at
 * all). Uses the Supabase Auth session already supported by
 * @supabase/supabase-js - once signed in, the client's requests run as the
 * `authenticated` role, which is what the tightened RLS policies require
 * for writes (grant/revoke Pro, selector edits, clearing errors, issuing
 * license keys).
 */
export async function getSession() {
  const client = getSupabaseClient();
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: import('@supabase/supabase-js').Session | null) => void) {
  const client = getSupabaseClient();
  if (!client) return { unsubscribe: () => {} };
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
  return data.subscription;
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Connect to Supabase first (Settings) before signing in.' };
  }
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: 'Signed in.' };
}

export async function signOut(): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  await client.auth.signOut();
}

/**
 * Returns the current admin's Supabase Auth access token, for calling
 * authenticated-only Edge Functions like issue-license-key.
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.access_token ?? null;
}

/**
 * Tests connection to a Supabase project
 */
export async function testConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const tempClient = createClient(url, key);
    const { data, error } = await tempClient.from('user_telemetry').select('count', { count: 'exact', head: true });
    
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to user_telemetry table!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

/**
 * Fetches aggregate dashboard metrics
 */
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) {
    return computeMetrics(MOCK_USERS);
  }

  const client = getSupabaseClient();
  if (!client) {
    return EMPTY_METRICS;
  }

  try {
    const { data: users, error } = await client.from('user_telemetry').select('*');
    if (error || !users || users.length === 0) {
      return EMPTY_METRICS;
    }
    return computeMetrics(users as UserTelemetryItem[]);
  } catch (err) {
    console.error('Fetch metrics exception:', err);
    return EMPTY_METRICS;
  }
}

/**
 * Fetches user list with filtering and search
 */
export async function fetchUsersList(
  filter: TierFilter = 'all',
  searchQuery: string = ''
): Promise<UserTelemetryItem[]> {
  const { isDemoMode } = getStoredConfig();
  let list: UserTelemetryItem[] = [];

  if (isDemoMode) {
    list = [...MOCK_USERS];
  } else {
    const client = getSupabaseClient();
    if (!client) {
      return []; // Return empty list when no Supabase connected or in clean mode
    }

    try {
      const { data, error } = await client
        .from('user_telemetry')
        .select('*')
        .order('last_active_at', { ascending: false });

      if (error || !data) {
        console.warn('Supabase users query error:', error);
        return [];
      }
      list = data as UserTelemetryItem[];
    } catch (err) {
      console.error('Fetch users error:', err);
      return [];
    }
  }

  // Filter by Tier / Activity
  const now = Date.now();
  const oneDayAgo = now - 24 * 3600 * 1000;

  if (filter === 'pro') {
    list = list.filter((u) => u.tier === 'pro' && !u.is_trial_active);
  } else if (filter === 'trial') {
    list = list.filter((u) => u.is_trial_active);
  } else if (filter === 'free') {
    list = list.filter((u) => u.tier === 'free' && !u.is_trial_active);
  } else if (filter === 'active_today') {
    list = list.filter((u) => new Date(u.last_active_at).getTime() >= oneDayAgo);
  }

  // Search by query (user_id or email or license_key)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (u) =>
        u.user_id.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.license_key && u.license_key.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Update user tier directly from the admin panel (grant Pro / revoke Pro)
 */
export async function updateUserStatus(
  userId: string,
  tier: 'free' | 'pro',
  isTrial: boolean = false
): Promise<boolean> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) {
    const user = MOCK_USERS.find((u) => u.user_id === userId);
    if (user) {
      user.tier = tier;
      user.is_trial_active = isTrial;
      return true;
    }
    return false;
  }

  const client = getSupabaseClient();
  if (!client) return false;

  const { error } = await client
    .from('user_telemetry')
    .update({ tier, is_trial_active: isTrial })
    .eq('user_id', userId);

  return !error;
}

/**
 * Completely clears all telemetry records from Supabase (for clean testing restart)
 */
export async function clearAllTelemetryData(): Promise<{ success: boolean; message: string }> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) {
    return { success: true, message: 'Demo Mode is active - no real data was touched.' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client is not connected.' };
  }

  try {
    const { error } = await client
      .from('user_telemetry')
      .delete()
      .neq('user_id', '');

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'All test user records deleted from Supabase successfully!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to clear data' };
  }
}

/**
 * Fetches recent canary error reports from Supabase
 */
export async function fetchCanaryErrors(): Promise<CanaryErrorItem[]> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) return [];

  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('extension_errors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      return [];
    }
    return data as CanaryErrorItem[];
  } catch (err) {
    console.error('Fetch canary errors error:', err);
    return [];
  }
}

/**
 * Deletes all canary errors
 */
export async function clearCanaryErrors(): Promise<boolean> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) return true;

  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client
      .from('extension_errors')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    return !error;
  } catch {
    return false;
  }
}

/**
 * Fetches live remote selector definitions
 */
export async function fetchRemoteSelectors(): Promise<RemoteSelectorRecord[]> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) return [];

  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('extension_selectors')
      .select('*')
      .order('platform', { ascending: true });

    if (error || !data) return [];
    return data as RemoteSelectorRecord[];
  } catch {
    return [];
  }
}

/**
 * Updates remote selectors in Supabase (Zero-Downtime dynamic push)
 */
export async function updateRemoteSelectors(
  platform: 'poshmark' | 'depop',
  selectors: Record<string, string[]>
): Promise<{ success: boolean; message: string }> {
  const { isDemoMode } = getStoredConfig();
  if (isDemoMode) {
    return { success: false, message: 'Demo Mode is active - connect a real Supabase project to push selector changes.' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase client not connected' };
  }

  try {
    const { error } = await client
      .from('extension_selectors')
      .upsert(
        {
          id: platform,
          platform,
          selectors,
          version: Date.now(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: `Updated remote selectors for ${platform}!` };
  } catch (err: any) {
    return { success: false, message: err.message || 'Update failed' };
  }
}

