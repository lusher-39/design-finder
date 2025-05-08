"use client";

import { useState } from 'react';
import RenameModal from './RenameModal';

export default function RenameProductForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a product name or SKU');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      setSearchResults(data.products);
      
      if (data.products.length === 0) {
        setError('No products found. Try another search term.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowRenameModal(true);
  };
  
  const handleRenameSuccess = (data) => {
    // Update the search results with the renamed product
    setSearchResults(prevResults => 
      prevResults.map(product => 
        product.productName === data.oldName
          ? { ...product, productName: data.newName }
          : product
      )
    );
    
    // Clear the selected product
    setSelectedProduct(null);
    
    // Show a success message (you could add a state for this)
    alert(`Successfully renamed "${data.oldName}" to "${data.newName}"`);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter product name or SKU to rename..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button 
            type="submit" 
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Find Product to Rename'}
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}
      </form>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-3">Select a product to rename:</h3>
          <div className="space-y-2">
            {searchResults.map((product, index) => (
              <div 
                key={index} 
                className="border p-3 rounded hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => handleSelectProduct(product)}
              >
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-gray-600">SKU: {product.sku6ft}</p>
                </div>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Rename
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Rename Modal */}
      {selectedProduct && showRenameModal && (
        <RenameModal
          product={selectedProduct}
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          onSuccess={handleRenameSuccess}
        />
      )}
    </div>
  );
}