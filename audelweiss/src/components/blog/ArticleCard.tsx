'use client';

import { Article } from '@/types/blog';
import { getStrapiMedia } from '@/utils/strapi';
import Link from 'next/link';
import Placeholder from '../common/Placeholder';

interface ArticleCardProps {
    article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
    const imageUrl = getStrapiMedia(article.mainImage?.url);
    
    return (
        <article className="card">
            <Link href={`/blog/${article.slug}`} className="card__image-container">
                {imageUrl ? (
                    <img src={imageUrl} alt={article.title} className="card__image" />
                ) : (
                    <Placeholder className="card__image" />
                )}
            </Link>

            <div className="card__body">
                <h3 className="card__title">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="card__description">{article.description}</p>

                <div className="card__footer">
                    <Link href={`/blog/${article.slug}`} className="btn btn-primary">
                        Lire l'article
                    </Link>
                </div>
            </div>
        </article>
    );
}
