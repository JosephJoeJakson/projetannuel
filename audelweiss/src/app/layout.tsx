import type { ReactNode } from 'react';
import '@/styles/global.scss';
import Header from "@/components/header/Header";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "@/components/common/Footer";
import { fetchGlobalFull } from '@/services/global';

export const metadata = {
    title: 'Audelweiss',
    description: 'Boutique Audelweiss en ligne',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
    const globalData = await fetchGlobalFull();
    return (
        <html lang="fr">
            <body>
                <AuthProvider>
                    <Header/>
                    {children}
                    <Footer global={globalData} />
                </AuthProvider>
            </body>
        </html>
    );
}
