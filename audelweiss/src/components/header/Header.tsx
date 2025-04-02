'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, UserRound } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { label: 'ACCUEIL', href: '/' },
    { label: 'BOUTIQUE', href: '/boutique' },
    { label: 'CRÉATIONS', href: '/creations' },
    { label: 'À PROPOS', href: '/a-propos' },
    { label: 'BLOG', href: '/blog' },
];

export default function Header() {
    const pathname = usePathname();
    const [showMegaMenu, setShowMegaMenu] = useState(false);

    return (
        <header className="header">
            <div className="header__container">
                <Link href="/" className="header__logo">
                    <img src="/img/logo-wide.svg" alt="Audelweiss Logo" />
                </Link>

                <nav className="header__nav">
                    {navItems.map((item) => (
                        <div
                            key={item.href}
                            onMouseEnter={() => item.label === 'BOUTIQUE' && setShowMegaMenu(true)}
                            onMouseLeave={() => item.label === 'BOUTIQUE' && setShowMegaMenu(false)}
                            className="relative"
                        >
                            <Link
                                href={item.href}
                                className={`header__link ${
                                    pathname === item.href ? 'active' : ''
                                }`}
                            >
                                {item.label}
                            </Link>

                            {/* Mega menu */}
                            {item.label === 'BOUTIQUE' && showMegaMenu && (
                                <div className="mega-menu">
                                    <div className="mega-menu__container">
                                        <div>
                                            <h4 className="mega-menu__title">Nos catégories</h4>
                                            <ul className="mega-menu__list">
                                                <li><Link href="/">Bonnets</Link></li>
                                                <li><Link href="/">Écharpes</Link></li>
                                                <li><Link href="/">Chapeaux</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="mega-menu__title">Tendances</h4>
                                            <ul className="mega-menu__list">
                                                <li><Link href="/">Nouveautés</Link></li>
                                                <li><Link href="/">Promotions</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="header__icons">
                    <Link href="/">
                        <UserRound className="header__icon" />
                    </Link>
                    <Link href="/">
                        <ShoppingCart className="header__icon" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
