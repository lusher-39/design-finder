import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }
    
    // Convert query to lowercase for case-insensitive searching
    const normalizedQuery = query.toLowerCase().trim();
    
    // Create the search pattern
    const searchPattern = `%${normalizedQuery}%`;
    
    // Search in Supabase using separate OR conditions
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`product_name.ilike.${searchPattern},sku_6ft.ilike.${searchPattern},sku_15ft.ilike.${searchPattern}`);
    
    if (error) {
      throw error;
    }
    
    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => ({
      productName: product.product_name,
      sku6ft: product.sku_6ft,
      sku15ft: product.sku_15ft,
      imagePath: product.image_path
    }));
    
    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
