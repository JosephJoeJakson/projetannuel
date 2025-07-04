import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import {Product, ProductVariation} from '@/types/product';
import { calculateCartDiscounts, AppliedDiscount, DiscountCalculation } from '@/services/promotion';

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
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
    getQuantity: (productId: number, variationId?: number) => number;
    increment: (productId: number, variationId?: number) => void;
    decrement: (productId: number, variationId?: number) => void;
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
                            JSON.stringify(item.variation) === JSON.stringify(variation)
                    );
                    if (existing) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id && JSON.stringify(item.variation) === JSON.stringify(variation)
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { product, variation, quantity: 1 }] };
                }),
            removeFromCart: (productId, variation) =>
                set((state) => ({
                    items: state.items.filter(
                        (item) =>
                            item.product.id !== productId ||
                            JSON.stringify(item.variation) !== JSON.stringify(variation)
                    ),
                })),
            updateQuantity: (productId, quantity, variation) =>
                set((state) => ({
                    items: state.items.map((item) =>
                        item.product.id === productId && JSON.stringify(item.variation) === JSON.stringify(variation)
                            ? { ...item, quantity }
                            : item
                    ),
                })),
            clearCart: () => set({ items: [], appliedDiscounts: [], totalDiscount: 0 }),
            getQuantity: (productId, variation) => {
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        JSON.stringify(i.variation) === JSON.stringify(variation)
                );
                return item?.quantity || 0;
            },

            increment: (productId, variation) => {
                const currentQty = get().getQuantity(productId, variation);
                const item = get().items.find(
                    (i) =>
                        i.product.id === productId &&
                        JSON.stringify(i.variation) === JSON.stringify(variation)
                );
                
                if (!item) return;
                
                const maxStock = item.variation ? item.variation.stock : 999;
                
                if (currentQty < maxStock) {
                    get().updateQuantity(productId, currentQty + 1, variation);
                }
            },

            decrement: (productId, variation) => {
                const currentQty = get().getQuantity(productId, variation);
                if (currentQty > 1) {
                    get().updateQuantity(productId, currentQty - 1, variation);
                } else {
                    get().removeFromCart(productId, variation);
                }
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
