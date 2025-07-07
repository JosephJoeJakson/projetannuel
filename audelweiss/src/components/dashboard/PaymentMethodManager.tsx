'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod, getUserPaymentMethods, addUserPaymentMethod, updateUserPaymentMethod, deleteUserPaymentMethod } from '@/services/payment-method';

interface PaymentMethodManagerProps {
    token: string;
}

export default function PaymentMethodManager({ token }: PaymentMethodManagerProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
    const [formData, setFormData] = useState({
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
            const userPaymentMethods = await getUserPaymentMethods(token);
            setPaymentMethods(userPaymentMethods);
        } catch (error) {
            console.error('Erreur lors du chargement des moyens de paiement:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPaymentMethod) {
                await updateUserPaymentMethod(editingPaymentMethod.id, formData, token);
            } else {
                await addUserPaymentMethod(formData, token);
            }
            await fetchPaymentMethods();
            resetForm();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const handleEdit = (paymentMethod: PaymentMethod) => {
        setEditingPaymentMethod(paymentMethod);
        setFormData({
            type: paymentMethod.type,
            cardType: paymentMethod.cardType || 'visa',
            lastFourDigits: paymentMethod.lastFourDigits || '',
            expiryMonth: paymentMethod.expiryMonth || 1,
            expiryYear: paymentMethod.expiryYear || 2024,
            cardholderName: paymentMethod.cardholderName || '',
            isDefault: paymentMethod.isDefault,
            label: paymentMethod.label || '',
            isActive: paymentMethod.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce moyen de paiement ?')) {
            try {
                await deleteUserPaymentMethod(id, token);
                await fetchPaymentMethods();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
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
        setEditingPaymentMethod(null);
        setShowForm(false);
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
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Mes Moyens de Paiement</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    Ajouter un moyen de paiement
                </button>
            </div>

            {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingPaymentMethod ? 'Modifier le moyen de paiement' : 'Nouveau moyen de paiement'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="card">Carte bancaire</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="bank_transfer">Virement bancaire</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    placeholder="ex: Carte principale"
                                />
                            </div>
                        </div>

                        {formData.type === 'card' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Type de carte</label>
                                        <select
                                            value={formData.cardType}
                                            onChange={(e) => setFormData({...formData, cardType: e.target.value as any})}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="visa">Visa</option>
                                            <option value="mastercard">Mastercard</option>
                                            <option value="amex">American Express</option>
                                            <option value="discover">Discover</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">4 derniers chiffres</label>
                                        <input
                                            type="text"
                                            value={formData.lastFourDigits}
                                            onChange={(e) => setFormData({...formData, lastFourDigits: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            maxLength={4}
                                            placeholder="1234"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Nom du titulaire</label>
                                        <input
                                            type="text"
                                            value={formData.cardholderName}
                                            onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Mois d'expiration</label>
                                        <select
                                            value={formData.expiryMonth}
                                            onChange={(e) => setFormData({...formData, expiryMonth: parseInt(e.target.value)})}
                                            className="w-full p-2 border rounded"
                                        >
                                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                                <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Année d'expiration</label>
                                        <select
                                            value={formData.expiryYear}
                                            onChange={(e) => setFormData({...formData, expiryYear: parseInt(e.target.value)})}
                                            className="w-full p-2 border rounded"
                                        >
                                            {Array.from({length: 12}, (_, i) => new Date().getFullYear() + i).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                className="mr-2"
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium">
                                Définir comme moyen de paiement par défaut
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">
                                {editingPaymentMethod ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">💳</div>
                    <p className="text-gray-600 text-lg">Vous n'avez pas encore de moyens de paiement</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {paymentMethods.map((paymentMethod) => (
                        <div key={paymentMethod.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{getTypeIcon(paymentMethod.type)}</span>
                                    <div>
                                        <h3 className="font-semibold">
                                            {paymentMethod.label || 
                                                (paymentMethod.type === 'card' ? 
                                                    `${paymentMethod.cardType?.toUpperCase()} •••• ${paymentMethod.lastFourDigits}` : 
                                                    paymentMethod.type === 'paypal' ? 'PayPal' : 'Virement bancaire'
                                                )
                                            }
                                        </h3>
                                        {paymentMethod.type === 'card' && paymentMethod.cardholderName && (
                                            <p className="text-sm text-gray-600">{paymentMethod.cardholderName}</p>
                                        )}
                                        {paymentMethod.type === 'card' && paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                                            <p className="text-sm text-gray-600">
                                                Expire {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {paymentMethod.isDefault && (
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            Par défaut
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleEdit(paymentMethod)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(paymentMethod.id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 