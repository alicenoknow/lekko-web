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
            <div className='bg-primary-light flex flex-1 flex-col'>
                <div className='flex flex-1 justify-center px-4 py-8 md:px-6 md:py-12'>
                    <div className='flex w-full max-w-4xl flex-col space-y-6'>
                        {children}
                    </div>
                </div>
            </div>
            <LazyErrorDialog />
        </PrivateContent>
    );
}
