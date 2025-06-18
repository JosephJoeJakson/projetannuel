'use client';

import { useCartStore } from '@/stores/cart';
import Link from 'next/link';

export default function CartPage() {
    const items = useCartStore((state) => state.items);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">Votre panier</h1>

            {items.length === 0 ? (
                <p className="text-gray-500">Votre panier est vide.</p>
            ) : (
                <div className="space-y-6">
                    {items.map((item) => (
                        <div key={item.product.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold">{item.product.name}</h2>
                                <p className="text-sm text-gray-600">{item.product.price} € × {item.quantity}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:underline"
                            >
                                Supprimer
                            </button>
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
