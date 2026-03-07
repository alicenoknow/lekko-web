'use client';

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import ActionButton from '../buttons/ActionButton';

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
        <Dialog open={isOpen} onClose={onCancel} className='relative z-10'>
            <DialogBackdrop
                transition
                className='bg-grey/75 fixed inset-0 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in'
            />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-center justify-center p-4 text-center sm:p-0'>
                    <DialogPanel
                        transition
                        className='bg-primary-light relative w-full max-w-sm transform overflow-hidden rounded-xl text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 data-closed:sm:translate-y-0 data-closed:sm:scale-95'
                    >
                        <div className='bg-primary-light px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                            <div className='flex flex-col items-center gap-4'>
                                <FaExclamationTriangle
                                    size={40}
                                    className='text-dark-red'
                                />
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
                                    <ActionButton
                                        label={cancelLabel}
                                        onClick={onCancel}
                                    />
                                    <ActionButton
                                        label={confirmLabel}
                                        onClick={onConfirm}
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
