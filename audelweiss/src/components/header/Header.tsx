'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { fetchGlobal } from '@/services/global';
import { GlobalData } from '@/types/global';
import { ShoppingCart, UserRound, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const pathname = usePathname();
    const [global, setGlobal] = useState<GlobalData | null>(null);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const { isLoggedIn, logout } = useAuth();

    useEffect(() => {
        fetchGlobal().then(setGlobal).catch(console.error);
    }, []);

    const links = global?.navigation?.link?.filter(link => link.isOnline);
    const logo = global?.navigation?.logo;
    const megaMenu = global?.navigation?.megaMenu;

    const logoUrl = logo?.url
        ? `http://localhost:3090${logo.url}`
        : null;

    return (
        <header className="header">
            <div className="header__container">
                <Link href="/" className="header__logo">
                    {logoUrl && (
                        <img src={logoUrl} alt="Logo" />
                    )}
                </Link>

                <nav className="header__nav">
                    {links?.map((item) => {
                        const isMegaMenuItem = item.name === megaMenu?.title;

                        return (
                            <div
                                key={item.url}
                                onMouseEnter={() => isMegaMenuItem && setShowMegaMenu(true)}
                                onMouseLeave={() => isMegaMenuItem && setShowMegaMenu(false)}
                                className="relative"
                            >
                                <Link
                                    href={item.url}
                                    className={`header__link ${pathname === item.url ? 'active' : ''}`}
                                    target={item.isExternal ? '_blank' : '_self'}
                                >
                                    {item.name}
                                </Link>

                                {isMegaMenuItem && showMegaMenu && (
                                    <div className={`mega-menu ${showMegaMenu ? 'active' : ''}`}>
                                        <div className="mega-menu__container">
                                            {megaMenu?.categories && megaMenu.categories.filter(cat => cat.isOnline).length > 0 && (
                                                <div>
                                                    <h4 className="mega-menu__title">Nos catégories</h4>
                                                    <ul className="mega-menu__list">
                                                        {megaMenu.categories
                                                            .filter(cat => cat.isOnline)
                                                            .map(cat => (
                                                                <li key={cat.url}>
                                                                    <Link href={cat.url}>{cat.name}</Link>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {megaMenu?.trends && megaMenu.trends.filter(trend => trend.isOnline).length > 0 && (
                                                <div>
                                                    <h4 className="mega-menu__title">Tendances</h4>
                                                    <ul className="mega-menu__list">
                                                        {megaMenu.trends
                                                            .filter(trend => trend.isOnline)
                                                            .map(trend => (
                                                                <li key={trend.url}>
                                                                    <Link href={trend.url}>{trend.name}</Link>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            )}

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="header__icons">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard" title="Mon Compte">
                                <UserRound className="header__icon" />
                            </Link>
                            <button onClick={logout} title="Déconnexion" className="bg-transparent border-none cursor-pointer p-0">
                                <LogOut className="header__icon" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="header__link">
                                Connexion
                            </Link>
                            <Link href="/register" className="header__link">
                                S'inscrire
                            </Link>
                        </>
                    )}
                    <Link href="/cart">
                        <ShoppingCart id="cart-icon" className="header__icon" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
