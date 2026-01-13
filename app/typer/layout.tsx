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
            <div className='flex min-h-screen justify-center p-6'>
                <div className='w-full max-w-4xl space-y-6'>{children}</div>
            </div>
            <LazyErrorDialog />
        </PrivateContent>
    );
}
