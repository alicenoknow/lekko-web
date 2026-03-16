'use client';

import { DialogTitle } from '@headlessui/react';
import EditQuestionRenderer from './EditQuestionRenderer';
import { txt } from '@/nls/texts';
import { Question } from '@/types/questions';
import { BaseDialog, DIALOG_PANEL_LG } from '@/components/BaseDialog';

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
        if (questionId >= 0) onDelete(questionId);
        setOpen(false);
    };

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={() => setOpen(false)}
            contentClassName='flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-4'
            panelClassName={DIALOG_PANEL_LG}
        >
            <div className='bg-primary-light px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                    <DialogTitle as='h3' className='text-xl font-bold uppercase'>
                        {txt.questions.modalTitle}
                    </DialogTitle>
                    <EditQuestionRenderer
                        question={question}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </BaseDialog>
    );
}
