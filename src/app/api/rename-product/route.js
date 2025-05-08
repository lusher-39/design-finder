import { NextResponse } from 'next/server';
import supabase from '../../../lib/supabaseClient';

// Shopify API configuration - only use environment variables, no hardcoded credentials
const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY;
const SHOPIFY_API_PASSWORD = process.env.SHOPIFY_API_PASSWORD;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;

export async function POST(request) {
  try {
    const { oldName, newName } = await request.json();
    
    if (!oldName || !newName) {
      return NextResponse.json({ error: 'Old name and new name are required' }, { status: 400 });
    }
    
    // 1. Find the product in Supabase
    const { data: products, error: findError } = await supabase
      .from('products')
      .select('*')
      .eq('product_name', oldName)
      .limit(1);
    
    if (findError) {
      throw findError;
    }
    
    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const product = products[0];
    
    // 2. Update the product name in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({ product_name: newName })
      .eq('id', product.id);
    
    if (updateError) {
      throw updateError;
    }
    
    // 3. Update the product in Shopify (if available)
    let shopifyResult = { success: false, message: 'Shopify update skipped - no product ID' };
    
    const productId = findShopifyIdForProduct(product);
    
    if (productId && SHOPIFY_API_KEY && SHOPIFY_API_PASSWORD && SHOPIFY_STORE) {
      shopifyResult = await updateShopifyProduct(productId, newName);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product renamed successfully',
      oldName,
      newName,
      updatedInShopify: shopifyResult.success,
      shopifyMessage: shopifyResult.message
    });
    
  } catch (error) {
    console.error('Error renaming product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to find Shopify product ID based on SKUs
function findShopifyIdForProduct(product) {
  // This would need to be implemented based on how you map SKUs to Shopify IDs
  // For example, you might need to search Shopify for products with matching SKU
  return null; // Placeholder
}

// Helper function to update the product in Shopify
async function updateShopifyProduct(productId, newName) {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-07/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_API_PASSWORD
      },
      body: JSON.stringify({
        product: {
          id: productId,
          title: newName
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shopify API error: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return { success: true, message: 'Updated in Shopify', data };
  } catch (error) {
    console.error('Error updating Shopify product:', error);
    return { success: false, message: error.message };
  }
}