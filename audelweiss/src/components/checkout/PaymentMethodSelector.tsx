'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod, getUserPaymentMethods, addUserPaymentMethod } from '@/services/payment-method';
import { useAuth } from '@/context/AuthContext';

interface PaymentMethodSelectorProps {
    onPaymentMethodSelect: (paymentMethod: PaymentMethod | null) => void;
    selectedPaymentMethod: PaymentMethod | null;
}

export default function PaymentMethodSelector({ onPaymentMethodSelect, selectedPaymentMethod }: PaymentMethodSelectorProps) {
    const { getToken } = useAuth();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewPaymentForm, setShowNewPaymentForm] = useState(false);
    const [newPaymentMethod, setNewPaymentMethod] = useState({
        type: 'card' as const,
        cardType: 'visa' as const,
        lastFourDigits: '',
        expiryMonth: 1,
        expiryYear: 2024,
        cardholderName: '',
        isDefault: false,
        label: '',
        isActive: true
    });

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (token) {
                const userPaymentMethods = await getUserPaymentMethods(token);
                setPaymentMethods(userPaymentMethods);
                
                const defaultPaymentMethod = userPaymentMethods.find(pm => pm.isDefault);
                if (defaultPaymentMethod && !selectedPaymentMethod) {
                    onPaymentMethodSelect(defaultPaymentMethod);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des moyens de paiement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewPaymentMethodSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getToken();
            if (token) {
                const newPaymentMethods = await addUserPaymentMethod(newPaymentMethod, token);
                setPaymentMethods(newPaymentMethods);
                
                const newPaymentMethodObj = newPaymentMethods.find(pm =>
                    pm.type === newPaymentMethod.type &&
                    pm.label === newPaymentMethod.label
                );
                
                if (newPaymentMethodObj) {
                    onPaymentMethodSelect(newPaymentMethodObj);
                }
                
                setShowNewPaymentForm(false);
                setNewPaymentMethod({
                    type: 'card',
                    cardType: 'visa',
                    lastFourDigits: '',
                    expiryMonth: 1,
                    expiryYear: 2024,
                    cardholderName: '',
                    isDefault: false,
                    label: '',
                    isActive: true
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du moyen de paiement:', error);
            alert('Erreur lors de l\'ajout du moyen de paiement. Veuillez réessayer.');
        }
    };

    const getCardIcon = (cardType: string) => {
        switch (cardType) {
            case 'visa': return '💳';
            case 'mastercard': return '💳';
            case 'amex': return '💳';
            case 'discover': return '💳';
            default: return '💳';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'card': return '💳';
            case 'paypal': return '🔵';
            case 'bank_transfer': return '🏦';
            default: return '💳';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Chargement des moyens de paiement...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Moyen de paiement</h3>
            
            {paymentMethods.length > 0 && (
                <div className="space-y-3">
                    {paymentMethods.map((paymentMethod) => (
                        <div
                            key={paymentMethod.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedPaymentMethod?.id === paymentMethod.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => onPaymentMethodSelect(paymentMethod)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-lg">{getTypeIcon(paymentMethod.type)}</span>
                                        <h4 className="font-medium">
                                            {paymentMethod.label || 
                                                (paymentMethod.type === 'card' ? 
                                                    `${paymentMethod.cardType?.toUpperCase()} •••• ${paymentMethod.lastFourDigits}` : 
                                                    paymentMethod.type === 'paypal' ? 'PayPal' : 'Virement bancaire'
                                                )
                                            }
                                        </h4>
                                        {paymentMethod.isDefault && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Par défaut
                                            </span>
                                        )}
                                    </div>
                                    {paymentMethod.type === 'card' && paymentMethod.cardholderName && (
                                        <p className="text-sm text-gray-600 mb-1">{paymentMethod.cardholderName}</p>
                                    )}
                                    {paymentMethod.type === 'card' && paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                                        <p className="text-sm text-gray-600">
                                            Expire {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
                                        </p>
                                    )}
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedPaymentMethod?.id === paymentMethod.id
                                        ? 'border-primary bg-primary'
                                        : 'border-gray-300'
                                }`}>
                                    {selectedPaymentMethod?.id === paymentMethod.id && (
                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!showNewPaymentForm ? (
                <button
                    onClick={() => setShowNewPaymentForm(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                    + Ajouter un nouveau moyen de paiement
                </button>
            ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-4">Nouveau moyen de paiement</h4>
                    <form onSubmit={handleNewPaymentMethodSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                            <select
                                value={newPaymentMethod.type}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, type: e.target.value as any})}
                                className="p-2 border rounded"
                                required
                            >
                                <option value="card">Carte bancaire</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Virement bancaire</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Label (ex: Carte principale)"
                                value={newPaymentMethod.label}
                                onChange={(e) => setNewPaymentMethod({...newPaymentMethod, label: e.target.value})}
                                className="p-2 border rounded"
                            />
                        </div>

                        {newPaymentMethod.type === 'card' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <select
                                        value={newPaymentMethod.cardType}
                                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardType: e.target.value as any})}
                                        className="p-2 border rounded"
                                    >
                                        <option value="visa">Visa</option>
                                        <option value="mastercard">Mastercard</option>
                                        <option value="amex">American Express</option>
                                        <option value="discover">Discover</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="4 derniers chiffres"
                                        value={newPaymentMethod.lastFourDigits}
                                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, lastFourDigits: e.target.value})}
                                        className="p-2 border rounded"
                                        maxLength={4}
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nom du titulaire"
                                    value={newPaymentMethod.cardholderName}
                                    onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cardholderName: e.target.value})}
                                    className="p-2 border rounded"
                                />
                                <div className="grid md:grid-cols-2 gap-3">
                                    <select
                                        value={newPaymentMethod.expiryMonth}
                                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: parseInt(e.target.value)})}
                                        className="p-2 border rounded"
                                    >
                                        {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                            <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={newPaymentMethod.expiryYear}
                                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryYear: parseInt(e.target.value)})}
                                        className="p-2 border rounded"
                                    >
                                        {Array.from({length: 12}, (_, i) => new Date().getFullYear() + i).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary flex-1">
                                Ajouter le moyen de paiement
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNewPaymentForm(false)}
                                className="btn-secondary"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
} 