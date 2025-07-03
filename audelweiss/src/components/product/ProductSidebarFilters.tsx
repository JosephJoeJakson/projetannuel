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
    className?: string;
}


export default function ProductSidebarFilters({ onApply, onReset, className }: ProductSidebarFiltersProps) {
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
        <aside className={`product-sidebar ${className || ''}`}>
            <div className="product-sidebar__section">
                <input
                    type="text"
                    placeholder="Recherche..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="product-sidebar__input"
                />
            </div>

            <div className="product-sidebar__section">
                <h3 className="product-sidebar__title">Catégorie</h3>
                <select
                    className="product-sidebar__select"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
                >
                    <option value="">Toutes</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="product-sidebar__section">
                <h3 className="product-sidebar__title">Prix (€)</h3>
                <div className="product-sidebar__price-inputs">
                    <input
                        type="number"
                        min={0}
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="product-sidebar__input"
                        placeholder="Min"
                    />
                    <input
                        type="number"
                        min={0}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="product-sidebar__input"
                        placeholder="Max"
                    />
                </div>
            </div>

            <div className="product-sidebar__section">
                <h3 className="product-sidebar__title">Avis minimum</h3>
                <div className="product-sidebar__rating-group">
                    {[1, 2, 3, 4, 5].map((val) => (
                        <button
                            key={val}
                            onClick={() => setRating(val === rating ? null : val)}
                            className={`product-sidebar__rating-btn ${rating === val ? 'active' : ''}`}
                        >
                            {val}★
                        </button>
                    ))}
                </div>
            </div>

            <div className="product-sidebar__section">
                <h3 className="product-sidebar__title">Options</h3>
                <div className="product-sidebar__checkbox-group">
                    <label className="product-sidebar__checkbox-label">
                        <input
                            type="checkbox"
                            checked={isNew}
                            onChange={(e) => setIsNew(e.target.checked)}
                            className="product-sidebar__checkbox"
                        />
                        <span>Nouveautés uniquement</span>
                    </label>
                    <label className="product-sidebar__checkbox-label">
                        <input
                            type="checkbox"
                            checked={hasDiscount}
                            onChange={(e) => setHasDiscount(e.target.checked)}
                            className="product-sidebar__checkbox"
                        />
                        <span>En promotion uniquement</span>
                    </label>
                </div>
            </div>

            <div className="product-sidebar__actions">
                <button
                    onClick={resetFilters}
                    className="btn btn-secondary btn-reset"
                >
                    Réinitialiser
                </button>
                <button
                    onClick={applyFilters}
                    className="btn btn-primary btn-apply"
                >
                    Appliquer
                </button>
            </div>
        </aside>
    );
}
