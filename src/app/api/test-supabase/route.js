import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // First, test if we can connect to Supabase
    console.log('Testing Supabase connection...');
    
    // Get all products to see the actual data structure
    const { data: allProducts, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error.details,
        supabaseConfigured: {
          urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        }
      }, { status: 500 });
    }
    
    // Log the actual structure
    console.log('Total products:', count);
    console.log('First product structure:', allProducts[0]);
    
    // Test a search query similar to what the search route does
    const testSearchQuery = 'Golden';
    const searchPattern = `%${testSearchQuery}%`;
    
    const { data: searchResults, error: searchError } = await supabase
      .from('products')
      .select('*')
      .or(`product_name.ilike.${searchPattern},sku_6ft.ilike.${searchPattern},sku_15ft.ilike.${searchPattern}`);
    
    console.log('Test search results:', searchResults);
    console.log('Test search error:', searchError);
    
    return NextResponse.json({ 
      success: true,
      totalProducts: count,
      firstProduct: allProducts[0],
      columns: allProducts.length > 0 ? Object.keys(allProducts[0]) : [],
      sampleProducts: allProducts.slice(0, 3),
      testSearch: {
        query: testSearchQuery,
        pattern: searchPattern,
        results: searchResults,
        error: searchError
      },
      supabaseConfigured: {
        urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      supabaseConfigured: {
        urlConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        keyConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    }, { status: 500 });
  }
}
