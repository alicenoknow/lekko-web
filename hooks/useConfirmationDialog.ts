import { useState } from 'react';

export function useConfirmationDialog<T>(onConfirm: (item: T) => void) {
    const [isOpen, setIsOpen] = useState(false);
    const [item, setItem] = useState<T | null>(null);

    const openDialog = (item: T) => {
        setItem(item);
        setIsOpen(true);
    };

    const handleConfirm = () => {
        if (item !== null) onConfirm(item);
        setIsOpen(false);
        setItem(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setItem(null);
    };

    return { isOpen, item, openDialog, handleConfirm, handleCancel };
}
