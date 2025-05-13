import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('q');
    console.log('[Search API] rawQuery:', rawQuery);

    if (rawQuery === null) {
      return NextResponse.json({ error: 'Missing query parameter “q”' }, { status: 400 });
    }

    const query = rawQuery.trim();
    if (!query) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Build a “fuzzy” ILIKE pattern so spaces don’t block matching
    const fuzzyPattern = `%${query.split(/\s+/).join('%')}%`;
    console.log('[Search API] fuzzyPattern:', fuzzyPattern);

    // Run the search + limit to 5
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(
        `product_name.ilike.${fuzzyPattern},` +
        `sku_6ft.ilike.${fuzzyPattern},` +
        `sku_15ft.ilike.${fuzzyPattern}`
      )
      .limit(5);

    if (error) {
      console.error('[Search API] db error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.info('[Search API] no matches found');
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    // Transform to frontend shape
    const products = data.map(p => ({
      productName: p.product_name,
      sku6ft:      p.sku_6ft,
      sku15ft:     p.sku_15ft,
      imagePath:   p.image_path
    }));

    console.log('[Search API] returning', products.length, 'product(s)');
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error('[Search API] unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
