'use client';

import { DialogTitle } from '@headlessui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import ActionButton from '../buttons/ActionButton';
import { useErrorStore } from '@/store/error';
import { txt } from '@/nls/texts';
import { BaseDialog } from '@/components/BaseDialog';

export default function ErrorDialog() {
    const { isDialogVisible, errorMessage, hideErrorDialog } = useErrorStore();

    return (
        <BaseDialog
            isOpen={isDialogVisible}
            onClose={hideErrorDialog}
            dialogClassName='relative z-50'
        >
            <div className='bg-primary-light px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                <div className='flex flex-col items-center gap-4'>
                    <FaExclamationTriangle size={40} className='text-dark-red' />
                    <DialogTitle
                        as='h3'
                        className='text-primary-dark text-center text-lg font-semibold'
                    >
                        {errorMessage ?? txt.errors.errorMessage}
                    </DialogTitle>
                    <ActionButton label='OK' onClick={hideErrorDialog} />
                </div>
            </div>
        </BaseDialog>
    );
}
