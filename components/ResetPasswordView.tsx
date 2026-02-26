
import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const ResetPasswordView: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage({ text: "Password updated successfully! You can now login with your new password.", type: 'success' });
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to update password", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[3rem] shadow-2xl border border-rose-100 space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 serif italic tracking-tight">New Password</h2>
        <p className="text-slate-500 font-medium text-xs">Set a strong password for your account.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
          <input 
            type="password" required placeholder="••••••••"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-semibold text-sm"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
          <input 
            type="password" required placeholder="••••••••"
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-semibold text-sm"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {message && (
          <p className={`text-[10px] font-black uppercase tracking-widest text-center animate-pulse ${message.type === 'success' ? 'text-green-500' : 'text-rose-500'}`}>
            {message.text}
          </p>
        )}

        <button 
          type="submit" disabled={loading}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] border-b-4 border-black"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordView;
