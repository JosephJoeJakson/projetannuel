import { getRequest } from '../../lib/strapi';
import { getStrapiMedia } from '@/utils/strapi';

export interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        main_picture?: {
            url: string;
        };
    };
    variation_snapshot?: any;
}

export interface Order {
    id: number;
    total: number;
    statusOrder: 'pending' | 'confirmed' | 'canceled';
    createdAt: string;
    order_items: OrderItem[];
}

export async function getUserOrders(token: string): Promise<Order[]> {
    try {
        const response = await getRequest('orders?populate=order_items.product.main_picture&sort=createdAt:desc', token);
        console.log(response);
        if (!response?.data) {
            return [];
        }

        return response.data.map((order: any) => ({
            id: order.id,
            total: order.total,
            statusOrder: order.statusOrder,
            createdAt: order.createdAt,
            order_items: order.order_items?.map((item: any) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                product: {
                    id: item.product?.id,
                    name: item.product?.name,
                    main_picture: item.product?.main_picture ? {
                        ...item.product.main_picture,
                        url: getStrapiMedia(item.product.main_picture.url) || ''
                    } : undefined,
                },
                variation_snapshot: item.variation_snapshot,
            })) || [],
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        return [];
    }
}

export function getStatusLabel(status: string): string {
    switch (status) {
        case 'pending':
            return 'En attente';
        case 'confirmed':
            return 'Confirmée';
        case 'canceled':
            return 'Annulée';
        default:
            return status;
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'confirmed':
            return 'bg-green-100 text-green-800';
        case 'canceled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
} 