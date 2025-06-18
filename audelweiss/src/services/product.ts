import { Product } from '@/types/product';
import {getRequest} from "../../lib/strapi";

export async function fetchProducts(): Promise<Product[]> {
    const data = await getRequest('products?populate=*');
    return data?.data || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
    const data = await getRequest(`products?filters[id][$eq]=${id}&populate=*`);
    const product = data?.data?.[0];
    return product || null;
}
