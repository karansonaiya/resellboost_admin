import React from 'react';
import { PieChart, TrendingUp, Sparkles, Smartphone, Layers, ShieldCheck } from 'lucide-react';
import { DashboardMetrics } from '../types/dashboard';

interface AnalyticsChartsProps {
  metrics: DashboardMetrics;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metrics }) => {
  const total = metrics.totalUsers || 1;
  const proPercent = Math.round((metrics.proUsers / total) * 100);
  const trialPercent = Math.round((metrics.trialUsers / total) * 100);
  const freePercent = Math.max(0, 100 - proPercent - trialPercent);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* User Tier Breakdown Bar & Stats */}
      <div className="glass-panel rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-brand-400" />
              <h3 className="font-semibold text-white">License & Tier Distribution</h3>
            </div>
            <span className="text-xs text-slate-400">Live Breakdown</span>
          </div>

          {/* Segmented Visual Bar */}
          <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${proPercent}%` }}
              className="bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
              title={`Pro Users: ${proPercent}%`}
            />
            <div
              style={{ width: `${trialPercent}%` }}
              className="bg-gradient-to-r from-purple-500 to-brand-400 transition-all duration-500"
              title={`Trial Users: ${trialPercent}%`}
            />
            <div
              style={{ width: `${freePercent}%` }}
              className="bg-slate-600 transition-all duration-500"
              title={`Free Users: ${freePercent}%`}
            />
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/20">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-slate-300">Pro Lifetime</span>
              </div>
              <div className="mt-2 text-xl font-bold text-amber-400">{metrics.proUsers}</div>
              <div className="text-[11px] text-slate-400">{proPercent}% of total users</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span className="text-xs font-medium text-slate-300">7-Day Trial</span>
              </div>
              <div className="mt-2 text-xl font-bold text-purple-400">{metrics.trialUsers}</div>
              <div className="text-[11px] text-slate-400">{trialPercent}% in trial funnel</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-xs font-medium text-slate-300">Free Tier</span>
              </div>
              <div className="mt-2 text-xl font-bold text-slate-300">{metrics.freeUsers}</div>
              <div className="text-[11px] text-slate-400">{freePercent}% daily quota limited</div>
            </div>
          </div>
        </div>

        {/* Insight footer */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1 text-brand-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trial-to-Paid Conversion rate: ~{metrics.conversionRate}%</span>
          </span>
          <span>Automatic Gumroad & ExtPay verification</span>
        </div>
      </div>

      {/* Activity Health & Platform Card */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">Engagement Health</h3>
            </div>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Safe & Active
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Daily Active Ratio (DAU / Total)</span>
                <span className="font-bold text-white">
                  {Math.round((metrics.activeToday / total) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.round((metrics.activeToday / total) * 100))}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Weekly Active Ratio (WAU / Total)</span>
                <span className="font-bold text-white">
                  {Math.round((metrics.activeThisWeek / total) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.round((metrics.activeThisWeek / total) * 100))}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">Total Follows Sent</span>
              <div className="text-lg font-bold text-white mt-0.5">
                {metrics.totalFollows.toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">Batch Offers Sent</span>
              <div className="text-lg font-bold text-white mt-0.5">
                {metrics.totalOffers.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Human-Safe delays active</span>
          </span>
          <span>Poshmark & Depop</span>
        </div>
      </div>

    </div>
  );
};
