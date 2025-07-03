import { Page } from '@/types/page';
import { getRequest } from "../../lib/strapi";

export async function fetchPages(): Promise<Page[]> {
    const query = [
        'filters[isPublished][$eq]=true',
        'populate[featuredImage]=true',
        'sort[0]=createdAt:desc'
    ].join('&');

    const data = await getRequest(`pages?${query}`);
    return data?.data || [];
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
    const query = [
        `filters[slug][$eq]=${slug}`,
        'filters[isPublished][$eq]=true',
        'populate[blocks][on][page-blocks.text-block][populate]=*',
        'populate[blocks][on][page-blocks.image-block][populate][image]=true',
        'populate[blocks][on][page-blocks.video-block][populate]=*',
        'populate[blocks][on][page-blocks.document-block][populate]=*',
        'populate[blocks][on][page-blocks.hero-block][populate][backgroundImage]=true',
        'populate[blocks][on][page-blocks.columns-block][populate][columns][populate][image]=true',
        'populate[blocks][on][page-blocks.cta-block][populate][backgroundImage]=true',
        'populate[blocks][on][page-blocks.cta-block][populate][buttons]=true',
        'populate[featuredImage]=true'
    ].join('&');

    const data = await getRequest(`pages?${query}`);
    console.log('Page data for slug', slug, ':', data);
    return data?.data?.[0] || null;
}

export async function fetchPageById(id: string): Promise<Page | null> {
    const query = [
        `filters[id][$eq]=${id}`,
        'populate[blocks][populate][image]=true',
        'populate[blocks][populate][backgroundImage]=true',
        'populate[blocks][populate][videoFile]=true',
        'populate[blocks][populate][document]=true',
        'populate[blocks][populate][columns][populate][image]=true',
        'populate[blocks][populate][buttons]=true',
        'populate[featuredImage]=true'
    ].join('&');

    const data = await getRequest(`pages?${query}`);
    return data?.data?.[0] || null;
}

export async function fetchPageMetadata(slug: string) {
    const query = [
        `filters[slug][$eq]=${slug}`,
        'filters[isPublished][$eq]=true'
    ].join('&');

    const data = await getRequest(`pages?${query}`);
    const page = data?.data?.[0];
    
    if (page) {
        return {
            title: page.metaTitle || page.title,
            description: page.metaDescription,
            slug: page.slug
        };
    }

    return null;
} 