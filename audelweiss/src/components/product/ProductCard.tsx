'use client';

import { Product } from '@/types/product';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
    const image = product.main_picture;
    const imageUrl = image ? `http://localhost:3090${image.url}` : '';

    return (
        <div className="card">
            <div className="card__body">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={image.alternativeText || ''}
                        className="card__image"
                    />
                )}
                <h3 className="h3 card__title">{product.name}</h3>
                <p className="card__description">{product.shortDescription}</p>
                <p className="card__price">{product.price} €</p>
            </div>

            <div className="card__footer">
                <Link href={`/products/${product.id}`}>
                    <button className="btn-secondary w-full">Voir le produit</button>
                </Link>
            </div>
        </div>
    );
}
