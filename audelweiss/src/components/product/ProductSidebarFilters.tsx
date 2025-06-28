'use client';

import { useEffect, useState } from 'react';
import { fetchCategories } from '@/services/product';
import {Category} from "@/types/product";

interface ProductSidebarFiltersProps {
    onApply: (filters: {
        query: string;
        categoryId: number | null;
        minPrice: number;
        maxPrice: number;
        rating: number | null;
        isNew: boolean;
        hasDiscount: boolean;
    }) => void;
    onReset: () => void;
}


export default function ProductSidebarFilters({ onApply, onReset }: ProductSidebarFiltersProps) {
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(500);
    const [rating, setRating] = useState<number | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);

    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);


    const applyFilters = () => {
        onApply({
            query,
            categoryId: selectedCategory,
            minPrice,
            maxPrice,
            rating,
            isNew,
            hasDiscount,
        });
    };

    const resetFilters = () => {
        setQuery('');
        setSelectedCategory(null);
        setMinPrice(0);
        setMaxPrice(500);
        setRating(null);
        setIsNew(false);
        setHasDiscount(false);
        onReset();
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white space-y-6">
            <div>
                <input
                    type="text"
                    placeholder="Recherche..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                >
                    <option value="">Toutes</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Prix (€)</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-1/2 border border-gray-300 rounded px-2 py-1"
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-1/2 border border-gray-300 rounded px-2 py-1"
                        placeholder="Max"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Avis minimum</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            onClick={() => setRating(val === rating ? null : val)}
                            className={`px-2 py-1 rounded border ${
                                rating && rating >= val ? 'bg-yellow-300 border-yellow-400' : 'bg-gray-100 border-gray-300'
                            }`}
                        >
                            {val}★
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Options</label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isNew}
                            onChange={(e) => setIsNew(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm">Nouveautés uniquement</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={hasDiscount}
                            onChange={(e) => setHasDiscount(e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <span className="text-sm">En promotion uniquement</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-between gap-2 pt-2">
                <button
                    onClick={resetFilters}
                    className="w-1/2 text-sm border border-gray-300 py-2 rounded hover:bg-gray-100"
                >
                    Réinitialiser
                </button>
                <button
                    onClick={applyFilters}
                    className="btn-primary"
                >
                    Appliquer
                </button>
            </div>
        </div>
    );
}
