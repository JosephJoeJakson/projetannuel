'use client';

import { useCartStore } from '@/stores/cart';
import Link from 'next/link';
import { calculateFinalPrice } from '@/utils/product';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Product, ProductVariation } from '@/types/product';

type CartItem = {
    product: Product;
    variation?: ProductVariation;
    quantity: number;
};

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const appliedDiscounts = useCartStore((state) => state.appliedDiscounts);
    const totalDiscount = useCartStore((state) => state.totalDiscount);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const increment = useCartStore((state) => state.increment);
    const decrement = useCartStore((state) => state.decrement);
    const calculateDiscounts = useCartStore((state) => state.calculateDiscounts);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const getTotal = useCartStore((state) => state.getTotal);
    const [isHydrated, setIsHydrated] = useState(false);
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    const subtotal = getSubtotal();
    const total = getTotal();

    useEffect(() => {
        setIsHydrated(true);
        calculateDiscounts();
    }, [items, calculateDiscounts]);

    const handleCheckout = () => {
        if (isLoggedIn) {
            router.push('/checkout');
        } else {
            router.push('/login?redirect=/checkout');
        }
    };

    if (typeof window !== 'undefined') {
        if (window.location.pathname === '/cart/reset') {
            const store = require('@/stores/cart');
            store.useCartStore.getState().clearCart();
            window.location.href = '/cart';
        }
    }

    function getCartItemPrice(item: CartItem): number {
        let price = item.product.price;
        if (item.variation) {
            item.variation.options.forEach(opt => {
                opt.values.forEach(val => {
                    // Pour l'instant, on ne peut pas calculer le priceImpact car les valeurs sont des strings
                    // Il faudrait récupérer les objets OptionValue complets depuis l'API
                });
            });
        }
        return price;
    }

    if (!isHydrated) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Votre panier</h1>

            {items.length === 0 ? (
                <p className="text-gray-500">Votre panier est vide.</p>
            ) : (
                <div className="space-y-6">
                    {items.map((item, idx) => (
                        <div
                            key={item.product.id + '-' + (item.variation ? JSON.stringify(item.variation.options) : 'no-var')}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-semibold flex items-center gap-2">
                                    {item.product.name}
                                    <span className="text-xs text-gray-400 font-normal">{item.product.price.toFixed(2)} €</span>
                                </h2>
                                {item.variation && (
                                    <div className="text-sm text-gray-500 mb-1 space-y-1">
                                        {item.variation.options.map((opt) => {
                                            const val = opt.values[0];
                                            return (
                                                <div key={opt.option + '-' + val} className="flex flex-col items-start">
                                                    <span>{opt.option} : {val}</span>
                                                    {/* Note: priceImpact ne peut pas être affiché car les valeurs sont des strings */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">
                                    {getCartItemPrice(item).toFixed(2)} € × {item.quantity}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => decrement(item.product.id, item.variation?.id)}
                                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                                >
                                    –
                                </button>
                                <span className="text-lg font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => increment(item.product.id, item.variation?.id)}
                                    disabled={item.quantity >= (item.variation?.stock || 999)}
                                    className={`px-2 py-1 rounded text-lg ${
                                        item.quantity >= (item.variation?.stock || 999)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    +
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.product.id, item.variation?.id)}
                                    className="ml-4 text-red-500 hover:underline"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="text-right mt-8">
                        <div className="bg-base-200 p-4 rounded-lg mb-4 border border-base-300">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Sous-total :</span>
                                    <span>{subtotal.toFixed(2)} €</span>
                                </div>
                                
                                {appliedDiscounts.length > 0 && (
                                    <>
                                        <div className="border-t border-base-300 pt-2">
                                            <p className="font-semibold text-primary mb-2">🎉 Réductions appliquées :</p>
                                            {appliedDiscounts.map((discount, index) => (
                                                <div key={index} className="flex justify-between text-primary">
                                                    <span className="text-xs">{discount.displayMessage}</span>
                                                    <span>-{discount.discountAmount.toFixed(2)} €</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t border-base-300 pt-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total des réductions :</span>
                                                <span className="text-primary">-{totalDiscount.toFixed(2)} €</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                <div className="border-t border-base-300 pt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total :</span>
                                        <span>{total.toFixed(2)} €</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {!isLoggedIn && (
                            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 my-4 text-left rounded" role="alert">
                                <p className="font-bold">Presque terminé !</p>
                                <p>Connectez-vous ou créez un compte pour finaliser votre commande.</p>
                            </div>
                        )}
                        
                        <button onClick={handleCheckout} className="btn-primary mt-2">
                            Finaliser la commande
                        </button>
                    </div>
                </div>
            )}

            <Link href="/" className="block mt-6 text-primary hover:underline">← Retour à la boutique</Link>
        </main>
    );
}
