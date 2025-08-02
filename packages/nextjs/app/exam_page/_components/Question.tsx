import { Box, Text, Flex } from '@chakra-ui/react'
import React from 'react'
import { answersSeparator } from "~~/constants";



const Question = ({
        questionNumber, exam, showAnswers, answers, setAnswers
    } : {
        questionNumber: number, exam: Exam | undefined, showAnswers: boolean, answers: bigint[], setAnswers: any
    }) => {
    const [question, answer1, answer2, answer3, answer4] = exam?.questions[questionNumber-1].split(answersSeparator) || ["", "", "", "", ""];
    
    function isChecked(inputId: string): boolean {
        return (document.getElementById(inputId)! as HTMLInputElement)?.checked
    }

    function handleSelectAnswer(answerId: number, questionNumber: number) {
        if (!showAnswers) return;
        (document.getElementById(`answer${answerId}-${questionNumber}`)! as HTMLInputElement).checked = true;
        setAnswers([
            ...answers.slice(0, questionNumber-1), BigInt(answerId), ...answers.slice(questionNumber),
        ]);
    }

    return (
        <Box mt="6">
            <Box key={questionNumber}>
                <Text color="green" m="0" p="0">Question {questionNumber}</Text>
                <Text fontWeight={"semibold"} whiteSpace={"pre-wrap"} fontSize={"xl"} mt="2" mb="10">{question}</Text>
                <Text mt="4">
                    <Text
                        border={isChecked(`answer1-${questionNumber}`) ? "3px solid" : "1px solid"}
                        borderRadius={"lg"}
                        borderColor={isChecked(`answer1-${questionNumber}`) ? "green" : "lighterLighterBlack"}
                        p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                        onClick={() => handleSelectAnswer(1, questionNumber)}
                    >
                        <Flex align="flex-start">
                            {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer1-${questionNumber}`} value="1" checked={answers[questionNumber-1] === BigInt(1)} />}
                            <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer1}</Text>
                        </Flex>
                    </Text>
                    <Text
                        border={isChecked(`answer2-${questionNumber}`) ? "3px solid" : "1px solid"}
                        borderRadius={"lg"}
                        borderColor={isChecked(`answer2-${questionNumber}`) ? "green" : "lighterLighterBlack"}
                        p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                        onClick={() => handleSelectAnswer(2, questionNumber)}
                    >
                        <Flex align="flex-start">
                            {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer2-${questionNumber}`} value="2" checked={answers[questionNumber-1] === BigInt(2)} />}
                            <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer2}</Text>
                        </Flex>
                    </Text>
                    <Text
                        border={isChecked(`answer3-${questionNumber}`) ? "3px solid" : "1px solid"}
                        borderRadius={"lg"}
                        borderColor={isChecked(`answer3-${questionNumber}`) ? "green" : "lighterLighterBlack"}
                        p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                        onClick={() => handleSelectAnswer(3, questionNumber)}
                    >
                        <Flex align="flex-start">
                            {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer3-${questionNumber}`} value="3" checked={answers[questionNumber-1] === BigInt(3)} />}
                            <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer3}</Text>
                        </Flex>
                    </Text>
                    <Text
                        border={isChecked(`answer4-${questionNumber}`) ? "3px solid" : "1px solid"}
                        borderRadius={"lg"}
                        borderColor={isChecked(`answer4-${questionNumber}`) ? "green" : "lighterLighterBlack"}
                        p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                        onClick={() => handleSelectAnswer(4, questionNumber)}
                    >
                        <Flex align="flex-start">
                            {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${questionNumber}`} id={`answer4-${questionNumber}`} value="4" checked={answers[questionNumber-1] === BigInt(4)} />}
                            <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer4}</Text>
                        </Flex>
                    </Text>
                </Text>
            </Box>
        </Box>
    )
}

export default Question