import QueryProvider from '@/context/QueryProvider';

export default function ResultsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <QueryProvider>{children}</QueryProvider>;
}
