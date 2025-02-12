'use client';

import React from 'react';
import { Answer, Question } from '@/types';

interface QuestionOverviewProps {
    question: Question;
    answer: Answer;
}

const QuestionOverview = ({ question, answer }: QuestionOverviewProps) => {
    return (
        <div>
            {question.disciplineId}
            {answer.answerId}
        </div>
    );
};

export default QuestionOverview;
