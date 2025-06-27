'use client';

import { useState } from 'react';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import { Product, ProductVariationCombination } from '@/types/product';
import VariationSelector from '@/components/product/VariationSelector';
import { useCartStore } from '@/stores/cart';

interface ProductViewProps {
    product: Product;
    allImages: any[];
}

export default function ProductView({ product, allImages }: ProductViewProps) {
    const [selectedImage, setSelectedImage] = useState(allImages[0]);
    const [selectedVariation, setSelectedVariation] = useState<ProductVariationCombination | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { getQuantity } = useCartStore();
    const [showConfirmation, setShowConfirmation] = useState(false);

    const getImageUrl = (img: any) =>
        `http://localhost:3090${img?.formats?.large?.url || img.url}`;
    const getThumbUrl = (img: any) =>
        `http://localhost:3090${img?.formats?.thumbnail?.url || img.url}`;

    const handleAddedToCart = () => {
        setSelectedVariation(null);
        setQuantity(1);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 1500);
    };

    const displayPrice = selectedVariation ? selectedVariation.price : product.price;

    const isInCart = selectedVariation && getQuantity(product.id, selectedVariation.id) > 0;

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="text-secondary hover:underline mb-4">
                ← Retour à la liste des produits
            </Link>

            <div className="grid md:grid-cols-2 gap-8 items-start mt-4">
                <div>
                    <img
                        src={getImageUrl(selectedImage)}
                        alt={selectedImage.alternativeText || ''}
                        className="w-full rounded-lg shadow mb-4 transition-all duration-300"
                    />

                    {product.main_picture_description && (
                        <p className="text-sm text-gray-600 italic mb-2">
                            {product.main_picture_description}
                        </p>
                    )}

                    {allImages.length > 1 && (
                        <div className="flex gap-2 mt-2">
                            {allImages.map((img) => (
                                <img
                                    key={img.id}
                                    src={getThumbUrl(img)}
                                    alt={img.alternativeText || ''}
                                    className={`rounded shadow object-cover h-20 w-20 cursor-pointer border-2 ${
                                        selectedImage?.id === img.id
                                            ? 'border-primary'
                                            : 'border-transparent'
                                    }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-primary mb-2">{product.name}</h1>
                    <p className="text-secondary text-xl font-semibold mb-4">{displayPrice} €</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <VariationSelector
                        combinations={product.variationCombinations}
                        onChange={setSelectedVariation}
                    />

                    {!isInCart && (
                        <>
                            <div className="flex items-center gap-2 my-4">
                                <button
                                    type="button"
                                    className="px-3 py-1 rounded bg-gray-200 text-lg"
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    –
                                </button>
                                <span className="text-lg font-semibold">{quantity}</span>
                                <button
                                    type="button"
                                    className="px-3 py-1 rounded bg-gray-200 text-lg"
                                    onClick={() => setQuantity(q => q + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </>
                    )}

                    <AddToCartButton
                        product={product}
                        variation={selectedVariation}
                        disabled={!selectedVariation}
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
        </main>
    );
}
