import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Initialization - URL Present:", !!supabaseUrl);
console.log("Supabase Initialization - Key Present:", !!supabaseAnonKey);
console.log("Supabase Initialization - URL Length:", supabaseUrl?.length);
console.log("Supabase Initialization - Key Length:", supabaseAnonKey?.length);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
