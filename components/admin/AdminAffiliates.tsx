
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storage';
import { supabase } from '../../services/supabase';
import { AffiliateRecord, AdminSettings } from '../../types';

const AdminAffiliates: React.FC = () => {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [affiliates, setAffiliates] = useState<AffiliateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ name: '', email: '', referral_code: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const s = await storageService.getAdminSettings();
      setSettings(s);

      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAffiliates(data || []);
    } catch (err) {
      console.error('Failed to load affiliates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await storageService.saveAdminSettings(settings);
      alert('Affiliate settings saved!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('affiliates')
        .insert([newAffiliate]);
      
      if (error) throw error;
      setNewAffiliate({ name: '', email: '', referral_code: '' });
      loadData();
      alert('Affiliate added!');
    } catch (err: any) {
      alert('Error adding affiliate: ' + err.message);
    }
  };

  if (loading) return <div className="p-10 text-center font-black text-slate-300 animate-pulse">LOADING AFFILIATE DATA...</div>;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Commission Settings */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 italic serif">
          <span className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">💰</span>
          Commission Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Affiliate System</label>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <input 
                type="checkbox" 
                checked={settings?.affiliate?.enabled || false}
                onChange={(e) => setSettings(prev => prev ? {
                  ...prev, 
                  affiliate: { ...prev.affiliate!, enabled: e.target.checked, defaultCommissionPercentage: prev.affiliate?.defaultCommissionPercentage || 10 }
                } : null)}
                className="w-5 h-5 accent-rose-500"
              />
              <span className="text-sm font-bold text-slate-700">Enable Referral Program</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Commission (%)</label>
            <input 
              type="number"
              value={settings?.affiliate?.defaultCommissionPercentage || 10}
              onChange={(e) => setSettings(prev => prev ? {
                ...prev,
                affiliate: { ...prev.affiliate!, defaultCommissionPercentage: parseInt(e.target.value) }
              } : null)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-rose-500 transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleSaveSettings}
          disabled={saving}
          className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Update Commission Settings'}
        </button>
      </div>

      {/* Add New Affiliate */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 italic serif">
          <span className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">👤</span>
          Add New Partner
        </h3>
        <form onSubmit={handleAddAffiliate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" placeholder="Name" required
            value={newAffiliate.name} onChange={e => setNewAffiliate({...newAffiliate, name: e.target.value})}
            className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold"
          />
          <input 
            type="email" placeholder="Email" required
            value={newAffiliate.email} onChange={e => setNewAffiliate({...newAffiliate, email: e.target.value})}
            className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold"
          />
          <input 
            type="text" placeholder="Referral Code" required
            value={newAffiliate.referral_code} onChange={e => setNewAffiliate({...newAffiliate, referral_code: e.target.value})}
            className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold"
          />
          <button type="submit" className="md:col-span-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Register Affiliate</button>
        </form>
      </div>

      {/* Affiliate List */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 italic serif">
          <span className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">📈</span>
          Partner Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                <th className="pb-4 px-2">Partner</th>
                <th className="pb-4 px-2">Code</th>
                <th className="pb-4 px-2">Earned</th>
                <th className="pb-4 px-2">Balance</th>
                <th className="pb-4 px-2">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {affiliates.map(a => (
                <tr key={a.id} className="text-sm">
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{a.name}</div>
                    <div className="text-[10px] text-slate-400">{a.email}</div>
                  </td>
                  <td className="py-4 px-2 font-mono font-bold text-rose-500">{a.referral_code}</td>
                  <td className="py-4 px-2 font-bold text-slate-900">₹{a.total_earned}</td>
                  <td className="py-4 px-2 font-bold text-emerald-600">₹{a.balance}</td>
                  <td className="py-4 px-2">
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}/?ref=${a.referral_code}`;
                        navigator.clipboard.writeText(link);
                        alert('Link copied!');
                      }}
                      className="text-[9px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      Copy Link
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAffiliates;
