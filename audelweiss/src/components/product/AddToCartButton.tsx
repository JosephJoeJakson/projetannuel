'use client';

import { useCartStore } from '@/stores/cart';
import {Product, ProductVariationCombination} from '@/types/product';
import { useRef, useEffect, useState } from 'react';
interface AddToCartButtonProps {
    product: Product;
    variation?: ProductVariationCombination | null;
    disabled?: boolean;
    quantity?: number;
    onAdded?: () => void;
}
export default function AddToCartButton({ product, variation, disabled, quantity = 1, onAdded }: AddToCartButtonProps) {
    const {
        addToCart,
        increment,
        decrement,
        getQuantity
    } = useCartStore();

    const [isHydrated, setIsHydrated] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product, variation || undefined);
        }
        animateToCart();
        if (onAdded) onAdded();
    };

    const animateToCart = () => {
        const cartIcon = document.querySelector('.header__icon');
        const button = buttonRef.current;
        if (!cartIcon || !button) return;

        const startRect = button.getBoundingClientRect();
        const endRect = cartIcon.getBoundingClientRect();

        const clone = button.cloneNode(true) as HTMLButtonElement;
        clone.style.position = 'fixed';
        clone.style.top = `${startRect.top}px`;
        clone.style.left = `${startRect.left}px`;
        clone.style.zIndex = '9999';
        clone.style.transition = 'all 0.7s ease-in-out';
        clone.style.pointerEvents = 'none';
        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.top = `${endRect.top}px`;
            clone.style.left = `${endRect.left}px`;
            clone.style.opacity = '0';
            clone.style.transform = 'scale(0.5)';
        });

        clone.addEventListener('transitionend', () => {
            clone.remove();
        });
    };

    if (!isHydrated) return null;

    return getQuantity(product.id, variation?.id) > 0 ? (
        <div className="flex items-center gap-3">
            <button
                onClick={() => decrement(product.id, variation?.id)}
                className="bg-gray-200 px-3 py-1 rounded text-lg"
            >
                –
            </button>
            <span className="text-lg font-semibold">{getQuantity(product.id, variation?.id)}</span>
            <button
                onClick={() => increment(product.id, variation?.id)}
                className="bg-gray-200 px-3 py-1 rounded text-lg"
            >
                +
            </button>
        </div>
    ) : (
        <button
            ref={buttonRef}
            onClick={handleAddToCart}
            disabled={disabled}
            className={`mt-6 btn-primary bg-primary text-white font-semibold py-2 px-4 rounded ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
            }`}
        >
            Ajouter au panier
        </button>
    );
}
