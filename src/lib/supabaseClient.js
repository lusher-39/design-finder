import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  
  // If running in development mode, provide more helpful error
  if (process.env.NODE_ENV === 'development') {
    console.error('Please ensure you have added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file');
  } else {
    console.error('Please ensure you have added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel environment variables');
  }
}

// Create the Supabase client with fallback values for build time
// This allows the build to complete even if environment variables are missing
const supabase = createClient(
  supabaseUrl || 'https://placeholder-for-build-time.supabase.co',
  supabaseAnonKey || 'placeholder-key-for-build-time'
);

export default supabase;