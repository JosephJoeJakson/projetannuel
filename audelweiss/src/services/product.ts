import {Category, Product} from '@/types/product';
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
        'populate[variations][populate][options][populate][option]=true',
        'populate[variations][populate][options][populate][values]=true',
        'populate[technical_features]=true',
        'populate[additional_info]=true',
        'populate[product_reviews][populate][users_permissions_user]=true'
    ].join('&');

    const data = await getRequest(`products?${query}`);
    return data?.data?.[0] || null;
}

export async function fetchRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
    const query = [
        `filters[category][id][$eq]=${categoryId}`,
        `filters[id][$ne]=${productId}`,
        'populate[main_picture]=true',
        'pagination[limit]=10',
        'sort[0]=createdAt:desc'
    ].join('&');

    const data = await getRequest(`products?${query}`);
    const all = data?.data || [];
    const shuffled = all.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
}

export async function fetchCategories(): Promise<Category[]> {
    const data = await getRequest('categories');
    return data?.data || [];
}

export async function fetchCategoryIdBySlug(slug: string): Promise<number | null> {
    const res = await getRequest(`categories?filters[slug][$eq]=${slug}`);
    return res?.data?.[0]?.id || null;
}

