import { fetchArticleBySlug } from '@/services/blog';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ArticleContent from '@/components/blog/ArticleContent';

interface Params {
    params: {
        slug: string;
    };
}

export default async function ArticleDetailPage({ params }: Params) {
    const article = await fetchArticleBySlug(params.slug);
    if (!article) return notFound();

    const image = article.mainImage;
    const imageUrl = image ? `http://localhost:3090${image.url}` : '';

    return (
        <main className="container mx-auto px-4 py-8">
            <article className="prose max-w-4xl mx-auto">
                <h1>{article.title}</h1>
                {article.publishedDate && (
                    <p className="text-sm text-gray-500 mb-4">{article.publishedDate}</p>
                )}

                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={image.alternativeText || article.title}
                        width={800}
                        height={400}
                        className="w-full h-auto rounded mb-6"
                    />
                )}

                <ArticleContent content={article.content} />

                <hr className="my-8" />
                <p className="text-sm text-gray-500">
                    Rédigé par <strong>{article.author?.name}</strong> — Catégorie : <em>{article.article_category?.name}</em>
                </p>
            </article>
        </main>
    );
}
