'use client';

import Link from 'next/link';
import { Product } from '@/types/product';
import { calculateFinalPrice } from '@/utils/product';
import { getStrapiMedia } from '@/utils/strapi';
import Placeholder from '../common/Placeholder';
import { useEffect, useState } from 'react';
import { fetchProductPromotions, Promotion } from '@/services/promotion';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = getStrapiMedia(product.main_picture?.url);
    const finalPrice = calculateFinalPrice(product);
    const hasDiscount = (product.discountPercentage ?? 0) > 0;
    const [promotions, setPromotions] = useState<Promotion[]>([]);

    useEffect(() => {
        const loadPromotions = async () => {
            try {
                const productPromotions = await fetchProductPromotions(product.id);
                setPromotions(productPromotions);
            } catch (error) {
                console.error('Erreur lors du chargement des promotions:', error);
            }
        };

        loadPromotions();
    }, [product.id]);

    const bestPromotion = promotions.length > 0
        ? promotions.sort((a, b) => b.priority - a.priority)[0] 
        : null;

    return (
        <Link href={`/products/${product.id}`} className="product-card">
            {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="product-card__bg" />
            ) : (
                <Placeholder className="product-card__bg" />
            )}
            
            <div className="product-card__badges">
                {bestPromotion && (
                    <div className="product-card__badge product-card__badge--promo">
                        🎉 {bestPromotion.displayMessage || `${bestPromotion.buyQuantity}+`}
                    </div>
                )}
                {hasDiscount && !bestPromotion && (
                    <div className="product-card__badge product-card__badge--promo">
                        EN PROMO !
                    </div>
                )}
                {product.isNew && (
                    <div className="product-card__badge product-card__badge--new">
                        NOUVEAUTÉ
                    </div>
                )}
            </div>

            <div className="product-card__content">
                <span className="product-card__category">
                    {product.category?.name || 'Non classé'}
                </span>
                <h3 className="product-card__title">{product.name}</h3>
                <div className="product-card__price-container">
                    {hasDiscount && (
                        <span className="product-card__original-price">
                            {product.price.toFixed(2)}€
                        </span>
                    )}
                    <span className="product-card__final-price">
                        {finalPrice.toFixed(2)}€
                    </span>
                </div>
            </div>

            <div className="product-card__actions">
                <div className="btn btn-primary btn-view">
                    Voir le produit
                </div>
            </div>
        </Link>
    );
}
