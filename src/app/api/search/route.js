import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  console.log('[Search API] 🔔 Enter GET handler (first-5 mode)');

  try {
    // Fetch the first 5 rows from your products table
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      // you can optionally .order('id', { ascending: true }) here
      .limit(5);

    if (error) {
      console.error('[Search API] 🔴 Database error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!products) {
      console.warn('[Search API] ⚠️ Received null/undefined products array');
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    console.log(`[Search API] ✅ Returning ${products.length} product(s)`);
    return NextResponse.json({ products }, { status: 200 });

  } catch (err) {
    console.error('[Search API] 🔥 Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
