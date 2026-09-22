import React, { useState } from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { signIn } from '../lib/supabase';

interface LoginProps {
  onSignedIn: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSignedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const res = await signIn(email.trim(), password);
    setIsSubmitting(false);
    if (res.success) {
      onSignedIn();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 p-0.5 shadow-lg shadow-brand-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-400" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-white">ResellBoost Admin</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" /> Sign in to manage users, licenses and telemetry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-2xl border p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-xl text-xs flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-300">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-600/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            No account yet? Create one in your Supabase Dashboard under
            Authentication → Users, or run <code className="text-slate-400">supabase.auth.admin.createUser</code>.
          </p>
        </form>
      </div>
    </div>
  );
};
