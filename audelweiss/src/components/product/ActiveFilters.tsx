'use client';

interface ActiveFiltersProps {
    query: string;
    category: { id: number; name: string } | null;
    minPrice: number;
    maxPrice: number;
    rating: number | null;
    isNew: boolean;
    hasDiscount: boolean;
    onRemove: (type: string) => void;
}

export default function ActiveFilters({ query, category, minPrice, maxPrice, rating, isNew, hasDiscount, onRemove }: ActiveFiltersProps) {
    const hasPrice = minPrice > 0 || maxPrice < 500;

    if (!query && !category && !hasPrice && !rating && !isNew && !hasDiscount) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {query && (
                <Badge label={`Recherche: "${query}"`} onRemove={() => onRemove('query')} />
            )}
            {category && (
                <Badge label={`Catégorie: ${category.name}`} onRemove={() => onRemove('category')} />
            )}
            {hasPrice && (
                <Badge label={`Prix: ${minPrice}€ - ${maxPrice}€`} onRemove={() => onRemove('price')} />
            )}
            {rating && (
                <Badge label={`Avis ≥ ${rating}★`} onRemove={() => onRemove('rating')} />
            )}
            {isNew && (
                <Badge label="Nouveautés uniquement" onRemove={() => onRemove('isNew')} />
            )}
            {hasDiscount && (
                <Badge label="En promotion uniquement" onRemove={() => onRemove('hasDiscount')} />
            )}
        </div>
    );
}

function Badge({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <div className="flex items-center bg-gray-200 text-sm px-3 py-1 rounded-full">
            {label}
            <button
                onClick={onRemove}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Retirer"
            >
                ✕
            </button>
        </div>
    );
}
