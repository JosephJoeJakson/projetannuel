import type { ReactNode } from 'react';
import '../app/global.css';

export const metadata = {
    title: 'Audelweiss',
    description: 'Boutique Audelweiss en ligne',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr">
        <body>{children}</body>
        </html>
    );
}
