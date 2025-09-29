import { cookieExpirationTime, timePerQuestion } from "~~/constants";
import Cookies from 'js-cookie';
import getCurrentTimestamp from "./getCurrentTimestamp";

const removeExcessTime = (
    startTime: number,
    setStartTime: any,
    questionNumber: number,
    startTimeCookie: any
) => {
    // calculate remaining time
    const timeRemainingForPreviousQuestion = Math.max(0, startTime + (questionNumber * timePerQuestion) - getCurrentTimestamp());
    // new startTime
    const newStartTime = startTime - timeRemainingForPreviousQuestion;
    // update the variable startTime
    setStartTime(newStartTime);
    // update the cookie startTime
    Cookies.set(startTimeCookie, newStartTime.toString(), { expires: cookieExpirationTime });
}

export default removeExcessTime