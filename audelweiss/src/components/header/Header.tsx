'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchGlobal } from '@/services/global';
import { GlobalData } from '@/types/global';
import { ShoppingCart, UserRound } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();
    const [global, setGlobal] = useState<GlobalData | null>(null);
    const [showMegaMenu, setShowMegaMenu] = useState(false);

    useEffect(() => {
        fetchGlobal().then((data) => {
            console.log('[Global STRAPI]', data);
            setGlobal(data);
        }).catch(console.error);
    }, []);

    const links = global?.navigation?.link?.filter(link => link.isOnline);
    const logoUrl = global?.navigation?.logo?.url
        ? `http://localhost:3090${global.navigation.logo.url}`
        : null;

    return (
        <header className="header">
            <div className="header__container">
                {/* Logo */}
                <Link href="/" className="header__logo">
                    {logoUrl && <img src={logoUrl} alt="Logo" />}
                </Link>

                {/* Menu */}
                <nav className="header__nav">
                    {links?.map((item) => (
                        <div
                            key={item.url}
                            onMouseEnter={() => item.name === 'Nos produits' && setShowMegaMenu(true)}
                            onMouseLeave={() => item.name === 'Nos produits' && setShowMegaMenu(false)}
                            className="relative"
                        >
                            <Link
                                href={item.url}
                                className={`header__link ${pathname === item.url ? 'active' : ''}`}
                                target={item.isExternal ? '_blank' : '_self'}
                            >
                                {item.name}
                            </Link>

                            {/* Mega menu (optionnel) */}
                            {item.name === 'Nos produits' && showMegaMenu && (
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

                {/* Icons */}
                <div className="header__icons">
                    <Link href="/login">
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
