import Spinner from '@/components/Spinner';

interface LoadingStateProps {
    className?: string;
}

export function LoadingState({ className }: LoadingStateProps) {
    return (
        <div className={className ?? 'flex flex-1 items-center justify-center'}>
            <Spinner />
        </div>
    );
}
