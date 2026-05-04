import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
const MAX_RETRIES = 3;
let initRetries = 0;

export function getSupabase(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (initRetries < MAX_RETRIES) {
      initRetries++;
      console.warn('[Supabase] Missing env vars, using fallback client');
    }
    
    // Create a fallback client for build time
    return createClient(
      'https://dummy.supabase.co',
      'dummy-key',
      { auth: { persistSession: false } }
    );
  }

  supabaseInstance = createClient(url, key, {
    auth: { persistSession: false },
  });

  return supabaseInstance;
}

// Initialize Supabase for client-side use with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'ibd-medical-system/1.0.0',
    },
  },
});

export { SupabaseClient } from '@supabase/supabase-js';
