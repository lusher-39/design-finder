import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // Test connection to Supabase by fetching the count of products
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ 
      message: 'Supabase connection successful',
      productsCount: count,
      supabaseConfigured: {
        urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    console.error('Supabase test error:', error);
    return NextResponse.json({ 
      error: error.message,
      supabaseConfigured: {
        urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }, { status: 500 });
  }
}