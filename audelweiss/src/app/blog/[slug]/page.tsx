import { fetchArticleBySlug } from '@/services/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ArticleContent from '@/components/blog/ArticleContent';
import { getStrapiMedia } from '@/utils/strapi';
import Link from 'next/link';

interface Params {
    params: {
        slug: string;
    };
}

export default async function ArticleDetailPage({ params }: Params) {
    const article = await fetchArticleBySlug(params.slug);
    if (!article) return notFound();

    const imageUrl = getStrapiMedia(article.mainImage?.url);

    return (
        <main className="max-w-7xl mx-auto px-4 py-12">
            <article className="article-page">
                <header className="article-page__header">
                    <h1 className="article-page__title">{article.title}</h1>
                    <p className="article-page__meta">
                        Publié le {new Date(article.publishedDate).toLocaleDateString('fr-FR')}
                        {article.author && ` par ${article.author.name}`}
                    </p>
                </header>

                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={article.mainImage?.alternativeText || article.title}
                        width={1200}
                        height={600}
                        className="article-page__featured-image"
                        priority
                    />
                )}

                <div className="article-page__content">
                    <ArticleContent content={article.content} />
                </div>
                
                <footer className="article-page__footer">
                    <p>
                        Catégorie : 
                        <Link href={`/blog?category=${article.article_category?.slug}`} className="text-primary hover:underline">
                            {article.article_category?.name || 'Non classée'}
                        </Link>
                    </p>
                </footer>
            </article>
        </main>
    );
}
