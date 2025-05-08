"use client";

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RenameProductForm from '../components/RenameProductForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Design Finder</h1>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Search Products</h2>
          <p className="mb-6 text-gray-600">
            Find product designs by name or SKU
          </p>
          <SearchForm />
        </div>
        
        {/* Rename Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-yellow-600">Rename Products</h2>
          <p className="mb-6 text-gray-600">
            Change the name of existing products
          </p>
          <RenameProductForm />
        </div>
      </div>
    </main>
  );
}