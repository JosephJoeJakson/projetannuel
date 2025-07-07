'use client';

import { useState, useEffect } from 'react';
import { Address, getUserAddresses, addUserAddress, updateUserAddress, deleteUserAddress } from '@/services/address';

interface AddressManagerProps {
    token: string;
}

export default function AddressManager({ token }: AddressManagerProps) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [formData, setFormData] = useState({
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
            const userAddresses = await getUserAddresses(token);
            setAddresses(userAddresses);
        } catch (error) {
            console.error('Erreur lors du chargement des adresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await updateUserAddress(editingAddress.id, formData, token);
            } else {
                await addUserAddress(formData, token);
            }
            await fetchAddresses();
            resetForm();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            company: address.company || '',
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone || '',
            isDefault: address.isDefault,
            label: address.label || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
            try {
                await deleteUserAddress(id, token);
                await fetchAddresses();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
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
        setEditingAddress(null);
        setShowForm(false);
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
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Mes Adresses</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary"
                >
                    Ajouter une adresse
                </button>
            </div>

            {showForm && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingAddress ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Prénom *</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom *</label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Société</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Adresse *</label>
                            <input
                                type="text"
                                value={formData.addressLine1}
                                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Complément d'adresse</label>
                            <input
                                type="text"
                                value={formData.addressLine2}
                                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Ville *</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Code postal *</label>
                                <input
                                    type="text"
                                    value={formData.postalCode}
                                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pays *</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                                    placeholder="ex: Domicile, Bureau"
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={formData.isDefault}
                                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                                className="mr-2"
                            />
                            <label htmlFor="isDefault" className="text-sm font-medium">
                                Définir comme adresse par défaut
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="btn-primary">
                                {editingAddress ? 'Modifier' : 'Ajouter'}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {addresses.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📍</div>
                    <p className="text-gray-600 text-lg">Vous n'avez pas encore d'adresses</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold">
                                            {address.firstName} {address.lastName}
                                        </h3>
                                        {address.isDefault && (
                                            <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                                                Par défaut
                                            </span>
                                        )}
                                        {address.label && (
                                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                                                {address.label}
                                            </span>
                                        )}
                                    </div>
                                    {address.company && (
                                        <p className="text-gray-600 text-sm mb-1">{address.company}</p>
                                    )}
                                    <p className="text-gray-700 mb-1">{address.addressLine1}</p>
                                    {address.addressLine2 && (
                                        <p className="text-gray-700 mb-1">{address.addressLine2}</p>
                                    )}
                                    <p className="text-gray-700 mb-1">
                                        {address.postalCode} {address.city}
                                    </p>
                                    <p className="text-gray-700 mb-1">{address.country}</p>
                                    {address.phone && (
                                        <p className="text-gray-600 text-sm">{address.phone}</p>
                                    )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
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