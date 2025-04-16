import QueryProvider from '@/lib/QueryProvider';

export default function ResultsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <QueryProvider>{children}</QueryProvider>;
}
