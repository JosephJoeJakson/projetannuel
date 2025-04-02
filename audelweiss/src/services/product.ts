import { API_URL } from '@/utils/config';
import {Product} from "@/types/product";

export async function fetchProducts() {
    const res = await fetch(`${API_URL}/api/products?populate=*`);

    if (!res.ok) throw new Error('Erreur lors de la récupération des produits');
    return (await res.json()).data;
}

export async function fetchProductById(id: string): Promise<Product | null> {
    const res = await fetch(`${API_URL}/api/products?filters[id][$eq]=${id}&populate=*`);
    if (!res.ok) return null;

    const json = await res.json();
    const product = json.data[0];

    if (!product) return null;

    return product;
}

