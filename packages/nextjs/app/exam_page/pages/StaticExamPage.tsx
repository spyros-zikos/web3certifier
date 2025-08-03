import React, { useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { MessageForUser, Question } from "../_components";


const StaticExamPage = ({
    exam, message
}: {
    exam: Exam | undefined, message: any
}) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    return (
        <>
            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={false} />

            <IndexSelector
                setIndex={setQuestionNumber}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
            />

            <MessageForUser message={message} />
        </>
    );
}

export default StaticExamPage