import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/navbar/NavBar';

const inter = Inter({ subsets: ['latin'] });

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
        <html lang='en'>
            <body className={inter.className}>
                <div className='flex min-h-screen flex-col justify-between'>
                    <NavBar />
                    {children}
                    <Footer />
                </div>
            </body>
        </html>
    );
}
