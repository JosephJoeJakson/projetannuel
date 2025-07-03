'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import { Product, ProductVariationCombination } from '@/types/product';
import VariationSelector from '@/components/product/VariationSelector';
import { useCartStore } from '@/stores/cart';
import ProductDetailsSection from '@/components/product/ProductDetailsSection';
import ProductReviewsSection from '@/components/product/ProductReviewsSection'
import { fetchRelatedProducts} from "@/services/product";
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductQuantitySelector from '@/components/product/ProductQuantitySelector';
import { calculateFinalPrice, hasActiveDiscount } from '@/utils/product';
import { getStrapiMedia } from '@/utils/strapi';
import Placeholder from '../common/Placeholder';

interface ProductViewProps {
    product: Product;
    allImages: any[];
}

export default function ProductView({ product, allImages }: ProductViewProps) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState(allImages[0]);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariationCombination | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { getQuantity } = useCartStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const hasVariations = product.variationCombinations.length > 0;
    const maxStock = selectedVariation ? selectedVariation.stock : 999;
    const isAddToCartDisabled = hasVariations && !selectedVariation;

    const handleAddedToCart = () => {
        setSelectedVariation(null);
        setQuantity(1);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 1500);
    };

    const displayPrice = selectedVariation ? selectedVariation.price : product.price;
    const isInCart = getQuantity(product.id, selectedVariation?.id) > 0;

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (product.id && product.category?.id) {
            fetchRelatedProducts(product.id, product.category.id).then(setRelatedProducts);
        }
    }, [product.id, product.category?.id]);

    if (!isHydrated) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-96 bg-gray-200 rounded"></div>
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="text-secondary hover:underline mb-4">
                ← Retour à la liste des produits
            </Link>

            <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
                <div>
                    {selectedImage ? (
                        <img
                            src={getStrapiMedia(selectedImage.formats?.large?.url || selectedImage.url)!}
                            alt={selectedImage.alternativeText || product.name}
                            className="w-full rounded-lg shadow mb-4 transition-all duration-300"
                        />
                    ) : (
                        <Placeholder className="w-full aspect-square rounded-lg shadow mb-4" />
                    )}

                    {product.main_picture_description && (
                        <p className="text-sm text-gray-600 italic mb-2">
                            {product.main_picture_description}
                        </p>
                    )}

                    {allImages.length > 1 && (
                        <div className="flex gap-2 mt-2">
                            {allImages.map((img) => {
                                if (!img) return null;
                                const thumbUrl = getStrapiMedia(img.formats?.thumbnail?.url || img.url);
                                if (!thumbUrl) return null;

                                return (
                                    <img
                                        key={img.id}
                                        src={thumbUrl}
                                        alt={img.alternativeText || ''}
                                        className={`rounded shadow object-cover h-20 w-20 cursor-pointer border-2 ${
                                            selectedImage?.id === img.id
                                                ? 'border-primary'
                                                : 'border-transparent'
                                        }`}
                                        onClick={() => setSelectedImage(img)}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                        {product.name}
                        {product.isNew && (
                            <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Nouveau
                        </span>
                        )}
                        {hasActiveDiscount(product) && (
                            <span className="inline-block bg-red-600 text-white text-xs px-2 py-1 rounded">
                            -{product.discountPercentage}%
                        </span>
                        )}
                    </h1>

                    <div className="text-xl font-semibold mb-4">
                        {hasActiveDiscount(product) ? (
                            <>
                            <span className="text-red-600 mr-2">
                                {calculateFinalPrice(product, selectedVariation || undefined).toFixed(2)} €
                            </span>
                                <span className="line-through text-gray-500">
                                {displayPrice.toFixed(2)} €
                            </span>
                            </>
                        ) : (
                            <span>{displayPrice.toFixed(2)} €</span>
                        )}
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <VariationSelector
                        combinations={product.variationCombinations}
                        onChange={setSelectedVariation}
                    />

                    {!isInCart && (
                        <ProductQuantitySelector
                            quantity={quantity}
                            onChange={setQuantity}
                            max={maxStock}
                        />
                    )}

                    <AddToCartButton
                        product={product}
                        variation={selectedVariation}
                        disabled={isAddToCartDisabled}
                        quantity={quantity}
                        onAdded={handleAddedToCart}
                    />

                    {showConfirmation && (
                        <div className="mt-4 text-green-600 font-semibold animate-fade-in">
                            Ajouté au panier !
                        </div>
                    )}
                </div>
            </div>

            <ProductDetailsSection
                technicalFeatures={product.technical_features}
                additionalInfo={product.additional_info}
            />
            <ProductReviewsSection reviews={product.product_reviews || []} />
            <RelatedProducts products={relatedProducts} />
        </main>
    );

}
