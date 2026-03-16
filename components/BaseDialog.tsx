'use client';

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

const PANEL_BASE =
    'relative w-full transform overflow-hidden rounded-xl bg-primary-light text-left shadow-xl transition-all sm:my-8 data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95';

export const DIALOG_PANEL_SM = `${PANEL_BASE} max-w-sm`;
export const DIALOG_PANEL_LG = `${PANEL_BASE} sm:max-w-3xl`;

interface BaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    dialogClassName?: string;
    contentClassName?: string;
    panelClassName?: string;
}

export function BaseDialog({
    isOpen,
    onClose,
    children,
    dialogClassName = 'relative z-10',
    contentClassName = 'flex min-h-full items-center justify-center p-4 text-center sm:p-0',
    panelClassName = DIALOG_PANEL_SM,
}: BaseDialogProps) {
    return (
        <Dialog open={isOpen} onClose={onClose} className={dialogClassName}>
            <DialogBackdrop
                transition
                className='bg-grey/75 fixed inset-0 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in'
            />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className={contentClassName}>
                    <DialogPanel transition className={panelClassName}>
                        {children}
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
