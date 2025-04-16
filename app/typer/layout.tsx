import { PrivateContent } from '@/components/auth/PrivateContent';
import Spinner from '@/components/Spinner';
import QueryProvider from '@/lib/QueryProvider';

export default function TyperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryProvider>
            <PrivateContent redirect fallback={<Spinner />}>
                {children}
            </PrivateContent>
        </QueryProvider>
    );
}
