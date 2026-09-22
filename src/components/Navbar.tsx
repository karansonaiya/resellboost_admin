import React from 'react';
import { ShieldCheck, RefreshCw, Settings, Database, Activity, Sparkles, LogOut } from 'lucide-react';
import { SupabaseConfig } from '../lib/supabase';

interface NavbarProps {
  config: SupabaseConfig;
  onOpenSettings: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeToday: number;
  isSignedIn: boolean;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenSettings,
  onRefresh,
  isRefreshing,
  activeToday,
  isSignedIn,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between flex-wrap gap-y-2">

        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 p-0.5 shadow-lg shadow-brand-500/20 shrink-0">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight truncate">ResellBoost</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate hidden sm:block">Seller Automation & Telemetry Engine</p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center space-x-3 shrink-0">

          {/* Active Today Pill */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{activeToday} Active Today</span>
          </div>

          {/* Mode Pill (Disconnected vs Live Supabase vs Demo) */}
          <button
            onClick={onOpenSettings}
            className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              config.isDemoMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : config.url && config.anonKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Click to configure Supabase credentials"
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {config.isDemoMode
                ? 'Demo Mode'
                : config.url && config.anonKey
                ? 'Live Cloud'
                : 'Connect Supabase'}
            </span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Settings & Supabase API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Sign Out Button */}
          {isSignedIn && (
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
