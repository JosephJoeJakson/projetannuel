import { Product } from '@/types/product';
import {getRequest} from "../../lib/strapi";

export async function fetchProducts(): Promise<Product[]> {
    const data = await getRequest('products?populate=*');
    return data?.data || [];
}

export async function fetchProductById(id: string): Promise<Product | null> {
    const query = [
        `filters[id][$eq]=${id}`,
        'populate[main_picture]=true',
        'populate[secondary_pictures]=true',
        'populate[category]=true',
        'populate[variationCombinations][populate][optionValues][populate][option]=true',
        'populate[variationCombinations][populate][optionValues][populate][image]=true'
    ].join('&');

    const data = await getRequest(`products?${query}`);
    return data?.data?.[0] || null;
}

