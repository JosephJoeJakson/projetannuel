import { getRequest, postRequest, putRequest, deleteRequest } from '../../lib/strapi';

export interface Address {
    id: number;
    firstName: string;
    lastName: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
    isDefault: boolean;
    label?: string;
    createdAt: string;
    updatedAt: string;
}

export async function getUserAddresses(token: string): Promise<Address[]> {
    try {
        console.log(token);
        const response = await getRequest('addresses/user', token);
        console.log(response);
        if (!response?.addresses) {
            return [];
        }

        return response.addresses;
    } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
        return [];
    }
}

export async function addUserAddress(addressData: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Address[]> {
    try {
        console.log('Token reçu:', token ? 'Présent' : 'Absent');
        console.log('Données à envoyer:', addressData);
        const response = await postRequest('addresses/user', addressData, token);
        
        if (!response) {
            throw new Error('Erreur lors de l\'ajout de l\'adresse');
        }

        return response.addresses || [];
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'adresse:', error);
        throw error;
    }
}

export async function updateUserAddress(id: number, addressData: Partial<Address>, token: string): Promise<Address[]> {
    try {
        const response = await putRequest(`addresses/user/${id}`, addressData, token);
        
        if (!response) {
            throw new Error('Erreur lors de la mise à jour de l\'adresse');
        }

        return response.addresses || [];
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'adresse:', error);
        throw error;
    }
}

export async function deleteUserAddress(id: number, token: string): Promise<Address[]> {
    try {
        const response = await deleteRequest(`addresses/user/${id}`, token);
        
        if (!response) {
            throw new Error('Erreur lors de la suppression de l\'adresse');
        }

        return response.addresses || [];
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'adresse:', error);
        throw error;
    }
} 