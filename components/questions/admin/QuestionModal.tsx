'use client';

import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
} from '@headlessui/react';
import { Question } from '@/app/api/typer';
import EditQuestionRenderer from './EditQuestionRenderer';
import { txt } from '@/nls/texts';

interface Props {
    question: Question;
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
    onSubmit: (question: Question) => void;
    onDelete: (questionId: number) => void;
}

export default function QuestionModal({
    question,
    isOpen,
    setOpen,
    onSubmit,
    onDelete,
}: Props) {
    const handleSubmit = (question: Question) => {
        onSubmit(question);
        setOpen(false);
    };

    const handleDelete = (questionId: number) => {
        onDelete(questionId);
        setOpen(false);
    };

    return (
        <Dialog open={isOpen} onClose={setOpen} className='relative z-10'>
            <DialogBackdrop
                transition
                className='data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity'
            />
            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <DialogPanel
                        transition
                        className='data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative max-w-3xl transform rounded-lg bg-primaryLight text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl'
                    >
                        <div className='bg-primaryLight px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                            <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                                <DialogTitle
                                    as='h3'
                                    className='text-xl font-bold uppercase'
                                >
                                    {txt.questions.modalTitle}
                                </DialogTitle>
                                <EditQuestionRenderer
                                    question={question}
                                    onSubmit={handleSubmit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
