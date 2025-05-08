"use client";

import { useState } from 'react';
import SearchResults from './SearchResults';

export default function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [productInfo, setProductInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a product name or SKU');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      setResults(data.products);
      
      // Clear previous product info
      setProductInfo(null);
      
      if (data.products.length === 0) {
        setError('No products found. Try another search term.');
      } else {
        // Check if search was a SKU or product name
        const product = data.products[0];
        const searchTerm = query.toLowerCase().trim();
        
        // If user searched for SKU, show product name
        if (product.sku6ft && product.sku6ft.toLowerCase() === searchTerm) {
          setProductInfo({
            message: `SKU ${product.sku6ft} belongs to: ${product.productName}`
          });
        } 
        else if (product.sku15ft && product.sku15ft.toLowerCase() === searchTerm) {
          setProductInfo({
            message: `SKU ${product.sku15ft} belongs to: ${product.productName}`
          });
        }
        // If user searched for product name, show SKUs
        else if (product.productName.toLowerCase().includes(searchTerm)) {
          setProductInfo({
            message: `${product.productName} SKUs: 6ft: ${product.sku6ft} / 15ft: ${product.sku15ft}`
          });
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter product name or SKU..."
            className="flex-grow p-2 border border-gray-300 rounded"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
        
        {productInfo && (
          <div className="mt-4 p-4 rounded-lg bg-blue-600 text-white">
            <p className="font-medium">{productInfo.message}</p>
          </div>
        )}
      </form>
      
      {results.length > 0 && (
        <SearchResults results={results} />
      )}
    </div>
  );
}
