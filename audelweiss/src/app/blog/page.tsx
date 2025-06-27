import { fetchArticles } from "@/services/blog";
import { Article } from '@/types/blog';
import ArticleCard from '@/components/blog/ArticleCard';

export default async function ArticlesPage() {
    const articles: Article[] = await fetchArticles();

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Nos articles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </main>
    );
}
