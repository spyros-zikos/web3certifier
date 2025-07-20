import React from "react"
import { Image, Box, Heading, Accordion, Text, Flex, chakra, Spacer } from "@chakra-ui/react";
import ExamDetail from "./ExamDetail";
import { answersSeparator, defaultImage } from "~~/constants";
import { getExamStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Button } from "~~/components";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import Separator from "./Separator";
import RewardInfo from "./RewardInfo";

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
    const status: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [exam?.id],
    }).data as any;

    function handleSelectAnswer(answerId: number, index: number) {
        if (!showAnswers) return;
        (document.getElementById(`answer${answerId}-${index}`)! as HTMLInputElement).checked = true;
        setAnswers([
            ...answers.slice(0, index), BigInt(answerId), ...answers.slice(index + 1),
        ]);
    }

    return (
        <Box bg="lighterBlack" padding={10} borderRadius="2xl" maxWidth="600px" margin="auto">
            {showRewards && 
            <div className="mb-2 text-[12px] font-semibold">
                <a href={`/rewards/?id=${exam?.id}`} className="underline">{"Go to rewards ->"}</a>
            </div>
            }
            <Image borderRadius="2xl" src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="10" mt="6" w={250} h={250} md={{ w: 350, h: 350 }} objectFit={"cover"}/>
            <Heading fontSize="3xl" fontWeight="bold">{exam?.name}</Heading>

            <Text fontSize="12" color="lighterLighterBlack" whiteSpace={"pre-wrap"} marginY="5" display={"inline-block"}>
                {exam?.description}
            </Text>

            {timer[0] !== "" &&
                <Text bg="black" pt="1" pb="1px" px="6" borderRadius="xl">
                    <Flex >
                        <chakra.svg xmlns="http://www.w3.org/2000/svg" mt="19px" mr="2" width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></chakra.svg>
                        <Text fontWeight="semibold">{timer[0]}</Text>
                    </Flex>
                    <Text w="max" mt='0' mx="auto" pl="0" pr="4" fontSize="2xl" fontWeight="bold" color="green">{timer[1]}</Text>
                </Text>
            }

            <Accordion.Root borderY="1px solid" borderColor="lighterLighterBlack" mt="12" mb="0" py="2" collapsible>
                <Accordion.Item value={"1"}>
                    <Accordion.ItemTrigger>
                    <Text fontWeight="semibold" fontSize={"lg"}>
                        Exam Information
                    </Text>
                    <Spacer />
                    <Accordion.ItemIndicator />
                    </Accordion.ItemTrigger>
                    <Accordion.ItemContent>
                    <Accordion.ItemBody>
                            <ExamDetail name="Status" value={getExamStatusStr(status)} />
                            <ExamDetail name="End Time" value={exam?(new Date(Number(exam?.endTime)*1000)).toString().split("(")[0].slice(4).slice(0, 17) +
                                                                    (new Date(Number(exam?.endTime)*1000)).toString().split("(")[0].slice(4).slice(20) : 0} />
                            <ExamDetail name="Price" value={exam?'$'+parseFloat(exam!.price!.toString()) / 1e18 : 0} />
                            <ExamDetail name="Base Score" value={exam?.baseScore.toString()} />
                            <ExamDetail name="Submissions" value={exam?.numberOfSubmissions.toString()+' of ' + (exam?.maxSubmissions == BigInt(0) ? "Unlimited" : exam?.maxSubmissions.toString())} />
                            <ExamDetail name="Certifier" value={<Address address={exam?.certifier} className={"text-bold"} disableAddressLink={true} />} />
                        </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>

            <RewardInfo id={exam?.id || BigInt(0)} />

            {
                <Box mt="12">
                    {exam?.questions.map((questionWithAnswers, index) => {
                    const [question, answer1, answer2, answer3, answer4] = questionWithAnswers.split(answersSeparator);
                    return (<>
                        <Box key={index}>
                            <Text color="green" m="0" p="0">Question {index+1}</Text>
                            <Text fontWeight={"semibold"} whiteSpace={"pre-wrap"} fontSize={"xl"} mt="2" mb="10">{question}</Text>
                            <Text mt="4">
                                <Text
                                    border={isChecked(`answer1-${index}`) ? "3px solid" : "1px solid"}
                                    borderRadius={"lg"}
                                    borderColor={isChecked(`answer1-${index}`) ? "green" : "lighterLighterBlack"}
                                    p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                                    onClick={() => handleSelectAnswer(1, index)}
                                >
                                    <Flex align="flex-start">
                                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${index}`} id={`answer1-${index}`} value="1" />}
                                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer1}</Text>
                                    </Flex>
                                </Text>
                                <Text
                                    border={isChecked(`answer2-${index}`) ? "3px solid" : "1px solid"}
                                    borderRadius={"lg"}
                                    borderColor={isChecked(`answer2-${index}`) ? "green" : "lighterLighterBlack"}
                                    p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                                    onClick={() => handleSelectAnswer(2, index)}
                                >
                                    <Flex align="flex-start">
                                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${index}`} id={`answer2-${index}`} value="2" />}
                                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer2}</Text>
                                    </Flex>
                                </Text>
                                <Text
                                    border={isChecked(`answer3-${index}`) ? "3px solid" : "1px solid"}
                                    borderRadius={"lg"}
                                    borderColor={isChecked(`answer3-${index}`) ? "green" : "lighterLighterBlack"}
                                    p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                                    onClick={() => handleSelectAnswer(3, index)}
                                >
                                    <Flex align="flex-start">
                                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${index}`} id={`answer3-${index}`} value="3" />}
                                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer3}</Text>
                                    </Flex>
                                </Text>
                                <Text
                                    border={isChecked(`answer4-${index}`) ? "3px solid" : "1px solid"}
                                    borderRadius={"lg"}
                                    borderColor={isChecked(`answer4-${index}`) ? "green" : "lighterLighterBlack"}
                                    p="3" mr="5" mt="4" _hover={{ borderColor: "green" }}
                                    onClick={() => handleSelectAnswer(4, index)}
                                >
                                    <Flex align="flex-start">
                                        {showAnswers && <input className="mt-[11px] inline-block" type="radio" name={`question-${index}`} id={`answer4-${index}`} value="4" />}
                                        <Text className="p-1 m-0 ml-2 pr-8 block-inline w-full">{answer4}</Text>
                                    </Flex>
                                </Text>
                            </Text>
                        </Box>
                        <Separator />
                        </>);
                    }
                )}
                </Box>
            }

            {<Box className="mt-12 mb-8">
                <div className="whitespace-pre-wrap">{message}</div>
            </Box>}
            {buttonText && <Box w="full" display="flex" justifyContent="center"><Button className="ml-0 bg-base-100" onClick={buttonAction}>{buttonText}</Button></Box>}
        </Box>
    );
}

export default ExamDetails