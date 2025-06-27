import {getRequest} from "../../lib/strapi";
import {Article} from "@/types/blog";

export async function fetchArticles(): Promise<Article[]> {
    const data = await getRequest('articles?populate=*');
    return data?.data || [];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
    const data = await getRequest(
        `articles?filters[slug][$eq]=${slug}&populate[]=mainImage&populate[]=author&populate[]=article_category`
    );
    return data?.data?.[0];
}
