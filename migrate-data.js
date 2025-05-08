// migrate-fetch.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function migrateData() {
  try {
    // Read the products.json file
    const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
    console.log('Reading file from:', filePath);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(fileContent);
    
    console.log(`Found ${products.length} products in JSON file.`);
    
    // Transform data to match Supabase table structure
    const transformedProducts = products.map(product => ({
      product_name: product.productName,
      sku_6ft: product.sku6ft,
      sku_15ft: product.sku15ft,
      image_path: product.imagePath
    }));
    
    console.log('Connecting to Supabase directly via the REST API...');
    
    // Corrected URL with proper spelling
    const supabaseUrl = 'https://gnqghlnartzxlxutlpvc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducWdobG5hcnR6eGx4dXRscHZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MzYxNjEsImV4cCI6MjA2MjMxMjE2MX0.tVxV8fhJ9Y7Iaiwapl6aUhYVm4a4R1HJpk3H8cYIgV8';
    
    // Using the exact URL from your environment variables
    const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(transformedProducts)
    });
    
    const statusCode = response.status;
    console.log(`Status Code: ${statusCode}`);
    
    if (statusCode >= 200 && statusCode < 300) {
      console.log('Migration complete!');
      console.log(`${transformedProducts.length} products migrated to Supabase.`);
    } else {
      const errorText = await response.text();
      console.error('Error migrating data. Status code:', statusCode);
      console.error('Response:', errorText);
    }
  } catch (error) {
    console.error('Error migrating data:', error.message);
  }
}

// Run the migration
migrateData();