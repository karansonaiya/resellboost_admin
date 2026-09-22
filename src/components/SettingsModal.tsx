import React, { useState } from 'react';
import { X, Database, CheckCircle, AlertCircle, ExternalLink, Key, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { SupabaseConfig, testConnection, saveStoredConfig, resetClient, clearAllTelemetryData } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onConfigUpdated: (newConfig: SupabaseConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
}) => {
  const [url, setUrl] = useState(config.url);
  const [anonKey, setAnonKey] = useState(config.anonKey);
  const [isDemoMode, setIsDemoMode] = useState(config.isDemoMode);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [clearMessage, setClearMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const SUPABASE_URL_PATTERN = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;
  // Supabase anon keys are either a JWT (three base64url segments) or the
  // newer "sb_publishable_..." format - reject anything that's obviously
  // neither before ever sending it anywhere.
  const ANON_KEY_PATTERN = /^(sb_publishable_[A-Za-z0-9_-]{16,}|[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/;

  const validateCredentials = (): string | null => {
    if (!url.trim() || !anonKey.trim()) {
      return 'Please provide both Supabase URL and Anon Key.';
    }
    if (!SUPABASE_URL_PATTERN.test(url.trim())) {
      return 'That doesn\'t look like a Supabase project URL (expected https://your-project-id.supabase.co).';
    }
    if (!ANON_KEY_PATTERN.test(anonKey.trim())) {
      return 'That doesn\'t look like a valid Supabase anon key.';
    }
    return null;
  };

  const handleTestConnection = async () => {
    const validationError = validateCredentials();
    if (validationError) {
      setTestResult({ success: false, message: validationError });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    const result = await testConnection(url.trim(), anonKey.trim());
    setIsTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    if (!isDemoMode) {
      const validationError = validateCredentials();
      if (validationError) {
        setTestResult({ success: false, message: validationError });
        return;
      }
    }

    const updated: SupabaseConfig = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      isDemoMode,
    };
    saveStoredConfig(updated);
    resetClient();
    onConfigUpdated(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Database & Supabase Connection</h3>
              <p className="text-xs text-slate-400">Configure cloud telemetry sync settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Mode Switch Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="font-semibold text-sm text-white block">Demo Mode with Sample Data</span>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable to test and preview all charts, active users, and filters without Supabase keys.
              </p>
            </div>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              role="switch"
              aria-checked={isDemoMode}
              aria-pressed={isDemoMode}
              aria-label="Toggle demo mode"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDemoMode ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDemoMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Supabase URL Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project-id.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Supabase Anon Public Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div
              className={`p-3 rounded-xl flex items-center space-x-2.5 text-xs ${
                testResult.success
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Quick Setup Hint */}
          <div className="p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20 text-slate-300 text-xs space-y-1">
            <div className="font-semibold text-brand-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How to setup Supabase in 2 minutes:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              1. Create a free project at <span className="text-white">supabase.com</span><br />
              2. Open <b>SQL Editor</b>, paste the script from <code className="text-brand-300">supabase_schema.sql</code>, and click <b>Run</b>.<br />
              3. Copy Project URL and Anon Key from <b>Project Settings → API</b> and paste them above!
            </p>
          </div>

          {/* Wipe Test Data / Reset Data */}
          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-rose-300 flex items-center space-x-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wipe All Telemetry / Test Data</span>
              </span>
              <button
                type="button"
                disabled={isClearing}
                onClick={async () => {
                  if (confirm('Are you sure you want to delete all telemetry user records from Supabase? This will clear any testing data.')) {
                    setIsClearing(true);
                    setClearMessage(null);
                    const res = await clearAllTelemetryData();
                    setIsClearing(false);
                    setClearMessage(res.message);
                    if (res.success) {
                      onConfigUpdated({ url, anonKey, isDemoMode });
                    }
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-semibold transition-colors disabled:opacity-50"
              >
                {isClearing ? 'Clearing...' : 'Clear All Test Users'}
              </button>
            </div>
            {clearMessage && (
              <p className="text-[11px] text-rose-400 mt-1">{clearMessage}</p>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/20"
            >
              Save Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
