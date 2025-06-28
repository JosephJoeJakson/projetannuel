import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import {Product, ProductVariationCombination} from '@/types/product';

type CartItem = {
    product: Product;
    variation?: ProductVariationCombination;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    addToCart: (product: Product, variation?: ProductVariationCombination) => void;
    removeFromCart: (productId: number, variationId?: number) => void;
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
    getQuantity: (productId: number, variationId?: number) => number;
    increment: (productId: number, variationId?: number) => void;
    decrement: (productId: number, variationId?: number) => void;
};


export const useCartStore = create<CartState>()(
    persist(
        ((set, get) => ({
            items: [],
            addToCart: (product, variation) =>
                set((state) => {
                    const existing = state.items.find(
                        (item) =>
                            item.product.id === product.id &&
                            item.variation?.id === variation?.id
                    );
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id && item.variation?.id === variation?.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { product, variation, quantity: 1 }] };
                }),
            removeFromCart: (productId, variationId) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            item.product.id !== productId ||
                            item.variation?.id !== variationId
                    ),
                })),
            updateQuantity: (productId, quantity, variationId) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && item.variation?.id === variationId
                            ? { ...item, quantity }
                            : item
                    ),
                })),
            clearCart: () => set({ items: [] }),
            getQuantity: (productId, variationId) => {
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        i.variation?.id === variationId
                );
                return item?.quantity || 0;
            },

            increment: (productId, variationId) => {
                const currentQty = get().getQuantity(productId, variationId);
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        i.variation?.id === variationId
                );
                
                if (!item) return;
                
                const maxStock = item.variation ? item.variation.stock : 999;
                
                if (currentQty < maxStock) {
                    get().updateQuantity(productId, currentQty + 1, variationId);
                }
            },

            decrement: (productId, variationId) => {
                const currentQty = get().getQuantity(productId, variationId);
                if (currentQty > 1) {
                    get().updateQuantity(productId, currentQty - 1, variationId);
                } else {
                    get().removeFromCart(productId, variationId);
                }
            },
        })) as StateCreator<CartState, [], [], CartState>,
        {
            name: 'cart-storage',
        }
    )
);
