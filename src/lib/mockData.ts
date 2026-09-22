import { UserTelemetryItem, DashboardMetrics } from '../types/dashboard';

const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const MOCK_USERS: UserTelemetryItem[] = [
  {
    user_id: 'usr_c901f4a-8d11',
    email: 'sarah.vintage@gmail.com',
    tier: 'pro',
    is_trial_active: false,
    trial_days_left: 0,
    license_key: 'RB-PRO-98442-VINT',
    version: '1.0.0',
    total_shares: 14820,
    total_follows: 3410,
    total_offers: 520,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 45 * day).toISOString(),
    last_active_at: new Date(now - 12 * 60 * 1000).toISOString(),
  },
  {
    user_id: 'usr_81b7e09-22a1',
    email: 'closetqueen_ny@yahoo.com',
    tier: 'pro',
    is_trial_active: false,
    trial_days_left: 0,
    license_key: 'VIP-BOOST-2026',
    version: '1.0.0',
    total_shares: 28900,
    total_follows: 7850,
    total_offers: 1120,
    platform_preference: 'both',
    status: 'active',
    installed_at: new Date(now - 60 * day).toISOString(),
    last_active_at: new Date(now - 42 * 60 * 1000).toISOString(),
  },
  {
    user_id: 'usr_42d991f-ff32',
    email: 'depop_drip_la@gmail.com',
    tier: 'pro',
    is_trial_active: true,
    trial_days_left: 5,
    version: '1.0.0',
    total_shares: 3200,
    total_follows: 890,
    total_offers: 140,
    platform_preference: 'depop',
    status: 'active',
    installed_at: new Date(now - 2 * day).toISOString(),
    last_active_at: new Date(now - 2 * hour).toISOString(),
  },
  {
    user_id: 'usr_7a1e04c-bb49',
    email: 'thrift_flip_jess@outlook.com',
    tier: 'pro',
    is_trial_active: true,
    trial_days_left: 3,
    version: '1.0.0',
    total_shares: 5410,
    total_follows: 1200,
    total_offers: 280,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 4 * day).toISOString(),
    last_active_at: new Date(now - 5 * hour).toISOString(),
  },
  {
    user_id: 'usr_23fc19b-001a',
    email: 'retro_reseller_tx@gmail.com',
    tier: 'pro',
    is_trial_active: false,
    trial_days_left: 0,
    license_key: 'RB-PRO-77123-TEXAS',
    version: '1.0.0',
    total_shares: 41200,
    total_follows: 12400,
    total_offers: 2310,
    platform_preference: 'both',
    status: 'active',
    installed_at: new Date(now - 90 * day).toISOString(),
    last_active_at: new Date(now - 1 * day).toISOString(),
  },
  {
    user_id: 'usr_5ff899a-cd33',
    email: undefined,
    tier: 'pro',
    is_trial_active: true,
    trial_days_left: 1,
    version: '1.0.0',
    total_shares: 1980,
    total_follows: 450,
    total_offers: 90,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 6 * day).toISOString(),
    last_active_at: new Date(now - 3 * hour).toISOString(),
  },
  {
    user_id: 'usr_bb1029c-ee71',
    email: 'mike_kicks_resell@gmail.com',
    tier: 'free',
    is_trial_active: false,
    trial_days_left: 0,
    version: '1.0.0',
    total_shares: 1450,
    total_follows: 490,
    total_offers: 110,
    platform_preference: 'depop',
    status: 'active',
    installed_at: new Date(now - 14 * day).toISOString(),
    last_active_at: new Date(now - 4 * hour).toISOString(),
  },
  {
    user_id: 'usr_882cc11-399a',
    email: undefined,
    tier: 'free',
    is_trial_active: false,
    trial_days_left: 0,
    version: '1.0.0',
    total_shares: 890,
    total_follows: 310,
    total_offers: 45,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 20 * day).toISOString(),
    last_active_at: new Date(now - 18 * hour).toISOString(),
  },
  {
    user_id: 'usr_33da291-77fe',
    email: 'chicago_posher@gmail.com',
    tier: 'free',
    is_trial_active: false,
    trial_days_left: 0,
    version: '1.0.0',
    total_shares: 1500,
    total_follows: 500,
    total_offers: 180,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 28 * day).toISOString(),
    last_active_at: new Date(now - 2 * day).toISOString(),
  },
  {
    user_id: 'usr_e012fa8-441b',
    email: 'boston_boutique@icloud.com',
    tier: 'pro',
    is_trial_active: false,
    trial_days_left: 0,
    license_key: 'RB-PRO-44219-BOS',
    version: '1.0.0',
    total_shares: 33400,
    total_follows: 9100,
    total_offers: 1850,
    platform_preference: 'both',
    status: 'active',
    installed_at: new Date(now - 75 * day).toISOString(),
    last_active_at: new Date(now - 22 * hour).toISOString(),
  },
  {
    user_id: 'usr_99fba01-112e',
    email: undefined,
    tier: 'free',
    is_trial_active: false,
    trial_days_left: 0,
    version: '1.0.0',
    total_shares: 420,
    total_follows: 180,
    total_offers: 30,
    platform_preference: 'depop',
    status: 'inactive',
    installed_at: new Date(now - 35 * day).toISOString(),
    last_active_at: new Date(now - 12 * day).toISOString(),
  },
  {
    user_id: 'usr_1a88cf3-90bc',
    email: 'fashion_finds_ca@gmail.com',
    tier: 'pro',
    is_trial_active: true,
    trial_days_left: 6,
    version: '1.0.0',
    total_shares: 1100,
    total_follows: 290,
    total_offers: 50,
    platform_preference: 'poshmark',
    status: 'active',
    installed_at: new Date(now - 1 * day).toISOString(),
    last_active_at: new Date(now - 1 * hour).toISOString(),
  },
];

export function computeMetrics(users: UserTelemetryItem[]): DashboardMetrics {
  const oneDayAgo = now - 24 * hour;
  const sevenDaysAgo = now - 7 * day;

  let activeToday = 0;
  let activeThisWeek = 0;
  let proUsers = 0;
  let trialUsers = 0;
  let freeUsers = 0;
  let totalShares = 0;
  let totalFollows = 0;
  let totalOffers = 0;

  users.forEach((u) => {
    const lastActive = new Date(u.last_active_at).getTime();
    if (lastActive >= oneDayAgo) activeToday++;
    if (lastActive >= sevenDaysAgo) activeThisWeek++;

    if (u.is_trial_active) {
      trialUsers++;
    } else if (u.tier === 'pro') {
      proUsers++;
    } else {
      freeUsers++;
    }

    totalShares += u.total_shares || 0;
    totalFollows += u.total_follows || 0;
    totalOffers += u.total_offers || 0;
  });

  const totalUsers = users.length;
  const conversionRate = totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0;

  return {
    totalUsers,
    activeToday,
    activeThisWeek,
    proUsers,
    trialUsers,
    freeUsers,
    totalShares,
    totalFollows,
    totalOffers,
    conversionRate,
  };
}

export const MOCK_METRICS: DashboardMetrics = computeMetrics(MOCK_USERS);
