"use client";

import { useState } from 'react';
import RenameModal from './RenameModal';

export default function ProductCard({ product, onProductUpdated }) {
  const [showRenameModal, setShowRenameModal] = useState(false);
  
  // Get simplified 8-digit SKU
  const simplifiedSku = product.sku6ft.substring(0, 8);

  const downloadImage = () => {
    window.open(`/api/image/${encodeURIComponent(simplifiedSku)}`, '_blank');
  };
  
  const handleRenameSuccess = (data) => {
    // Call parent component's update function if provided
    if (onProductUpdated) {
      onProductUpdated(data);
    } else {
      // If no update function provided, reload the page
      window.location.reload();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md">
      <div className="p-4 bg-gray-50">
        <img 
          src={`/api/image/${encodeURIComponent(simplifiedSku)}`}
          alt={product.productName}
          className="w-full h-48 object-contain"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{product.productName}</h3>
          <button
            onClick={() => setShowRenameModal(true)}
            className="text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            title="Rename Product"
          >
            Rename
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-600">6ft SKU:</p>
            <p className="font-mono">{product.sku6ft}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">15ft SKU:</p>
            <p className="font-mono">{product.sku15ft}</p>
          </div>
        </div>
        
        <button
          onClick={downloadImage}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Download Image
        </button>
      </div>
      
      {showRenameModal && (
        <RenameModal
          product={product}
          isOpen={showRenameModal}
          onClose={() => setShowRenameModal(false)}
          onSuccess={handleRenameSuccess}
        />
      )}
    </div>
  );
}