'use client';

import Breadcrumb from '@/components/common/Breadcrumb';
import { Article } from '@/types/blog';

interface BlogBreadcrumbProps {
    post: Article;
}

export default function BlogBreadcrumb({ post }: BlogBreadcrumbProps) {
    const items = [
        { label: 'Accueil', href: '/', icon: '🏠' },
        { label: 'Blog', href: '/blog', icon: '📰' },
        { label: post.title, icon: '📄' }
    ];

    return <Breadcrumb items={items} showHome={false} />;
} 