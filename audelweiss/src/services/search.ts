import { getRequest } from "../../lib/strapi";

export interface SearchResult {
    id: string;
    type: 'product' | 'page' | 'blog' | 'category';
    title: string;
    description?: string;
    url: string;
    image?: string;
    price?: number;
    category?: string;
}

function getField(obj: any, field: string) {
    return obj?.[field] || obj?.attributes?.[field] || '';
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
    try {
        const data = await getRequest(`products?filters[name][$containsi]=${encodeURIComponent(query)}&populate=*`);
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.map((product: any) => ({
            id: (product.id || product?.attributes?.id)?.toString(),
            type: 'product' as const,
            title: getField(product, 'title') || getField(product, 'name'),
            description: getField(product, 'description'),
            url: `/products/${product.id || product?.attributes?.id}`,
            image: getField(product, 'main_picture')?.data?.attributes?.url || getField(product, 'image'),
            price: getField(product, 'price'),
            category: getField(product, 'category')?.data?.attributes?.name || getField(product, 'category')?.name
        }));
    } catch (error) {
        console.error('Erreur recherche produits:', error);
        return [];
    }
}

export async function searchPages(query: string): Promise<SearchResult[]> {
    try {
        const data = await getRequest(`pages?filters[title][$containsi]=${encodeURIComponent(query)}&populate=*`);
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.map((page: any) => ({
            id: (page.id || page?.attributes?.id)?.toString(),
            type: 'page' as const,
            title: getField(page, 'title') || getField(page, 'name'),
            description: getField(page, 'description'),
            url: `/pages/${getField(page, 'slug') || page.id || page?.attributes?.id}`,
            image: getField(page, 'main_image')?.data?.attributes?.url || getField(page, 'image')
        }));
    } catch (error) {
        console.error('Erreur recherche pages:', error);
        return [];
    }
}

export async function searchBlog(query: string): Promise<SearchResult[]> {
    try {
        const data = await getRequest(`articles?filters[$or][0][title][$containsi]=${encodeURIComponent(query)}&filters[$or][1][description][$containsi]=${encodeURIComponent(query)}&populate=*`);
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.map((article: any) => ({
            id: (article.id || article?.attributes?.id)?.toString(),
            type: 'blog' as const,
            title: getField(article, 'title') || getField(article, 'name'),
            description: getField(article, 'description'),
            url: `/blog/${getField(article, 'slug') || article.id || article?.attributes?.id}`,
            image: getField(article, 'mainImage')?.data?.attributes?.url || getField(article, 'image')
        }));
    } catch (error) {
        console.error('Erreur recherche blog:', error);
        return [];
    }
}

export async function searchCategories(query: string): Promise<SearchResult[]> {
    try {
        const data = await getRequest(`categories?filters[name][$containsi]=${encodeURIComponent(query)}&populate=*`);
        if (!data?.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.map((category: any) => ({
            id: (category.id || category?.attributes?.id)?.toString(),
            type: 'category' as const,
            title: getField(category, 'title') || getField(category, 'name'),
            description: getField(category, 'description'),
            url: `/products?category=${getField(category, 'slug') || category.id || category?.attributes?.id}`,
            image: getField(category, 'image')?.data?.attributes?.url || getField(category, 'image')
        }));
    } catch (error) {
        console.error('Erreur recherche catégories:', error);
        return [];
    }
}

export async function performGlobalSearch(query: string): Promise<SearchResult[]> {
    try {
        const [productResults, pageResults, blogResults, categoryResults] = await Promise.all([
            searchProducts(query),
            searchPages(query),
            searchBlog(query),
            searchCategories(query)
        ]);
        const allResults = [
            ...productResults,
            ...pageResults,
            ...blogResults,
            ...categoryResults
        ];
        const typeOrder = { product: 0, category: 1, page: 2, blog: 3 };
        const sortedResults = allResults.sort((a, b) => {
            return typeOrder[a.type] - typeOrder[b.type];
        });
        return sortedResults.slice(0, 10);
    } catch (error) {
        console.error('Erreur recherche globale:', error);
        return [];
    }
} 