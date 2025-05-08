"use client";

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function SearchResults({ results: initialResults }) {
  const [results, setResults] = useState(initialResults);
  
  const handleProductUpdated = (data) => {
    // Update the results with the renamed product
    setResults(prevResults => 
      prevResults.map(product => 
        product.productName === data.oldName
          ? { ...product, productName: data.newName }
          : product
      )
    );
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((product, index) => (
          <ProductCard 
            key={`${product.productName}-${index}`} 
            product={product} 
            onProductUpdated={handleProductUpdated}
          />
        ))}
      </div>
    </div>
  );
}