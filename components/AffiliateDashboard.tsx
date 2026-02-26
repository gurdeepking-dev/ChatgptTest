
import React, { useState, useEffect } from 'react';
import { User, AffiliateRecord, CommissionRecord } from '../types';
import { storageService } from '../services/storage';

interface AffiliateDashboardProps {
  user: User;
}

const AffiliateDashboard: React.FC<AffiliateDashboardProps> = ({ user }) => {
  const [affiliate, setAffiliate] = useState<AffiliateRecord | null>(null);
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadAffiliateData();
  }, [user]);

  const loadAffiliateData = async () => {
    setLoading(true);
    try {
      const aff = await storageService.getAffiliateByUserId(user.id);
      if (aff) {
        setAffiliate(aff);
        const comms = await storageService.getAffiliateCommissions(aff.id);
        setCommissions(comms);
      }
    } catch (err) {
      console.error('Failed to load affiliate data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const aff = await storageService.registerAffiliate(user.id, user.full_name || user.email.split('@')[0], user.email);
      setAffiliate(aff);
      alert('Welcome to the Partner Program! Your referral link is ready.');
    } catch (err) {
      alert('Failed to join program. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!affiliate) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-10 bg-white rounded-[3rem] shadow-2xl border border-rose-100 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto text-5xl shadow-inner">🤝</div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900 serif italic tracking-tighter">Join Our <span className="text-rose-500">Partner</span> Program</h2>
          <p className="text-slate-500 font-bold leading-relaxed uppercase tracking-wide text-sm">
            Promote our AI Art Studio and earn real money for every sale you refer! 
            Share your unique link on your stories, bio, or with friends.
          </p>
        </div>
        
        <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Get your unique referral link</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Share it on Social Media</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">3</span>
            <p className="text-xs font-black text-slate-700 uppercase tracking-widest">Earn commission on every purchase</p>
          </div>
        </div>

        <button 
          onClick={handleJoin}
          disabled={joining}
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
        >
          {joining ? 'Activating...' : 'Activate My Partner Link ✨'}
        </button>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/?ref=${affiliate.referral_code}`;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-rose-50 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Balance</p>
          <p className="text-4xl font-black text-emerald-600 serif italic">₹{affiliate.balance}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-rose-50 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Earned</p>
          <p className="text-4xl font-black text-slate-900 serif italic">₹{affiliate.total_earned}</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-rose-50 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Sales</p>
          <p className="text-4xl font-black text-rose-500 serif italic">{commissions.length}</p>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-2xl font-black serif italic">Your Promotion Link</h3>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Copy this link and share it on your Instagram Story, Bio, or with friends!</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl font-mono text-sm truncate flex items-center">
              {referralLink}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                alert('Link copied to clipboard!');
              }}
              className="px-10 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 shadow-lg"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Sales History */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-rose-50 overflow-hidden">
        <div className="p-8 border-b border-rose-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 serif italic">Recent Earnings</h3>
          <span className="px-4 py-1.5 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest">Live Updates</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Commission</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {commissions.map(c => (
                <tr key={c.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900">{new Date(c.created_at!).toLocaleDateString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(c.created_at!).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-lg font-black text-emerald-600 serif italic">₹{c.amount}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{c.percentage}% Commission</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="space-y-3">
                      <p className="text-4xl">🚀</p>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No sales yet. Start sharing your link to earn!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Info */}
      <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-black text-rose-900 serif italic">How to withdraw?</h4>
          <p className="text-xs font-bold text-rose-700/70 uppercase tracking-wide">Withdrawals are processed manually via UPI or Bank Transfer.</p>
        </div>
        <button 
          onClick={() => alert('Please contact support with your registered email to request a payout.')}
          className="px-8 py-4 bg-white text-rose-600 border-2 border-rose-200 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
        >
          Request Payout
        </button>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
