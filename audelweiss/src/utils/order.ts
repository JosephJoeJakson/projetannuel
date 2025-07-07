import { postRequest, putRequest } from '../../lib/strapi';
import { Product, ProductVariation } from '@/types/product';
import { Address } from '@/services/address';
import { PaymentMethod } from '@/services/payment-method';

type CartItem = {
    product: Product;
    variation?: ProductVariation;
    quantity: number;
};

export async function submitOrder(
    cartItems: CartItem[],
    token: string,
    shippingAddress?: Address,
    billingAddress?: Address,
    paymentMethod?: PaymentMethod
): Promise<boolean> {
    const orderItems = cartItems.map((item) => ({
        product: item.product.id,
        variation_snapshot: item.variation ? item.variation : null,
        quantity: item.quantity,
        price: parseFloat(
            (item.variation && item.variation.price ? item.variation.price : item.product.price).toFixed(2)
        ),
    }));

    const total = orderItems.reduce(
        (sum, it) => sum + it.price * it.quantity,
        0
    );

    const orderData: any = {
        total,
        statusOrder: 'pending',
    };

    if (shippingAddress) {
        orderData.shippingAddress = shippingAddress.id;
    }
    if (billingAddress) {
        orderData.billingAddress = billingAddress.id;
    } else if (shippingAddress) {
        orderData.billingAddress = shippingAddress.id;
    }
    if (paymentMethod) {
        orderData.paymentMethod = paymentMethod.id;
    }


    const orderRes = await postRequest(
        'orders',
        {
            data: orderData,
        },
        token
    );


    if (!orderRes?.id) {
        console.error('Création de la commande échouée', orderRes);
        return false;
    }

    const orderDocumentId = orderRes.id;

    for (const it of orderItems) {
        const payload = {
            data: {
                order: orderDocumentId,
                product: it.product,
                variation_snapshot: it.variation_snapshot,
                quantity: it.quantity,
                price: it.price,
            },
        };

        const res = await postRequest('order-items', payload, token);

        if (!res?.data?.id) {
            console.error('Échec création OrderItem', payload, res);
            return false;
        }
    }

    return true;
}
