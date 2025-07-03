'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchFooterMenu, fetchFooterHelpMenu } from '@/services/global';

export default function Footer({ global }: { global: any }) {
    const [footerLinks, setFooterLinks] = useState<any[]>([]);
    const [footerHelpLinks, setFooterHelpLinks] = useState<any[]>([]);
    const socialLinks = global?.socialLinks || [];

    useEffect(() => {
        fetchFooterMenu().then(setFooterLinks);
        fetchFooterHelpMenu().then(setFooterHelpLinks);
    }, []);
    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__col footer__col--left">
                    <h3 className="footer__title">Besoin d'aide ?</h3>
                    <ul className="footer__list">
                        {footerHelpLinks.filter(l => l.isOnline).map((item) => (
                            <li key={item.url}>
                                <Link
                                    href={item.url}
                                    className="footer__link"
                                    target={item.isExternal ? '_blank' : '_self'}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer__col footer__col--center">
                    <div className="footer__logo-block">
                        <img src="/logo-audelweiss.svg" alt={global?.siteTitle || "Audelweiss Craft"} className="footer__logo" />
                        <div className="footer__brand">
                            {global?.siteTitle || "AUDELWEISS"} <span>craft</span>
                        </div>
                    </div>
                    <p className="footer__desc">
                        {global?.siteDescription || "Chaque pièce est imaginée et réalisée à la main dans les Hautes-Alpes, avec passion et créativité. Un mélange d'authenticité, d'expérimentation et d'énergie positive pour apporter douceur et harmonie à votre quotidien."}
                        <br /><br />
                        Retrouvez-moi sur Instagram pour suivre les actus 🧶✨
                    </p>
                    <div className="footer__socials">
                        {socialLinks.map((link: any) => (
                            <a
                                key={link.url}
                                href={link.url}
                                aria-label={link.name}
                                className="footer__social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.icon === 'instagram' && (
                                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm5 2a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm6.5 1a1 1 0 100 2 1 1 0 000-2z"></path></svg>
                                )}
                                {link.icon === 'tiktok' && (
                                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none"><g><path fill="#fff" d="M0 0h48v48H0z" fillOpacity="0"/><path d="M41.5 17.5c-3.6 0-6.5-2.9-6.5-6.5h-4.5v22.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.7 0 1.4.2 2 .5v-4.3c-.7-.1-1.3-.2-2-.2-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V21.2c1.9 1.2 4.1 1.8 6.5 1.8v-5.5z" fill="#e8a499"/></g></svg>
                                )}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="footer__col footer__col--right">
                    <h3 className="footer__title">Liens utiles</h3>
                    <ul className="footer__list">
                        {footerLinks.filter(l => l.isOnline).map((item) => (
                            <li key={item.url}>
                                <Link
                                    href={item.url}
                                    className="footer__link"
                                    target={item.isExternal ? '_blank' : '_self'}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="footer__bottom">
                <span>2025 © AUDELWEISS Craft – Site réalisé par <a href="#" className="footer__author">Audrey HOSSEPIAN</a></span>
            </div>
        </footer>
    );
} 