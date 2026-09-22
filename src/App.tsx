import React, { useState, useEffect, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Navbar } from './components/Navbar';
import { StatCards } from './components/StatCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { UsersTable } from './components/UsersTable';
import { LicenseManager } from './components/LicenseManager';
import { CanaryMonitor } from './components/CanaryMonitor';
import { SettingsModal } from './components/SettingsModal';
import { Login } from './components/Login';
import {
  getStoredConfig,
  fetchDashboardMetrics,
  fetchUsersList,
  updateUserStatus,
  getSession,
  onAuthStateChange,
  signOut,
  SupabaseConfig,
} from './lib/supabase';
import { DashboardMetrics, UserTelemetryItem, TierFilter } from './types/dashboard';
import { MOCK_METRICS } from './lib/mockData';

export const App: React.FC = () => {
  const [config, setConfig] = useState<SupabaseConfig>(getStoredConfig());
  const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK_METRICS);
  const [users, setUsers] = useState<UserTelemetryItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<TierFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Real (non-demo) data requires a logged-in admin (issue #2). Demo Mode
  // never touches live data, so it's viewable without a Supabase account.
  useEffect(() => {
    if (config.isDemoMode) {
      setSession(null);
      return;
    }
    getSession().then(setSession);
    const subscription = onAuthStateChange(setSession);
    return () => subscription.unsubscribe();
  }, [config.isDemoMode, config.url, config.anonKey]);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [newMetrics, newUsers] = await Promise.all([
        fetchDashboardMetrics(),
        fetchUsersList(selectedFilter, searchQuery),
      ]);
      setMetrics(newMetrics);
      setUsers(newUsers);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedFilter, searchQuery]);

  const isAuthed = config.isDemoMode || Boolean(session);

  useEffect(() => {
    if (!isAuthed) return;
    loadData();
  }, [loadData, isAuthed]);

  if (!config.isDemoMode && session === undefined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        Loading...
      </div>
    );
  }

  if (!config.isDemoMode && !session) {
    return <Login onSignedIn={() => getSession().then(setSession)} />;
  }

  const handleUpdateUserTier = async (
    userId: string,
    tier: 'free' | 'pro',
    isTrial: boolean
  ) => {
    const success = await updateUserStatus(userId, tier, isTrial);
    if (success) {
      // Reload updated lists & metrics
      await loadData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
        activeToday={metrics.activeToday}
        isSignedIn={Boolean(session)}
        onSignOut={async () => {
          await signOut();
          setSession(null);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Alert for Demo Mode */}
        {config.isDemoMode && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-300">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold">Demo Mode Active:</span>
              <span className="text-slate-300">
                Displaying realistic sample seller telemetry data. Connect your Supabase project in Settings to stream live Chrome Extension metrics!
              </span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium transition-colors whitespace-nowrap"
            >
              Setup Supabase
            </button>
          </div>
        )}

        {/* 1. Stat Summary Cards */}
        <section>
          <StatCards
            metrics={metrics}
            onSelectTierFilter={(filter) => setSelectedFilter(filter)}
            currentFilter={selectedFilter}
          />
        </section>

        {/* 2. Canary Telemetry & Self-Healing Monitor */}
        <section>
          <CanaryMonitor isRefreshing={isRefreshing} />
        </section>

        {/* 3. Visual Analytics & Insights */}
        <section>
          <AnalyticsCharts metrics={metrics} />
        </section>

        {/* 3. License Key Generator */}
        <section>
          <LicenseManager />
        </section>

        {/* 4. Live Users Directory & Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Active User Directory</h2>
              <p className="text-xs text-slate-400">
                Inspect install IDs, plan limits, last activity timestamps, and automation volumes
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {users.length} records
            </span>
          </div>

          <UsersTable
            users={users}
            totalUsers={metrics.totalUsers}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUpdateUserTier={handleUpdateUserTier}
          />
        </section>

      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onConfigUpdated={(newConfig) => {
          setConfig(newConfig);
          loadData();
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>ResellBoost Pro — Advanced Chrome Extension Administration & Seller Analytics</p>
      </footer>
    </div>
  );
};

export default App;
