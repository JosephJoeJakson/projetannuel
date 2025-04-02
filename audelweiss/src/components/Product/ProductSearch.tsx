'use client';
import { ChangeEvent } from 'react';

export default function ProductSearch({ onSearch }: { onSearch: (query: string) => void }) {
    return (
        <div className="mb-6">
            <input
                type="text"
                placeholder="Rechercher un produit..."
                onChange={(e: ChangeEvent<HTMLInputElement>) => onSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>
    );
}
