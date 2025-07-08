'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    showHome?: boolean;
}

export default function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
    const pathname = usePathname();

    const pagesWithCustomBreadcrumb = [
        '/products/[id]',
        '/blog/[slug]',
    ];

    const hasCustomBreadcrumb = pagesWithCustomBreadcrumb.some(pattern => {
        if (pattern.includes('[') && pattern.includes(']')) {
            const patternSegments = pattern.split('/').filter(s => s !== '');
            const pathSegments = pathname.split('/').filter(s => s !== '');
            
            if (patternSegments.length !== pathSegments.length) return false;
            
            return patternSegments.every((segment, index) => {
                if (segment.startsWith('[') && segment.endsWith(']')) {
                    return true;
                }
                return segment === pathSegments[index];
            });
        }
        return pathname === pattern;
    });

    if (hasCustomBreadcrumb) {
        return null;
    }

    const generateBreadcrumbItems = (): BreadcrumbItem[] => {
        const segments = pathname.split('/').filter(segment => segment !== '');
        
        if (segments.length === 0) {
            return showHome ? [{ label: 'Accueil', href: '/' }] : [];
        }

        const breadcrumbItems: BreadcrumbItem[] = [];
        let currentPath = '';

        if (showHome) {
            breadcrumbItems.push({ label: 'Accueil', href: '/', icon: '🏠' });
        }

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            
            const label = getSegmentLabel(segment, segments, index);
            const icon = getSegmentIcon(segment);
            
            const href = index === segments.length - 1 ? undefined : currentPath;
            
            breadcrumbItems.push({ label, href, icon });
        });

        return breadcrumbItems;
    };

    const breadcrumbItems = items || generateBreadcrumbItems();

    if (breadcrumbItems.length <= 1) {
        return null;
    }

    return (
        <nav className="breadcrumb-nav py-3 px-4">
            <div className="container mx-auto">
                <ol className="breadcrumb-list">
                    {breadcrumbItems.map((item, index) => (
                        <li key={index} className="breadcrumb-item">
                            {index > 0 && (
                                <svg 
                                    className="breadcrumb-separator w-4 h-4" 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                                        clipRule="evenodd" 
                                    />
                                </svg>
                            )}
                            
                            {item.href ? (
                                <Link 
                                    href={item.href}
                                    className="breadcrumb-link"
                                >
                                    {item.icon && <span className="icon">{item.icon}</span>}
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="breadcrumb-current">
                                    {item.icon && <span className="icon">{item.icon}</span>}
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}

function getSegmentLabel(segment: string, allSegments: string[], index: number): string {
    const segmentMap: { [key: string]: string } = {
        'products': 'Produits',
        'product': 'Produit',
        'cart': 'Panier',
        'checkout': 'Commande',
        'login': 'Connexion',
        'register': 'Inscription',
        'dashboard': 'Mon Compte',
        'blog': 'Blog',
        'contact': 'Contact',
        'merci': 'Confirmation',
        'test-pages': 'Pages de Test',
        'pages': 'Pages'
    };

    if (segment.match(/^\d+$/) && allSegments.includes('products')) {
        return 'Détails';
    }

    if (allSegments.includes('blog') && index > 0) {
        return 'Article';
    }

    return segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function getSegmentIcon(segment: string): string {
    const iconMap: { [key: string]: string } = {
        'products': '🛍️',
        'product': '📦',
        'cart': '🛒',
        'checkout': '💳',
        'login': '🔐',
        'register': '📝',
        'dashboard': '👤',
        'blog': '📰',
        'contact': '📞',
        'merci': '✅',
        'test-pages': '🧪',
        'pages': '📄'
    };

    return iconMap[segment] || '📄';
} 