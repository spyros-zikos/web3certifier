import React, { useState } from "react"
import { Image, Box, Heading, Text, Flex, chakra } from "@chakra-ui/react";
import { answersSeparator, defaultImage } from "~~/constants";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Button } from "~~/components";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Separator from "./Separator";
import RewardInfoDropDown from "./RewardInfoDropDown";
import ExamInfoDropDown from "./ExamInfoDropDown";
import { IndexSelector } from "~~/components/IndexSelector";

function isChecked(inputId: string): boolean {
    return (document.getElementById(inputId)! as HTMLInputElement)?.checked
}

const ExamDetails = (
    {
        exam, 
        message, 
        buttonAction, 
        buttonText, 
        showAnswers, 
        showRewards, 
        answers, 
        setAnswers,
        timer
    }:
    {
        exam: Exam|undefined,
        message: any,
        buttonAction?: any,
        buttonText?: string,
        showAnswers: boolean,
        showRewards: boolean,
        answers: bigint[],
        setAnswers: any,
        timer: [string, string]
    }
) => {
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [question, answer1, answer2, answer3, answer4] = exam?.questions[questionNumber-1].split(answersSeparator) || ["", "", "", "", ""];

    
    const status: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [exam?.id],
    }).data as any;

    function handleSelectAnswer(answerId: number, questionNumber: number) {
        if (!showAnswers) return;
        (document.getElementById(`answer${answerId}-${questionNumber}`)! as HTMLInputElement).checked = true;
        setAnswers([
            ...answers.slice(0, questionNumber-1), BigInt(answerId), ...answers.slice(questionNumber),
        ]);
    }

    console.log(answers);

    return (
        <Box bg="lighterBlack" padding={4} sm={{ padding: 10}} borderRadius="2xl" maxWidth="600px" margin="auto">
            {showRewards && 
            <div className="mb-2 text-[12px] font-semibold">
                <a href={`/rewards/?id=${exam?.id}`} className="underline">{"Go to rewards ->"}</a>
            </div>
            }

            {/* Image */}
            <Image borderRadius="2xl" src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="10" mt="6" w={200} h={200} sm={{ w: 290, h: 290 }} md={{ w: 350, h: 350 }} objectFit={"cover"}/>
            
            {/* Name */}
            <Heading fontSize="3xl" fontWeight="bold">{exam?.name}</Heading>

            {/* Description */}
            <Text fontSize="12" color="lighterLighterBlack" whiteSpace={"pre-wrap"} marginY="5" display={"inline-block"}>
                {exam?.description}
            </Text>

            {/* Timer */}
            {timer[0] !== "" &&
                <Text bg="black" pt="1" pb="1px" px="6" borderRadius="xl">
                    <Flex >
                        <chakra.svg xmlns="http://www.w3.org/2000/svg" mt="19px" mr="2" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></chakra.svg>
                        <Text fontWeight="semibold">{timer[0]}</Text>
                    </Flex>
                    <Text w="max" mt='0' mx="auto" pl="0" pr="4" fontSize="2xl" fontWeight="bold" color="green">{timer[1]}</Text>
                </Text>
            }

            {/* Exam Information */}
            <ExamInfoDropDown status={status} exam={exam} />

            {/* Reward Information */}
            <RewardInfoDropDown id={exam?.id || BigInt(0)} />

            <Box mt="12">
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
                {/* <Separator /> */}
            </Box>
            
            <IndexSelector setIndex={setQuestionNumber} index={questionNumber} firstIndex={1} lastIndex={exam?.questions ? exam?.questions.length : 1} />

            <Separator />

            {<Box className="mt-12 mb-8">
                <div className="whitespace-pre-wrap">{message}</div>
            </Box>}
            {buttonText && <Box w="full" display="flex" justifyContent="center"><Button className="ml-0 bg-base-100" onClick={buttonAction}>{buttonText}</Button></Box>}
        </Box>
    );
}

export default ExamDetails