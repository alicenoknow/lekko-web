'use client';

import ConfirmationDialog from './ConfirmationDialog';

interface LazyConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel: string;
    cancelLabel: string;
}

export default function LazyConfirmationDialog(
    props: LazyConfirmationDialogProps
) {
    return <ConfirmationDialog {...props} />;
}
