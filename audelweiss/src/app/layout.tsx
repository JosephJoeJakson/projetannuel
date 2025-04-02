import type { ReactNode } from 'react';
import '@/styles/global.scss';
import Header from "@/components/header/Header";

export const metadata = {
    title: 'Audelweiss',
    description: 'Boutique Audelweiss en ligne',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <Header/>
        {children}
        </body>
        </html>
    );
}
