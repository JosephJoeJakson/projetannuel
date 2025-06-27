'use client';

import { useCartStore } from '@/stores/cart';
import Link from 'next/link';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const increment = useCartStore((state) => state.increment);
    const decrement = useCartStore((state) => state.decrement);

    const total = items.reduce((sum, item) => {
        const price = item.variation ? item.variation.price : item.product.price;
        return sum + price * item.quantity;
    }, 0);

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
                                    {(item.variation ? item.variation.price : item.product.price)} € × {item.quantity}
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
                                    className="px-2 py-1 bg-gray-200 rounded text-lg"
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
                        <button className="mt-4 bg-secondary text-white px-4 py-2 rounded hover:opacity-90">
                            Finaliser la commande
                        </button>
                    </div>
                </div>
            )}

            <Link href="/" className="block mt-6 text-primary hover:underline">← Retour à la boutique</Link>
        </main>
    );
}
