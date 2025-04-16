import { PrivateContent } from '@/components/auth/PrivateContent';
import QueryProvider from '@/lib/QueryProvider';

export default function TyperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <PrivateContent>
            <QueryProvider>{children}</QueryProvider>
        </PrivateContent>
    );
}
