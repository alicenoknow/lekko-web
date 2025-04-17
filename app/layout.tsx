import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/navbar/NavBar';
import { HydrateUser } from '@/components/auth/HydrateUser';

const font = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Lekkoatletawka',
    description: 'lekko',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='pl'>
            <body className={font.className}>
                <div className='flex min-h-screen flex-col justify-between'>
                    <HydrateUser />
                    <NavBar />
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    );
}
