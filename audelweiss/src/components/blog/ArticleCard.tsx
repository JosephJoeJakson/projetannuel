'use client';

import { Article } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
    article: Article;
}

export default function ArticleCard({ article }: Props) {
    const { title, slug, description, mainImage, publishedDate } = article;

    const imageUrl = mainImage ? `http://localhost:3090${mainImage.formats?.medium?.url || mainImage.url}` : '';

    return (
        <Link href={`/blog/${slug}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={mainImage?.alternativeText || title}
                        width={750}
                        height={422}
                        className="w-full h-48 object-cover"
                    />
                )}
                <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{publishedDate}</p>
                    <h2 className="text-lg font-semibold mb-2">{title}</h2>
                    <p className="text-sm text-gray-700">{description}</p>
                </div>
            </div>
        </Link>
    );
}
