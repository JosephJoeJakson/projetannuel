import { getRequest, postRequest, putRequest, deleteRequest } from '../../lib/strapi';

export interface PaymentMethod {
    id: number;
    type: 'card' | 'paypal' | 'bank_transfer';
    cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
    lastFourDigits?: string;
    expiryMonth?: number;
    expiryYear?: number;
    cardholderName?: string;
    isDefault: boolean;
    label?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getUserPaymentMethods(token: string): Promise<PaymentMethod[]> {
    try {
        console.log(token);
        const response = await getRequest('payment-methods/user', token);
        console.log(response);
        if (!response?.paymentMethods) {
            return [];
        }

        return response.paymentMethods;
    } catch (error) {
        console.error('Erreur lors de la récupération des moyens de paiement:', error);
        return [];
    }
}

export async function addUserPaymentMethod(paymentMethodData: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>, token: string): Promise<PaymentMethod[]> {
    try {
        console.log('Token reçu:', token ? 'Présent' : 'Absent');
        console.log('Données à envoyer:', paymentMethodData);
        const response = await postRequest('payment-methods/user', paymentMethodData, token);
        
        if (!response) {
            throw new Error('Erreur lors de l\'ajout du moyen de paiement');
        }

        return response.paymentMethods || [];
    } catch (error) {
        console.error('Erreur lors de l\'ajout du moyen de paiement:', error);
        throw error;
    }
}

export async function updateUserPaymentMethod(id: number, paymentMethodData: Partial<PaymentMethod>, token: string): Promise<PaymentMethod[]> {
    try {
        const response = await putRequest(`payment-methods/user/${id}`, paymentMethodData, token);
        
        if (!response) {
            throw new Error('Erreur lors de la mise à jour du moyen de paiement');
        }

        return response.paymentMethods || [];
    } catch (error) {
        console.error('Erreur lors de la mise à jour du moyen de paiement:', error);
        throw error;
    }
}

export async function deleteUserPaymentMethod(id: number, token: string): Promise<PaymentMethod[]> {
    try {
        const response = await deleteRequest(`payment-methods/user/${id}`, token);
        
        if (!response) {
            throw new Error('Erreur lors de la suppression du moyen de paiement');
        }

        return response.paymentMethods || [];
    } catch (error) {
        console.error('Erreur lors de la suppression du moyen de paiement:', error);
        throw error;
    }
} 