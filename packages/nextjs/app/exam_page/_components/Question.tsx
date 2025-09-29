import { Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { answersSeparator, getPasswordCookieName } from "~~/constants";
import { ProgressBar } from '~~/components';
import { useNonUndefinedAccount } from '~~/utils/NonUndefinedAccount';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import Cookies from 'js-cookie';
import { getAnswersAsNumberArrayFromString, getVariablesFromPasswordCookie } from '../helperFunctions/PasswordManagement';
import { getUserAnswersFromLocalStorage, saveUserAnswersToLocalStorage } from '~~/utils/handleLocalStorage';


const Question = ({
        questionNumber, exam, showAnswers
    } : {
        questionNumber: number, exam: Exam | undefined, showAnswers: boolean
    }) => {
    const [question, answer1, answer2, answer3, answer4] = exam?.questions[questionNumber-1].split(answersSeparator) || ["", "", "", "", ""];
    
    const { address, chain } = useNonUndefinedAccount();

    // Get getUserStringAnswer
    const getUserStringAnswer: string | undefined = wagmiReadFromContract({
        functionName: "getUserStringAnswer",
        args: [exam?.id, address],
    }).data;
    const answersArrayFromContract = getUserStringAnswer ? getAnswersAsNumberArrayFromString(getUserStringAnswer) : [];

    // if they dont exist try cookie
    const passwordCookie = Cookies.get(getPasswordCookieName(chain, exam ? exam.id : BigInt(0), address));
    const [_, userAnswersString, __] = getVariablesFromPasswordCookie(passwordCookie || "", address, "no hash");
    const answersArrayFromCookie = getAnswersAsNumberArrayFromString(userAnswersString);

    // User Answers to show
    const userAnswersToDisplay = answersArrayFromContract.length > 0 ? answersArrayFromContract : answersArrayFromCookie;

    // Get correct answers
    const correctAnswersToDisplay = exam?.answers || [];

    function isChecked(inputId: string): boolean {
        return (document.getElementById(inputId)! as HTMLInputElement)?.checked
    }

    function handleSelectAnswer(answerId: number, questionNumber: number) {
        if (!showAnswers) return;
        // check the radio button
        (document.getElementById(`answer${answerId}-${questionNumber}`)! as HTMLInputElement).checked = true;
        // get previous answers from local memory
        const answers = getUserAnswersFromLocalStorage(chain, exam);
        // console.log("answers", answers);

        const newAnswers = [...answers!.slice(0, questionNumber-1), answerId, ...answers!.slice(questionNumber)];
        saveUserAnswersToLocalStorage(chain, exam, newAnswers);
        // console.log("answers after", getUserAnswersFromLocalStorage(chain, exam));
    }

    // if user can submit or correct, show the answers that he selects
    // else show the correct answers and the answers that the user submitted
    function getBorderSizeAndColor(answerNumberForQuestion: number, questionNumber: number) {
        // if users can submit or correct
        if (showAnswers) {
            if (isChecked(`answer${answerNumberForQuestion}-${questionNumber}`))
                return { border: "3px solid", color: "green" }
            return { border: "1px solid", color: "lighterLighterBlack" }
        }

        if (exam?.answers.length === 0)
            return { border: "1px solid", color: "lighterLighterBlack" }

        // correct answers
        const correctAnswerForQuestion = Number(correctAnswersToDisplay[questionNumber-1]);
        if ((correctAnswersToDisplay.length === exam?.questions.length) &&
            (answerNumberForQuestion === correctAnswerForQuestion))
        {
            return { border: "3px solid", color: "green" }
        }

        // wrong user answers
        const userAnswersForQuestion = userAnswersToDisplay[questionNumber-1];
        if ((userAnswersToDisplay.length === exam?.questions.length) && 
            (answerNumberForQuestion === userAnswersForQuestion) &&
            userAnswersForQuestion !== correctAnswerForQuestion)
        {
            return { border: "3px solid", color: "red" }
        }

        return { border: "1px solid", color: "lighterLighterBlack" }

    }

    return (
        <>
        {exam?.questions && exam?.questions.length > 1 &&
            <ProgressBar questions={exam?.questions} questionNumber={questionNumber} />
        }

        <Box mt="6">
            <Text color="green" m="0" p="0">Question {questionNumber}</Text>
            <Text fontWeight={"semibold"} whiteSpace={"pre-wrap"} fontSize={"xl"} mt="2" mb="10">{question}</Text>
            <Text mt="4">
                <Text
                    border={getBorderSizeAndColor(1, questionNumber).border}
                    borderColor={getBorderSizeAndColor(1, questionNumber).color}
                    borderRadius={"lg"}
                    p="3" mr="5" mt="4" _hover={ correctAnswersToDisplay.length === 0 ? { border: "1px solid", borderColor: "green" } : {}}
                    onClick={() => handleSelectAnswer(1, questionNumber)}
                >
                    <Flex align="flex-start">
                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer1-${questionNumber}`} value="1" checked={getUserAnswersFromLocalStorage(chain, exam)[questionNumber-1] === 1} />}
                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer1}</Text>
                    </Flex>
                </Text>
                <Text
                    border={getBorderSizeAndColor(2, questionNumber).border}
                    borderColor={getBorderSizeAndColor(2, questionNumber).color}
                    borderRadius={"lg"}
                    p="3" mr="5" mt="4" _hover={ correctAnswersToDisplay.length === 0 ? { border: "1px solid", borderColor: "green" } : {}}
                    onClick={() => handleSelectAnswer(2, questionNumber)}
                >
                    <Flex align="flex-start">
                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer2-${questionNumber}`} value="2" checked={getUserAnswersFromLocalStorage(chain, exam)[questionNumber-1] === 2} />}
                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer2}</Text>
                    </Flex>
                </Text>
                <Text
                    border={getBorderSizeAndColor(3, questionNumber).border}
                    borderColor={getBorderSizeAndColor(3, questionNumber).color}
                    borderRadius={"lg"}
                    p="3" mr="5" mt="4" _hover={ correctAnswersToDisplay.length === 0 ? { border: "1px solid", borderColor: "green" } : {}}
                    onClick={() => handleSelectAnswer(3, questionNumber)}
                >
                    <Flex align="flex-start">
                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer3-${questionNumber}`} value="3" checked={getUserAnswersFromLocalStorage(chain, exam)[questionNumber-1] === 3} />}
                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer3}</Text>
                    </Flex>
                </Text>
                <Text
                    border={getBorderSizeAndColor(4, questionNumber).border}
                    borderColor={getBorderSizeAndColor(4, questionNumber).color}
                    borderRadius={"lg"}
                    p="3" mr="5" mt="4" _hover={ correctAnswersToDisplay.length === 0 ? { border: "1px solid", borderColor: "green" } : {}}
                    onClick={() => handleSelectAnswer(4, questionNumber)}
                >
                    <Flex align="flex-start">
                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer4-${questionNumber}`} value="4" checked={getUserAnswersFromLocalStorage(chain, exam)[questionNumber-1] === 4} />}
                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer4}</Text>
                    </Flex>
                </Text>
            </Text>
        </Box>
        </>
    )
}

export default Question