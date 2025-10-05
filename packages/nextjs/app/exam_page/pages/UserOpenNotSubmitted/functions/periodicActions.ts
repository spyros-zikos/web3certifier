import { timePerQuestion } from "~~/constants";
import Cookies from 'js-cookie';
import getCurrentTimestamp from "./getCurrentTimestamp";

const periodicActions = (
    startTime: number,
    setStartTime: any,
    questionNumber: number,
    setTimeEnded: any,
    setQuestionNumber: any,
    questionsLength: any,
    startTimeCookie: any,
) => {
    // Check if user has reloaded the page after starting the exam
    // If so, set the timer to the previous time
    if (startTime === 0) setStartTime(Number(Cookies.get(startTimeCookie)) || 0);

    // Check if the time has ended for all questions
    const unboundQuestionNumber = Math.floor((getCurrentTimestamp() - startTime) / timePerQuestion) + 1;
    if (unboundQuestionNumber > (questionsLength || 1)) {
        setTimeEnded(true);
    } else {
        setTimeEnded(false);
    }

    // Check if the time has ended for the current question
    const boundedQuestionNumber = Math.min(unboundQuestionNumber, questionsLength || 1);
    if (startTime > 0) setQuestionNumber(Math.max(boundedQuestionNumber, questionNumber));
}

export default periodicActions