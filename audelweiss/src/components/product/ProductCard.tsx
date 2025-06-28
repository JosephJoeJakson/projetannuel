'use client';

import { Product } from '@/types/product';
import Link from 'next/link';
import { getPriceRange } from '@/utils/product';

export default function ProductCard({ product }: { product: Product }) {
    const image = product.main_picture;
    const imageUrl = image ? `http://localhost:3090${image.url}` : '';
    const hasDiscount = (product.discountPercentage || 0) > 0;
    const priceRange = getPriceRange(product);

    return (
        <div className="card relative">
            <div className="absolute top-2 left-2 space-y-1 z-10">
                {product.isNew && (
                    <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                        Nouveau
                    </span>
                )}
                {hasDiscount && (
                    <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">
                        -{product.discountPercentage}%
                    </span>
                )}
            </div>

            <div className="card__body">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={image?.alternativeText || ''}
                        className="card__image"
                    />
                )}

                <h3 className="h3 card__title">{product.name}</h3>

                <p className="card__description">{product.shortDescription}</p>

                <div className="card__price">
                    {hasDiscount ? (
                        <div className="text-red-600 font-bold">
                            {priceRange.hasVariations ? (
                                <>
                                    {priceRange.min.toFixed(2)}€ - {priceRange.max.toFixed(2)}€
                                    <span className="line-through text-gray-500 ml-2">
                                        {product.price.toFixed(2)}€
                                    </span>
                                </>
                            ) : (
                                <>
                                    {priceRange.min.toFixed(2)}€
                                    <span className="line-through text-gray-500 ml-2">
                                        {product.price.toFixed(2)}€
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="font-bold">
                            {priceRange.hasVariations ? (
                                `${priceRange.min.toFixed(2)}€ - ${priceRange.max.toFixed(2)}€`
                            ) : (
                                `${priceRange.min.toFixed(2)}€`
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="card__footer">
                <Link href={`/products/${product.id}`}>
                    <button className="btn-secondary w-full">Voir le produit</button>
                </Link>
            </div>
        </div>
    );
}
