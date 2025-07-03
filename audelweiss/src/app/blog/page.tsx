'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types/blog';
import { fetchArticles } from '@/services/blog';
import ArticleCard from '@/components/blog/ArticleCard';
import SectionTitle from '@/components/common/SectionTitle';

export default function BlogPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        fetchArticles().then(setArticles);
    }, []);

    return (
        <main className="max-w-7xl mx-auto px-4 py-12 blog-page">
            <header className="blog-page__header">
                <SectionTitle>Notre Blog</SectionTitle>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Découvrez nos derniers articles, conseils et actualités.
                </p>
            </header>

            <div className="blog-page__grid">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </main>
    );
}
