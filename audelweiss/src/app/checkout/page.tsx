'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/stores/cart';
import { calculateFinalPrice } from '@/utils/product';
import { submitOrder } from "@/utils/order";
import { Address } from '@/services/address';
import { PaymentMethod } from '@/services/payment-method';
import CheckoutBreadcrumb from '@/components/checkout/CheckoutBreadcrumb';
import AddressSelector from '@/components/checkout/AddressSelector';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import Link from 'next/link';
import { Product, ProductVariation } from '@/types/product';

type CartItem = {
    product: Product;
    variation?: ProductVariation;
    quantity: number;
};

export default function CheckoutPage() {
    const { user, isLoggedIn, isLoading } = useAuth();
    const { items, clearCart } = useCartStore();
    const router = useRouter();
    
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [currentStep, setCurrentStep] = useState<'checkout' | 'payment' | 'confirmation'>('checkout');

    useEffect(() => {
        if (!isLoading && items.length === 0) {
            router.push('/');
        }
    }, [items, router, isLoading]);

    const handleNextStep = () => {
        if (!selectedAddress) {
            alert('Veuillez sélectionner une adresse de livraison');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Veuillez sélectionner un moyen de paiement');
            return;
        }
        setCurrentStep('payment');
    };

    const handleConfirm = async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;

        if (!selectedAddress || !selectedPaymentMethod) {
            alert('Veuillez sélectionner une adresse et un moyen de paiement');
            return;
        }

        const success = await submitOrder(
            items, 
            jwt, 
            selectedAddress, 
            selectedAddress,
            selectedPaymentMethod
        );
        if (success) {
            alert('Commande confirmée ✅');
            clearCart();
            router.push('/merci');
        } else {
            alert('Erreur lors de l\'envoi de la commande.');
        }
    };

    if (isLoading) {
        return <div className="text-center py-12">Chargement...</div>;
    }

    if (!isLoggedIn) {
        return (
            <main className="max-w-xl mx-auto py-16 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Vous devez être connecté</h1>
                <p className="text-gray-700 mb-6">
                    Pour finaliser votre commande, connectez-vous ou créez un compte. Votre panier sera conservé !
                </p>
                <Link
                    href="/login?redirect=/checkout"
                    className="inline-block bg-primary text-white px-6 py-3 rounded hover:opacity-90"
                >
                    Connexion / Inscription
                </Link>
            </main>
        );
    }
    
    if (!user) {
        return <div className="text-center py-12">Erreur lors du chargement des informations utilisateur.</div>;
    }

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

    const total = items.reduce((sum, item) => {
        const price = getCartItemPrice(item);
        return sum + price * item.quantity;
    }, 0);

    return (
        <main className="max-w-6xl mx-auto py-12 px-4">
            <CheckoutBreadcrumb currentStep="checkout" />
            
            <h1 className="text-3xl font-bold mb-6">Validation de la commande</h1>
            <p className="text-gray-600 mb-8">Bienvenue, {user.username || user.email} 👋</p>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                        <AddressSelector 
                            onAddressSelect={setSelectedAddress}
                            selectedAddress={selectedAddress}
                        />
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                        <PaymentMethodSelector 
                            onPaymentMethodSelect={setSelectedPaymentMethod}
                            selectedPaymentMethod={selectedPaymentMethod}
                        />
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Résumé de votre commande</h3>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product.id + '-' + (item.variation?.id ?? 'no-var')}
                                    className="flex justify-between items-start border-b pb-4 last:border-b-0"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-medium">{item.product.name}</h4>
                                        {item.variation && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {item.variation.options.map((opt, optIndex) => {
                                                    const val = opt.values[0];
                                                    return (
                                                        <div key={`${opt.option?.id || opt.option?.name || optIndex}-${val?.id || val?.name || 'val'}`} className="flex flex-col items-start">
                                                            <span>
                                                                {opt.option?.name || opt.option} : {val?.name || val}
                                                                {val?.priceImpact && val.priceImpact > 0 && (
                                                                    <span className="text-green-600 ml-1">(+{val.priceImpact.toFixed(2)} €)</span>
                                                                )}
                                                                {val?.priceImpact && val.priceImpact < 0 && (
                                                                    <span className="text-red-600 ml-1">({val.priceImpact.toFixed(2)} €)</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">
                                            {getCartItemPrice(item).toFixed(2)} € × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium">
                                        {(getCartItemPrice(item) * item.quantity).toFixed(2)} €
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white border rounded-lg p-6 sticky top-4">
                        <h3 className="text-lg font-semibold mb-4">Résumé</h3>
                        
                        {selectedAddress && (
                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <h4 className="font-medium text-sm mb-2">Adresse de livraison</h4>
                                <p className="text-sm text-gray-600">
                                    {selectedAddress.firstName} {selectedAddress.lastName}<br />
                                    {selectedAddress.addressLine1}<br />
                                    {selectedAddress.postalCode} {selectedAddress.city}
                                </p>
                            </div>
                        )}

                        {selectedPaymentMethod && (
                            <div className="mb-4 p-3 bg-gray-50 rounded">
                                <h4 className="font-medium text-sm mb-2">Moyen de paiement</h4>
                                <p className="text-sm text-gray-600">
                                    {selectedPaymentMethod.label || 
                                        (selectedPaymentMethod.type === 'card' ? 
                                            `${selectedPaymentMethod.cardType?.toUpperCase()} •••• ${selectedPaymentMethod.lastFourDigits}` : 
                                            selectedPaymentMethod.type === 'paypal' ? 'PayPal' : 'Virement bancaire'
                                        )
                                    }
                                </p>
                            </div>
                        )}

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total</span>
                                <span>{total.toFixed(2)} €</span>
                            </div>
                        </div>

                        <button
                            className="w-full btn-primary mt-6"
                            onClick={handleConfirm}
                            disabled={!selectedAddress || !selectedPaymentMethod}
                        >
                            Confirmer la commande
                        </button>

                        {(!selectedAddress || !selectedPaymentMethod) && (
                            <p className="text-sm text-gray-500 mt-2 text-center">
                                Veuillez sélectionner une adresse et un moyen de paiement
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
