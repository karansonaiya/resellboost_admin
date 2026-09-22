import React from 'react';
import { Users, Activity, Crown, Clock, UserCheck, Zap } from 'lucide-react';
import { DashboardMetrics } from '../types/dashboard';

interface StatCardsProps {
  metrics: DashboardMetrics;
  onSelectTierFilter: (filter: 'all' | 'pro' | 'trial' | 'free' | 'active_today') => void;
  currentFilter: string;
}

export const StatCards: React.FC<StatCardsProps> = ({
  metrics,
  onSelectTierFilter,
  currentFilter,
}) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Installs',
      value: metrics.totalUsers.toLocaleString(),
      subtext: 'Registered browser extensions',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
      activeRing: 'ring-2 ring-blue-500',
    },
    {
      id: 'active_today',
      title: 'Active Today',
      value: metrics.activeToday.toLocaleString(),
      subtext: `${metrics.activeThisWeek.toLocaleString()} active in last 7 days`,
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'pro',
      title: 'Pro Subscribers',
      value: metrics.proUsers.toLocaleString(),
      subtext: `${metrics.conversionRate}% conversion rate`,
      icon: Crown,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'trial',
      title: '7-Day Free Trials',
      value: metrics.trialUsers.toLocaleString(),
      subtext: 'Currently testing Pro features',
      icon: Clock,
      color: 'from-purple-500/20 to-brand-500/10 text-purple-400 border-purple-500/30',
      activeRing: 'ring-2 ring-purple-500',
    },
    {
      id: 'free',
      title: 'Free Plan Users',
      value: metrics.freeUsers.toLocaleString(),
      subtext: 'Subject to 1500 shares limit',
      icon: UserCheck,
      color: 'from-slate-500/20 to-gray-500/10 text-slate-400 border-slate-700',
      activeRing: 'ring-2 ring-slate-500',
    },
    {
      id: 'actions',
      title: 'Total Platform Shares',
      value: metrics.totalShares.toLocaleString(),
      subtext: `${metrics.totalFollows.toLocaleString()} follows • ${metrics.totalOffers.toLocaleString()} offers`,
      icon: Zap,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
      activeRing: '',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = currentFilter === card.id;

        return (
          <div
            key={card.id}
            onClick={() => {
              if (card.id !== 'actions') {
                onSelectTierFilter(card.id as any);
              }
            }}
            className={`glass-panel glass-panel-hover rounded-2xl p-4 flex flex-col justify-between border cursor-pointer transition-all ${
              card.color
            } ${isSelected ? card.activeRing : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold tracking-tight text-white">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 truncate">
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
