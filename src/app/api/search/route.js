import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  console.log('=======================================================');
  console.log('[Search API] 🔔 Enter GET handler');
  console.log('[Search API] Request object:', request);

  // Log env on startup (be careful in prod!)
  console.log('[Search API] SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('[Search API] SUPABASE_ANON_KEY present:', !!process.env.SUPABASE_ANON_KEY);

  // Parse URL
  const url = new URL(request.url);
  console.log('[Search API] Parsed URL:', url);

  const { searchParams } = url;
  console.log('[Search API] searchParams object:', searchParams);

  // Extract raw query
  const rawQuery = searchParams.get('q');
  console.log('[Search API] rawQuery (q):', rawQuery);

  // 1) Missing parameter entirely
  if (rawQuery === null) {
    console.warn('[Search API] ⚠️ Missing “q” parameter altogether');
    console.log('=======================================================');
    return NextResponse.json(
      { error: 'Missing query parameter “q”' },
      { status: 400 }
    );
  }

  // 2) Empty or whitespace-only
  const query = rawQuery.trim();
  console.log('[Search API] trimmed query:', `"${query}"`);

  if (query === '') {
    console.info('[Search API] ℹ️ Query is empty after trimming; returning no results');
    console.log('=======================================================');
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 3) Build ILIKE pattern
  const pattern = `%${query}%`;
  console.log('[Search API] ILIKE search pattern:', pattern);

  // 4) Perform Supabase query
  let data, error;
  try {
    console.log('[Search API] ▶️ Calling supabase.from("products")…');
    ({ data, error } = await supabase
      .from('products')
      .select('*')
      .or(
        `product_name.ilike.${pattern},` +
        `sku_6ft.ilike.${pattern},` +
        `sku_15ft.ilike.${pattern}`
      ));
    console.log('[Search API] ✅ Supabase query complete');
  } catch (dbErr) {
    console.error('[Search API] 🔴 Unexpected exception during Supabase query:', dbErr);
    console.log('=======================================================');
    return NextResponse.json(
      { error: 'Unexpected database exception', details: dbErr.message },
      { status: 500 }
    );
  }

  // 5) Supabase-level error
  if (error) {
    console.error('[Search API] 🔴 Supabase returned error object:', error);
    console.log('=======================================================');
    return NextResponse.json(
      { error: 'Database query failed', details: error.message },
      { status: 500 }
    );
  }

  // 6) Null/undefined data guard
  console.log('[Search API] raw data from Supabase:', data);
  if (data == null) {
    console.warn('[Search API] ⚠️ Data is null or undefined');
    console.log('=======================================================');
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 7) No rows found
  if (!Array.isArray(data) || data.length === 0) {
    console.info('[Search API] ℹ️ No rows matched pattern:', pattern);
    console.log('=======================================================');
    return NextResponse.json({ products: [] }, { status: 200 });
  }

  // 8) Transform each record
  console.log(`[Search API] 🔄 Transforming ${data.length} record(s)`);
  const products = data.map((p, i) => {
    console.log(`[Search API] → record[${i}]:`, p);
    const transformed = {
      productName: p.product_name,
      sku6ft:      p.sku_6ft,
      sku15ft:     p.sku_15ft,
      imagePath:   p.image_path
    };
    console.log(`[Search API] → transformed[${i}]:`, transformed);
    return transformed;
  });

  console.log('[Search API] 🏁 Final products array:', products);
  console.log('=======================================================');

  // 9) Return
  return NextResponse.json({ products }, { status: 200 });
}
