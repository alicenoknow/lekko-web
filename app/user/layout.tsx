import QueryProvider from '@/context/QueryProvider';

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <QueryProvider>{children}</QueryProvider>;
}
