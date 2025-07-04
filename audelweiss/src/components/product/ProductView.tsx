'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import { Product, ProductVariation } from '@/types/product';
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
import ProductPromotionBanner from './ProductPromotionBanner';

const formatDescription = (description: string) => {
    if (!description) return '';
    
    let formatted = description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    formatted = formatted.replace(/\n/g, '<br>');
    
    formatted = formatted.replace(/([🎉💖🧶🛍️✨])/g, '<span class="inline-block mr-1">$1</span>');
    
    return formatted;
};

interface ProductViewProps {
    product: Product;
    allImages: any[];
}

function getSelectedPrice(product, selectedVariation, selected) {
    let price = product.price;
    if (selectedVariation && selected) {
        selectedVariation.options.forEach(opt => {
            const selectedId = selected[opt.option?.name];
            if (selectedId) {
                const val = opt.values.find(v => v.id === selectedId);
                if (val && val.priceImpact) price += val.priceImpact;
            }
        });
    }
    return price;
}

function buildVariationSnapshot(product, selectedOptions) {
    return {
        options: Object.entries(selectedOptions).map(([optionName, valueId]) => {
            const opt = product.variations.flatMap(v => v.options).find(o => o.option.name === optionName);
            if (!opt) return null;
            const val = opt.values.find(v => v.id === valueId);
            if (!val) return null;
            return {
                option: opt.option,
                values: [val]
            };
        }).filter(Boolean)
    };
}

export default function ProductView({ product, allImages }: ProductViewProps) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState(allImages[0]);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number | null>>({});
    const [quantity, setQuantity] = useState(1);
    const { getQuantity } = useCartStore();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    const hasVariations = product.variations && product.variations.length > 0;
    const maxStock = selectedVariation ? selectedVariation.stock ?? 999 : 999;
    const isAddToCartDisabled = hasVariations && !selectedVariation;
    const displayPrice = selectedVariation && selectedVariation.price ? selectedVariation.price : product.price;
    const isInCart = getQuantity(product.id, selectedVariation);

    const handleAddedToCart = () => {
        setSelectedVariation(null);
        setSelectedOptions({});
        setQuantity(1);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 1500);
    };

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

            <ProductPromotionBanner
                productId={product.id} 
                price={getSelectedPrice(product, selectedVariation, selectedOptions)} 
            />

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
                        <span>{getSelectedPrice(product, selectedVariation, selectedOptions).toFixed(2)} €</span>
                    </div>

                    <p className="text-gray-700 mb-6">{product.shortDescription}</p>

                    <VariationSelector
                        variations={product.variations || []}
                        onChange={(variation, selected) => {
                            setSelectedVariation(variation);
                            setSelectedOptions(selected);
                        }}
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
                        variation={buildVariationSnapshot(product, selectedOptions)}
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

            {product.description && (
                <div className="mt-12">
                    <h2 className="text-xl font-bold text-primary mb-4">Description</h2>
                    <div className="bg-base-200 p-6 rounded-lg">
                        <div 
                            className="text-base-content leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: formatDescription(product.description) }}
                        />
                    </div>
                </div>
            )}

            <ProductDetailsSection
                technicalFeatures={product.technical_features}
                additionalInfo={product.additional_info}
            />
            <ProductReviewsSection reviews={product.product_reviews || []} />
            <RelatedProducts products={relatedProducts} />
        </main>
    );

}
