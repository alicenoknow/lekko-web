'use client';

import { DialogTitle } from '@headlessui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import ActionButton from '../buttons/ActionButton';
import { BaseDialog } from '@/components/BaseDialog';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
}

export default function ConfirmationDialog({
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
}: ConfirmationDialogProps) {
    return (
        <BaseDialog isOpen={isOpen} onClose={onCancel}>
            <div className='bg-primary-light px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='flex flex-col items-center gap-4'>
                    <FaExclamationTriangle size={40} className='text-dark-red' />
                    <DialogTitle
                        as='h3'
                        className='text-primary-dark text-center text-lg font-semibold'
                    >
                        {title}
                    </DialogTitle>
                    {description && (
                        <p className='text-primary-dark text-center text-sm'>
                            {description}
                        </p>
                    )}
                    <div className='mt-4 flex w-full justify-center gap-4'>
                        <ActionButton label={cancelLabel} onClick={onCancel} />
                        <ActionButton label={confirmLabel} onClick={onConfirm} />
                    </div>
                </div>
            </div>
        </BaseDialog>
    );
}
