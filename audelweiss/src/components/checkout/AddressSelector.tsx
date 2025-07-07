'use client';

import { useState, useEffect } from 'react';
import { Address, getUserAddresses, addUserAddress } from '@/services/address';
import { useAuth } from '@/context/AuthContext';

interface AddressSelectorProps {
    onAddressSelect: (address: Address | null) => void;
    selectedAddress: Address | null;
}

export default function AddressSelector({ onAddressSelect, selectedAddress }: AddressSelectorProps) {
    const { getToken } = useAuth();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        firstName: '',
        lastName: '',
        company: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: 'France',
        phone: '',
        isDefault: false,
        label: ''
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const token = getToken();
            if (token) {
                const userAddresses = await getUserAddresses(token);
                setAddresses(userAddresses);
                
                // Sélectionner automatiquement l'adresse par défaut
                const defaultAddress = userAddresses.find(addr => addr.isDefault);
                if (defaultAddress && !selectedAddress) {
                    onAddressSelect(defaultAddress);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des adresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getToken();
            if (token) {
                const newAddresses = await addUserAddress(newAddress, token);
                setAddresses(newAddresses);
                
                const newAddressObj = newAddresses.find(addr =>
                    addr.firstName === newAddress.firstName && 
                    addr.lastName === newAddress.lastName &&
                    addr.addressLine1 === newAddress.addressLine1
                );
                
                if (newAddressObj) {
                    onAddressSelect(newAddressObj);
                }
                
                setShowNewAddressForm(false);
                setNewAddress({
                    firstName: '',
                    lastName: '',
                    company: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    postalCode: '',
                    country: 'France',
                    phone: '',
                    isDefault: false,
                    label: ''
                });
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'adresse:', error);
            alert('Erreur lors de l\'ajout de l\'adresse. Veuillez réessayer.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Chargement des adresses...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Adresse de livraison</h3>
            
            {addresses.length > 0 && (
                <div className="space-y-3">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                selectedAddress?.id === address.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => onAddressSelect(address)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium">
                                            {address.firstName} {address.lastName}
                                        </h4>
                                        {address.isDefault && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                Par défaut
                                            </span>
                                        )}
                                        {address.label && (
                                            <span className="text-sm text-gray-600">({address.label})</span>
                                        )}
                                    </div>
                                    {address.company && (
                                        <p className="text-sm text-gray-600 mb-1">{address.company}</p>
                                    )}
                                    <p className="text-sm mb-1">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-sm mb-1">{address.addressLine2}</p>
                                    )}
                                    <p className="text-sm mb-1">
                                        {address.postalCode} {address.city}
                                    </p>
                                    <p className="text-sm text-gray-600">{address.country}</p>
                                    {address.phone && (
                                        <p className="text-sm text-gray-600">{address.phone}</p>
                                    )}
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedAddress?.id === address.id
                                        ? 'border-primary bg-primary'
                                        : 'border-gray-300'
                                }`}>
                                    {selectedAddress?.id === address.id && (
                                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!showNewAddressForm ? (
                <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                    + Ajouter une nouvelle adresse
                </button>
            ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-4">Nouvelle adresse</h4>
                    <form onSubmit={handleNewAddressSubmit} className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Prénom *"
                                value={newAddress.firstName}
                                onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                                className="p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Nom *"
                                value={newAddress.lastName}
                                onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                                className="p-2 border rounded"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Société"
                            value={newAddress.company}
                            onChange={(e) => setNewAddress({...newAddress, company: e.target.value})}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Adresse *"
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress({...newAddress, addressLine1: e.target.value})}
                            className="p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Complément d'adresse"
                            value={newAddress.addressLine2}
                            onChange={(e) => setNewAddress({...newAddress, addressLine2: e.target.value})}
                            className="p-2 border rounded"
                        />
                        <div className="grid md:grid-cols-3 gap-3">
                            <input
                                type="text"
                                placeholder="Ville *"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Code postal *"
                                value={newAddress.postalCode}
                                onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                                className="p-2 border rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Téléphone"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                                className="p-2 border rounded"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary flex-1">
                                Ajouter l'adresse
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNewAddressForm(false)}
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