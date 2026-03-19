import type { Metadata } from 'next';
import { Coda } from 'next/font/google';
import './globals.css';
import Footer from '@/components/Footer';
import NavBar from '@/components/navbar/NavBar';
import { HydrateUser } from '@/components/auth/HydrateUser';
import QueryProvider from '@/context/QueryProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

const font = Coda({ subsets: ['latin'], weight: "400" });

export const metadata: Metadata = {
    title: 'Lekkoatletawka',
    description: 'Lekkoatletawka lekkoatletyka',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='pl'>
            <body className={font.className}>
                <ErrorBoundary>
                    <QueryProvider>
                        <div className='flex h-screen flex-col overflow-hidden'>
                            <HydrateUser />
                            <NavBar />
                            <main className='flex flex-1 flex-col overflow-y-auto'>
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </QueryProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
