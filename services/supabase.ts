
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ghdwufjkpjuidyfsgkde.supabase.co';
const supabaseKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_XPmEBwW1eU5DEhLLlzB1-Q_aH5ktzr-';

console.log('[Supabase] Initializing client...');
console.log('[Supabase] URL:', supabaseUrl);
console.log('[Supabase] Key present:', !!supabaseKey);

if (supabaseKey && supabaseKey.startsWith('sb_publishable_')) {
  console.error('[Supabase] CRITICAL: Your SUPABASE_ANON_KEY looks like a Stripe key! Supabase keys are long JWT strings starting with "eyJ". Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const initSupabase = () => !!supabaseUrl && !!supabaseKey;
export const isCloudEnabled = () => !!supabaseUrl && !!supabaseKey;
