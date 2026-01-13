'use client';

import { Fragment } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
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
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={onCancel}>
                <TransitionChild
                    as={Fragment}
                    enter='ease-out duration-200'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-150'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='bg-opacity-25 fixed inset-0 bg-black' />
                </TransitionChild>

                <div className='fixed inset-0 flex items-center justify-center p-4'>
                    <TransitionChild
                        as={Fragment}
                        enter='ease-out duration-200'
                        enterFrom='opacity-0 scale-95'
                        enterTo='opacity-100 scale-100'
                        leave='ease-in duration-150'
                        leaveFrom='opacity-100 scale-100'
                        leaveTo='opacity-0 scale-95'
                    >
                        <DialogPanel className='w-full max-w-sm transform overflow-hidden rounded-md bg-white p-6 text-left align-middle shadow-xl transition-all'>
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
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
