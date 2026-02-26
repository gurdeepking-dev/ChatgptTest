
import React, { useState, useEffect } from 'react';
import { User, TransactionRecord } from '../types';
import { storageService } from '../services/storage';
import AffiliateDashboard from './AffiliateDashboard';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'affiliate'>('profile');

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const allTx = await storageService.getTransactions();
      const userTx = allTx.filter(tx => tx.user_email === user.email);
      setTransactions(userTx);
    } catch (err) {
      console.error('Failed to load user data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-2xl border border-rose-100">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center text-3xl font-black serif italic shadow-xl border-4 border-white ring-4 ring-rose-50">
            {user.full_name ? user.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight serif italic">{user.full_name || 'Art Explorer'}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-rose-50 px-8 py-4 rounded-3xl border border-rose-100 text-center">
            <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Available Credits</p>
            <p className="text-2xl font-black text-rose-600 serif italic">{user.credits}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-rose-50'}`}
        >
          👤 My Profile
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-rose-50'}`}
        >
          🛍️ Order History
        </button>
        <button 
          onClick={() => setActiveTab('affiliate')}
          className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'affiliate' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 hover:bg-rose-50'}`}
        >
          🤝 Partner Program
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl border border-rose-50 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 serif italic">Account Details</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                  <p className="font-bold text-slate-800">{user.full_name || 'Not set'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                  <p className="font-bold text-slate-800">{user.email}</p>
                </div>
              </div>
              <div className="h-px bg-rose-50" />
              <div className="space-y-4">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Security</p>
                <button 
                  onClick={() => alert('Password reset link will be sent to your email.')}
                  className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-rose-50 overflow-hidden">
            <div className="p-8 border-b border-rose-50">
              <h3 className="text-2xl font-black text-slate-900 serif italic">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Items</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-50">
                  {transactions.map(tx => (
                    <tr key={tx.razorpay_payment_id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-slate-900">{new Date(tx.created_at || Date.now()).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-xs font-bold text-slate-600 truncate max-w-xs">{tx.items.join(', ')}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900">₹{tx.amount}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tx.status === 'captured' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">No transactions found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'affiliate' && <AffiliateDashboard user={user} />}
      </div>
    </div>
  );
};

export default UserDashboard;
