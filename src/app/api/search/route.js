import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    console.log('Search query received:', query);
    
    if (!query) {
      return NextResponse.json({ products: [] });
    }
    
    // Don't convert to lowercase - keep original case for better matching
    const searchQuery = query.trim();
    
    // Create the search pattern for partial matching
    const searchPattern = `%${searchQuery}%`;
    
    console.log('Search pattern:', searchPattern);
    
    // Search in Supabase using ilike for case-insensitive search
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .or(`product_name.ilike.${searchPattern},sku_6ft.ilike.${searchPattern},sku_15ft.ilike.${searchPattern}`);
    
    console.log('Supabase query result - products:', products);
    console.log('Supabase query result - error:', error);
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    // Log the raw data to check structure
    console.log('Raw products from database:', products);
    
    // Transform data to match frontend expectations
    const transformedProducts = products.map(product => {
      console.log('Transforming product:', product);
      return {
        productName: product.product_name,
        sku6ft: product.sku_6ft,
        sku15ft: product.sku_15ft,
        imagePath: product.image_path
      };
    });
    
    console.log('Transformed products:', transformedProducts);
    
    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.details || 'No additional details available'
    }, { status: 500 });
  }
}
