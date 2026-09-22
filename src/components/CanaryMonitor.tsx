import React, { useState, useEffect } from 'react';
import { CanaryErrorItem, RemoteSelectorRecord } from '../types/dashboard';
import { fetchCanaryErrors, clearCanaryErrors, fetchRemoteSelectors } from '../lib/supabase';

interface CanaryMonitorProps {
  isRefreshing?: boolean;
}

export const CanaryMonitor: React.FC<CanaryMonitorProps> = ({ isRefreshing }) => {
  const [errors, setErrors] = useState<CanaryErrorItem[]>([]);
  const [selectors, setSelectors] = useState<RemoteSelectorRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadCanaryData = async () => {
    setLoading(true);
    try {
      const [errData, selData] = await Promise.all([
        fetchCanaryErrors(),
        fetchRemoteSelectors(),
      ]);
      setErrors(errData);
      setSelectors(selData);
    } catch (e) {
      console.error('Failed to load canary data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCanaryData();
  }, [isRefreshing]);

  const handleClearErrors = async () => {
    if (!window.confirm('Clear all logged canary error reports?')) return;
    const ok = await clearCanaryErrors();
    if (ok) {
      setErrors([]);
    }
  };

  const isHealthy = errors.length === 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-sm ${
              isHealthy
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isHealthy ? '🛡️' : '⚠️'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Canary Telemetry & Self-Healing Monitor
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isHealthy
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border border-rose-500/30 animate-pulse'
                }`}
              >
                {isHealthy ? 'All Systems Healthy (0 Anomalies)' : `${errors.length} Anomalies Logged`}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Silent real-time DOM error detection for Poshmark & Depop with Zero-Downtime remote healing
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={loadCanaryData}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            {loading ? 'Checking...' : 'Refresh Status'}
          </button>
          {errors.length > 0 && (
            <button
              onClick={handleClearErrors}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition"
            >
              Acknowledge & Clear
            </button>
          )}
        </div>
      </div>

      {/* Cloud Remote Selector Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-rose-400">Poshmark Config</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Remote Sync Active • 5 Layer Fallback Tree
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            v{selectors.find((s) => s.platform === 'poshmark')?.version || '1.0'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-blue-400">Depop Config</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Remote Sync Active • Dynamic Modal & Follow Heuristics
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            v{selectors.find((s) => s.platform === 'depop')?.version || '1.0'}
          </span>
        </div>
      </div>

      {/* Error Log Table or Empty State */}
      {isHealthy ? (
        <div className="py-6 text-center rounded-xl bg-slate-950/30 border border-slate-800/40">
          <p className="text-xs text-slate-400">
            ✨ No selector failures or login anomalies reported by active users. Both platforms running normally.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {errors.map((err) => (
            <div
              key={err.id}
              className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs space-y-1 hover:border-rose-700/50 transition cursor-pointer"
              onClick={() => setExpandedId(expandedId === err.id ? null : err.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-mono">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      err.platform === 'poshmark' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {err.platform}
                  </span>
                  <span className="text-slate-300 font-semibold">{err.action}</span>
                  <span className="text-rose-400">[{err.error_type}]</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(err.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-slate-300 truncate font-mono text-[11px]">
                {err.details || 'Selector mismatch'}
              </p>
              {expandedId === err.id && (
                <div className="pt-2 border-t border-rose-900/30 space-y-1 text-slate-400 font-mono text-[10px]">
                  <div><span className="text-slate-500">Target Selector:</span> {err.selector_attempted || 'N/A'}</div>
                  {err.page_url && <div><span className="text-slate-500">URL:</span> {err.page_url}</div>}
                  {err.user_id && <div><span className="text-slate-500">User ID:</span> {err.user_id}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
