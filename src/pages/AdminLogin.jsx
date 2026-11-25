import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { setAdminAuth } from '../utils/storage';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Demo credentials: Username: admin, Password: Admin@123
    if (username.trim() === 'admin' && password === 'Admin@123') {
      setAdminAuth(true);
      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin');
    } else {
      setError('Invalid username or password. Please use the demo credentials below.');
    }
  };

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-purple-100 p-8 text-left relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400"></div>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Admin Portal</h2>
            <p className="text-xs text-slate-500">Guest Management & Seating Control</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo credentials box with 1-click autofill */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-100 text-xs text-purple-900">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-purple-700 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" /> Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleAutofill}
                className="text-[11px] font-bold text-pink-600 hover:text-pink-800 underline decoration-pink-300"
              >
                1-Click Auto Fill
              </button>
            </div>
            <div className="space-y-1 font-mono text-[11px] bg-white/70 p-2 rounded-lg border border-purple-100/60">
              <div>Username: <strong className="text-purple-800">admin</strong></div>
              <div>Password: <strong className="text-purple-800">Admin@123</strong></div>
            </div>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
            >
              ← Back to Public Birthday Invitation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
