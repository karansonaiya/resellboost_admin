import React, { useState } from 'react';
import { Search, Crown, Clock, CheckCircle, Copy, Check, Filter, ArrowUpDown } from 'lucide-react';
import { UserTelemetryItem, TierFilter } from '../types/dashboard';

interface UsersTableProps {
  users: UserTelemetryItem[];
  totalUsers: number;
  selectedFilter: TierFilter;
  onSelectFilter: (filter: TierFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onUpdateUserTier: (userId: string, tier: 'free' | 'pro', isTrial: boolean) => Promise<void>;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  totalUsers,
  selectedFilter,
  onSelectFilter,
  searchQuery,
  onSearchChange,
  onUpdateUserTier,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTierToggle = async (user: UserTelemetryItem) => {
    if (updatingId) return; // re-entrancy guard - React's `disabled` prop only takes effect on the next paint
    const newTier = user.tier === 'pro' && !user.is_trial_active ? 'free' : 'pro';
    const label = user.email || user.user_id;
    const confirmed = window.confirm(
      newTier === 'pro'
        ? `Grant Pro to ${label}?`
        : `Revoke Pro from ${label}? They will immediately lose access to all Pro features.`
    );
    if (!confirmed) return;

    setUpdatingId(user.user_id);
    await onUpdateUserTier(user.user_id, newTier, false);
    setUpdatingId(null);
  };

  const formatRelativeTime = (isoString: string): string => {
    const ms = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(ms / (60 * 1000));
    const hours = Math.floor(ms / (3600 * 1000));
    const days = Math.floor(ms / (24 * 3600 * 1000));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filters: { id: TierFilter; label: string }[] = [
    { id: 'all', label: `All Users (${totalUsers})` },
    { id: 'pro', label: 'Pro Only' },
    { id: 'trial', label: '7-Day Trial' },
    { id: 'free', label: 'Free Tier' },
    { id: 'active_today', label: 'Active Today' },
  ];

  return (
    <div className="glass-panel rounded-2xl border overflow-hidden">
      
      {/* Header with Search and Filter Tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedFilter === f.id
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:min-w-[260px] md:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by User ID, Email, Key..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>

      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800/60">
            <tr>
              <th className="py-3 px-4">User Details</th>
              <th className="py-3 px-4">Tier / Plan</th>
              <th className="py-3 px-4">Last Active</th>
              <th className="py-3 px-4">Platform Usage</th>
              <th className="py-3 px-4">Installed</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-slate-300">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500">
                      <Filter className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">
                      No Live Users Recorded Yet
                    </span>
                    <p className="text-xs text-slate-500 max-w-md">
                      Clean state active. Once you connect your Supabase database and run your Chrome Extension, real seller installations and activity will appear here automatically.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isPro = user.tier === 'pro' && !user.is_trial_active;
                const isTrial = user.is_trial_active;
                const isUpdating = updatingId === user.user_id;

                return (
                  <tr
                    key={user.user_id}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    {/* User ID / Email */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-white text-xs">
                          {user.email || user.user_id}
                        </span>
                        <button
                          onClick={() => copyToClipboard(user.user_id)}
                          title="Copy full User UUID"
                          className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === user.user_id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {user.email && (
                        <div className="text-[11px] font-mono text-slate-500">
                          {user.user_id}
                        </div>
                      )}
                      {user.license_key && (
                        <div className="text-[10px] text-brand-400/80 font-mono mt-0.5">
                          Key: {user.license_key}
                        </div>
                      )}
                    </td>

                    {/* Tier / Plan Badge */}
                    <td className="py-3 px-4">
                      {isPro ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>PRO Lifetime</span>
                        </span>
                      ) : isTrial ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>Trial ({user.trial_days_left}d left)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          <span>Free Plan</span>
                        </span>
                      )}
                    </td>

                    {/* Last Active */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            Date.now() - new Date(user.last_active_at).getTime() < 24 * 3600 * 1000
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                              : 'bg-slate-600'
                          }`}
                        />
                        <span className="font-medium text-slate-200">
                          {formatRelativeTime(user.last_active_at)}
                        </span>
                      </div>
                    </td>

                    {/* Platform Usage Stats */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <div>
                          <span className="text-slate-400">Shares: </span>
                          <span className="font-semibold text-white">
                            {user.total_shares.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Follows: </span>
                          <span className="font-semibold text-white">
                            {user.total_follows.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Installed Date */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(user.installed_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        disabled={isUpdating}
                        onClick={() => handleTierToggle(user)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border ${
                          isPro
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        }`}
                      >
                        {isUpdating ? 'Saving...' : isPro ? 'Revoke Pro' : 'Grant Pro'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
