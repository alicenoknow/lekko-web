import QueryProvider from '@/lib/QueryProvider';

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <QueryProvider>{children}</QueryProvider>;
}
