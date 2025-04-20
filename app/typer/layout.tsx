import { PrivateContent } from '@/components/auth/PrivateContent';
import Spinner from '@/components/Spinner';
import QueryProvider from '@/context/QueryProvider';

export default function TyperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <PrivateContent redirect fallback={<Spinner />}>
                <div className='flex min-h-screen justify-center'>
                    <div className='w-full max-w-4xl space-y-6'>{children}</div>
                </div>
            </PrivateContent>
        </QueryProvider>
    );
}
