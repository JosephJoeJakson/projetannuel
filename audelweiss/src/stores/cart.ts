import { create } from 'zustand';
import { Product } from '@/types/product';

type CartItem = {
    product: Product;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    updateQuantity: (productId: number, quantity: number) => void;
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addToCart: (product) =>
        set((state) => {
            const existing = state.items.find((item) => item.product.id === product.id);
            if (existing) {
                return {
                    items: state.items.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { items: [...state.items, { product, quantity: 1 }] };
        }),
    removeFromCart: (productId) =>
        set((state) => ({
            items: state.items.filter((item) => item.product.id !== productId),
        })),
    updateQuantity: (productId, quantity) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            ),
        })),
    clearCart: () => set({ items: [] }),
}));
