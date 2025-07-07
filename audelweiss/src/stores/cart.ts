import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import {Product, ProductVariation} from '@/types/product';
import { calculateCartDiscounts, AppliedDiscount, DiscountCalculation } from '@/services/promotion';
import { useEffect, useState } from 'react';

type CartItem = {
    product: Product;
    variation?: ProductVariation;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    appliedDiscounts: AppliedDiscount[];
    totalDiscount: number;
    addToCart: (product: Product, variation?: ProductVariation) => void;
    removeFromCart: (productId: number, variationId?: number) => void;
    removeByOptions: (productId: number, variationOptions?: any[]) => void;
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
    getQuantity: (productId: number, variationId?: number) => number;
    getQuantityByOptions: (productId: number, variationOptions?: any[]) => number;
    increment: (productId: number, variationId?: number) => void;
    decrement: (productId: number, variationId?: number) => void;
    incrementByOptions: (productId: number, variationOptions?: any[]) => void;
    decrementByOptions: (productId: number, variationOptions?: any[]) => void;
    calculateDiscounts: () => Promise<void>;
    getSubtotal: () => number;
    getTotal: () => number;
};

function getCartItemPrice(item: CartItem): number {
    let price = item.product.price;
    if (item.variation) {
        item.variation.options.forEach(opt => {
            opt.values.forEach(val => {
                if (val.priceImpact) price += val.priceImpact;
            });
        });
    }
    return price;
}

export const useCartStore = create<CartState>()(
    persist(
        ((set, get) => ({
            items: [],
            appliedDiscounts: [],
            totalDiscount: 0,
            addToCart: (product, variation) =>
                set((state) => {
                    const existing = state.items.find(
                        (item) =>
                            item.product.id === product.id &&
                            (variation 
                                ? JSON.stringify(item.variation?.options) === JSON.stringify(variation.options)
                                : !item.variation
                            )
                    );
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id && 
                                (variation 
                                    ? JSON.stringify(item.variation?.options) === JSON.stringify(variation.options)
                                    : !item.variation
                                )
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
                            (variationId ? item.variation?.id !== variationId : item.variation)
                    ),
                })),
            removeByOptions: (productId, variationOptions) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            item.product.id !== productId ||
                            (variationOptions 
                                ? JSON.stringify(item.variation?.options) !== JSON.stringify(variationOptions)
                                : item.variation
                            )
                    ),
                })),
            updateQuantity: (productId, quantity, variationId) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && (variationId ? item.variation?.id === variationId : !item.variation)
                            ? { ...item, quantity }
                            : item
                    ),
                })),
            clearCart: () => set({ items: [], appliedDiscounts: [], totalDiscount: 0 }),
            getQuantity: (productId, variationId) => {
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        (variationId ? i.variation?.id === variationId : !i.variation)
                );
                return item?.quantity || 0;
            },

            getQuantityByOptions: (productId, variationOptions) => {
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        (variationOptions 
                            ? JSON.stringify(i.variation?.options) === JSON.stringify(variationOptions)
                            : !i.variation
                        )
                );
                return item?.quantity || 0;
            },

            increment: (productId, variationId) => {
                set((state) => {
                    const itemIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === productId &&
                            (variationId 
                                ? item.variation?.id === variationId 
                                : !item.variation
                            )
                    );
                    
                    if (itemIndex === -1) return state;
                    
                    const item = state.items[itemIndex];
                    const maxStock = item.variation?.stock ?? 999;
                    
                    if (item.quantity < maxStock) {
                        const updatedItems = [...state.items];
                        updatedItems[itemIndex] = {
                            ...item,
                            quantity: item.quantity + 1
                        };
                        return { items: updatedItems };
                    }
                    
                    return state;
                });
            },

            decrement: (productId, variationId) => {
                set((state) => {
                    const itemIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === productId &&
                            (variationId 
                                ? item.variation?.id === variationId 
                                : !item.variation
                            )
                    );
                    
                    if (itemIndex === -1) return state;
                    
                    const item = state.items[itemIndex];
                    
                    if (item.quantity > 1) {
                        const updatedItems = [...state.items];
                        updatedItems[itemIndex] = {
                            ...item,
                            quantity: item.quantity - 1
                        };
                        return { items: updatedItems };
                    } else {
                        return {
                            items: state.items.filter((_, index) => index !== itemIndex)
                        };
                    }
                });
            },

            incrementByOptions: (productId, variationOptions) => {
                set((state) => {
                    const itemIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === productId &&
                            (variationOptions 
                                ? JSON.stringify(item.variation?.options) === JSON.stringify(variationOptions)
                                : !item.variation
                            )
                    );
                    
                    if (itemIndex === -1) return state;
                    
                    const item = state.items[itemIndex];
                    const maxStock = item.variation?.stock ?? 999;
                    
                    if (item.quantity < maxStock) {
                        const updatedItems = [...state.items];
                        updatedItems[itemIndex] = {
                            ...item,
                            quantity: item.quantity + 1
                        };
                        return { items: updatedItems };
                    }
                    
                    return state;
                });
            },

            decrementByOptions: (productId, variationOptions) => {
                set((state) => {
                    const itemIndex = state.items.findIndex(
                        (item) =>
                            item.product.id === productId &&
                            (variationOptions 
                                ? JSON.stringify(item.variation?.options) === JSON.stringify(variationOptions)
                                : !item.variation
                            )
                    );
                    
                    if (itemIndex === -1) return state;
                    
                    const item = state.items[itemIndex];
                    
                    if (item.quantity > 1) {
                        const updatedItems = [...state.items];
                        updatedItems[itemIndex] = {
                            ...item,
                            quantity: item.quantity - 1
                        };
                        return { items: updatedItems };
                    } else {
                        return {
                            items: state.items.filter((_, index) => index !== itemIndex)
                        };
                    }
                });
            },

            calculateDiscounts: async () => {
                const items = get().items;
                if (items.length === 0) {
                    set({ appliedDiscounts: [], totalDiscount: 0 });
                    return;
                }

                try {
                    const cartItems = items.map(item => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: getCartItemPrice(item)
                    }));

                    const result = await calculateCartDiscounts(cartItems);
                    set({ 
                        appliedDiscounts: result.appliedDiscounts, 
                        totalDiscount: result.totalDiscount 
                    });
                } catch (error) {
                    console.error('Erreur lors du calcul des réductions:', error);
                    set({ appliedDiscounts: [], totalDiscount: 0 });
                }
            },

            getSubtotal: () => {
                const items = get().items;
                return items.reduce((total, item) => {
                    const price = getCartItemPrice(item);
                    return total + (price * item.quantity);
                }, 0);
            },

            getTotal: () => {
                const subtotal = get().getSubtotal();
                return subtotal - get().totalDiscount;
            },
        })) as StateCreator<CartState, [], [], CartState>,
        {
            name: 'cart-storage',
        }
    )
);

export function useCartStoreHydrated() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated;
}
