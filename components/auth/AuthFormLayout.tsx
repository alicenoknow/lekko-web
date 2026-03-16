'use client';

interface AuthFormLayoutProps {
    title: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    actions: React.ReactNode;
    children: React.ReactNode;
}

export function AuthFormLayout({
    title,
    onSubmit,
    actions,
    children,
}: AuthFormLayoutProps) {
    return (
        <div className='common-page-wrapper'>
            <div className='common-page-content'>
                <form className='common-page-stack' onSubmit={onSubmit}>
                    <h1 className='common-page-title'>{title}</h1>
                    {children}
                    <div className='common-page-actions'>{actions}</div>
                </form>
            </div>
        </div>
    );
}
