import type { ReactNode } from 'react';
import '@/styles/global.scss';
import Header from "@/components/header/Header";

export const metadata = {
    title: 'Audelweiss',
    description: 'Boutique Audelweiss en ligne',
};

<<<<<<< HEAD
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
=======
export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="fr">
        <body>
        <Header/>
>>>>>>> 1fea016c6d752b6dab430bfc73825ef24092fd4d
        {children}
        </body>
        </html>
    );
}
