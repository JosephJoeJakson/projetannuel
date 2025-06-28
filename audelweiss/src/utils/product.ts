import { Product, ProductVariationCombination } from '@/types/product';

export function calculateFinalPrice(product: Product, variation?: ProductVariationCombination): number {
    const basePrice = variation ? variation.price : product.price;
    const discountPercentage = product.discountPercentage || 0;
    
    if (discountPercentage > 0) {
        return basePrice * (1 - discountPercentage / 100);
    }
    
    return basePrice;
}

export function hasActiveDiscount(product: Product): boolean {
    return (product.discountPercentage || 0) > 0;
}

export function getPriceRange(product: Product): { min: number; max: number; hasVariations: boolean } {
    if (!product.variationCombinations || product.variationCombinations.length === 0) {
        const finalPrice = calculateFinalPrice(product);
        return { min: finalPrice, max: finalPrice, hasVariations: false };
    }

    const prices = product.variationCombinations.map(variation => {
        return calculateFinalPrice(product, variation);
    });

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
        min: minPrice,
        max: maxPrice,
        hasVariations: minPrice !== maxPrice
    };
} 