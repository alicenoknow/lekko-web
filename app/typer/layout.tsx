import QueryProvider from '@/lib/QueryProvider';

export default function TyperLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <QueryProvider>{children}</QueryProvider>;
}
