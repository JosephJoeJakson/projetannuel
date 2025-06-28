'use client';

import { useCartStore } from '@/stores/cart';
import Link from 'next/link';
import { calculateFinalPrice } from '@/utils/product';
import { useState, useEffect } from 'react';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const increment = useCartStore((state) => state.increment);
    const decrement = useCartStore((state) => state.decrement);
    const [isHydrated, setIsHydrated] = useState(false);

    const total = items.reduce((sum, item) => {
        const price = calculateFinalPrice(item.product, item.variation);
        return sum + price * item.quantity;
    }, 0);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

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
                            key={item.product.id + '-' + (item.variation?.id ?? 'no-var')}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-semibold">{item.product.name}</h2>
                                {item.variation && (
                                    <div className="text-sm text-gray-500 mb-1">
                                        {item.variation.optionValues.map((opt) => (
                                            <span key={opt.id} className="mr-2">
                                                {opt.option.name} : {opt.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-sm text-gray-600">
                                    {calculateFinalPrice(item.product, item.variation).toFixed(2)} € × {item.quantity}
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
                                    disabled={item.quantity >= (item.variation ? item.variation.stock : 999)}
                                    className={`px-2 py-1 rounded text-lg ${
                                        item.quantity >= (item.variation ? item.variation.stock : 999)
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
                        <p className="text-xl font-semibold">Total : {total.toFixed(2)} €</p>
                        <Link href="/checkout">
                            <button className="btn-primary mt-2">
                                Finaliser la commande
                            </button>
                        </Link>

                    </div>
                </div>
            )}

            <Link href="/" className="block mt-6 text-primary hover:underline">← Retour à la boutique</Link>
        </main>
    );
}
