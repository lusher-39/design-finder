import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  // Parse incoming URL and q-param
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('q');
  console.log('[Search API] raw “q”:', rawQuery);

  // 1) Missing parameter
  if (rawQuery === null) {
    console.warn('[Search API] “q” parameter is missing altogether');
    return NextResponse.json(
      { error: 'Missing query parameter “q”' },
      { status: 400 }
    );
  }

  // 2) Empty or whitespace only
  const query = rawQuery.trim();
  if (!query) {
    console.info('[Search API] “q” was empty after trimming; returning no results');
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 3) Build your ILIKE pattern
  const pattern = `%${query}%`;
  console.log('[Search API] ILIKE pattern:', pattern);

  // 4) Run the Supabase query inside its own try/catch so we can distinguish
  let data, error;
  try {
    ({ data, error } = await supabase
      .from('products')
      .select('*')
      // note: no spaces inside the .or string
      .or(`product_name.ilike.${pattern},sku_6ft.ilike.${pattern},sku_15ft.ilike.${pattern}`));
  } catch (err) {
    console.error('[Search API] Unexpected exception when querying Supabase:', err);
    return NextResponse.json(
      { error: 'Unexpected database error', details: err.message },
      { status: 500 }
    );
  }

  // 5) Handle Supabase-level errors
  if (error) {
    console.error('[Search API] Supabase returned an error object:', error);
    return NextResponse.json(
      { error: 'Database query failed', details: error.message },
      { status: 500 }
    );
  }

  // 6) Null/undefined data guard
  if (!data) {
    console.warn('[Search API] Supabase “data” is null or undefined');
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 7) No rows found
  if (data.length === 0) {
    console.info('[Search API] No matching products for query:', query);
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 8) Transform and log each record
  const products = data.map((p, i) => {
    console.log(`[Search API] record #${i}`, p);
    return {
      productName: p.product_name,
      sku6ft:        p.sku_6ft,
      sku15ft:       p.sku_15ft,
      imagePath:     p.image_path
    };
  });
  console.log('[Search API] Returning products array of length:', products.length);

  return NextResponse.json({ products }, { status: 200 });
}
