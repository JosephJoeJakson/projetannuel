'use client';

import { useCartStore } from '@/stores/cart';
import { Product } from '@/types/product';

export default function AddToCartButton({ product }: { product: Product }) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <button
            onClick={() => addToCart(product)}
            className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
            Ajouter au panier
        </button>
    );
}
