import type { Metadata } from 'next';
import { PrivateContent } from '@/components/auth/PrivateContent';
import Spinner from '@/components/Spinner';

export const metadata: Metadata = {
    title: 'Ranking | Lekkoatletawka',
};

export default function RankingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PrivateContent redirect fallback={<Spinner />}>
            <div className='bg-primary-light min-h-full'>
                <div className='flex justify-center px-4 py-8 md:px-6 md:py-12'>
                    <div className='w-full max-w-4xl space-y-6'>{children}</div>
                </div>
            </div>
        </PrivateContent>
    );
}
