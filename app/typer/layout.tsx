import { PrivateContent } from '@/components/auth/PrivateContent';
import LazyErrorDialog from '@/components/error/LazyErrorDialog';
import Spinner from '@/components/Spinner';

export default function TyperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PrivateContent redirect fallback={<Spinner />}>
            <div className='bg-primary-light min-h-screen'>
                <div className='flex justify-center px-4 py-8 md:px-6 md:py-12'>
                    <div className='w-full max-w-4xl space-y-6'>{children}</div>
                </div>
            </div>
            <LazyErrorDialog />
        </PrivateContent>
    );
}
