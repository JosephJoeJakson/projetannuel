'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cart';
import { calculateFinalPrice } from '@/utils/product';
import {submitOrder} from "@/utils/order";

export default function CheckoutPage() {
    const { user, isLoggedIn } = useAuth();
    const { items } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        if (items.length === 0) {
            router.push('/');
        }
    }, [items, router]);

    const handleConfirm = async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;

        const success = await submitOrder(items, jwt);
        if (success) {
            alert('Commande confirmée ✅');
            useCartStore.getState().clearCart();
            router.push('/merci');
        } else {
            alert('Erreur lors de l’envoi de la commande.');
        }
    };

    if (!isLoggedIn) {
        return (
            <main className="max-w-xl mx-auto py-16 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Tu n'es pas connecté 😢</h1>
                <p className="text-gray-700 mb-6">
                    Pour finaliser ta commande, connecte-toi ou crée un compte. Ton panier est toujours là !
                </p>
                <a
                    href="/login"
                    className="inline-block bg-primary text-white px-6 py-3 rounded hover:opacity-90"
                >
                    Connexion / Inscription
                </a>
            </main>
        );
    }

    const total = items.reduce((sum, item) => {
        const price = calculateFinalPrice(item.product, item.variation);
        return sum + price * item.quantity;
    }, 0);

    return (
        <main className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6">Validation de la commande</h1>
            <p className="text-gray-600 mb-4">Bienvenue, {user.username || user.email} 👋</p>

            <div className="space-y-6 mt-8">
                {items.map((item) => (
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
                        <p className="text-lg font-bold">
                            {(calculateFinalPrice(item.product, item.variation) * item.quantity).toFixed(2)} €
                        </p>
                    </div>
                ))}

                <div className="text-right mt-8 border-t pt-4">
                    <p className="text-xl font-semibold">Total : {total.toFixed(2)} €</p>
                    <button
                        className="btn-primary mt-4"
                        onClick={handleConfirm}
                    >
                        Confirmer la commande
                    </button>

                </div>
            </div>
        </main>
    );
}
