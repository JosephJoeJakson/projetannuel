'use client';

import Breadcrumb from '@/components/common/Breadcrumb';
import { Product } from '@/types/product';

interface ProductBreadcrumbProps {
    product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
    const items = [
        { label: 'Accueil', href: '/', icon: '🏠' },
        { label: 'Produits', href: '/products', icon: '🛍️' },
        { label: product.name, icon: '📦' }
    ];

    return <Breadcrumb items={items} showHome={false} />;
} 