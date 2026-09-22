import React, { useState } from 'react';
import { Key, Copy, Check, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { getStoredConfig, getAccessToken } from '../lib/supabase';

export const LicenseManager: React.FC = () => {
  const [keyPrefix, setKeyPrefix] = useState<'RB-PRO' | 'VIP' | 'RESELLBOOST'>('RB-PRO');
  const [durationDays, setDurationDays] = useState(30);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedKey(null);
    setIsCopied(false);

    try {
      const { url: supabaseUrl } = getStoredConfig();
      const token = await getAccessToken();
      if (!supabaseUrl || !token) {
        setError('You must be signed in and connected to Supabase to issue license keys.');
        return;
      }

      const resp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/issue-license-key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prefix: keyPrefix, durationDays }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        setError(data.message || 'Could not issue key.');
        return;
      }
      setGeneratedKey(data.key);
    } catch (err: any) {
      setError(err.message || 'Could not reach the license server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border">
      <div className="flex items-center space-x-2.5 mb-4">
        <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-white">VIP / Pro License Key Generator</h3>
          <p className="text-xs text-slate-400">
            Issues a real, server-tracked key the extension can actually redeem (once) via redeem-license-key.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mt-4">

        {/* Prefix selection */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Key Type / Prefix
          </label>
          <select
            value={keyPrefix}
            onChange={(e) => setKeyPrefix(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="RB-PRO">RB-PRO- (Standard Pro License)</option>
            <option value="VIP">VIP- (VIP Influencer Key)</option>
            <option value="RESELLBOOST">RESELLBOOST- (Custom Brand Key)</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            Duration (days)
          </label>
          <input
            type="number"
            min={1}
            max={3650}
            value={durationDays}
            onChange={(e) => setDurationDays(Math.max(1, Math.min(3650, parseInt(e.target.value, 10) || 30)))}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs shadow-lg shadow-brand-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Issuing...' : 'Generate New Pro Key'}</span>
          </button>
        </div>

      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Result Box */}
      {generatedKey && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Active Pro License Key:
              </span>
              <span className="font-mono text-base font-bold text-amber-300 tracking-wider">
                {generatedKey}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
