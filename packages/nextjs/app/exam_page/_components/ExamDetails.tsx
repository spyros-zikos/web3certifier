import React, { useEffect } from "react"
import { VStack, Image, Box } from "@chakra-ui/react";
import ExamDetail from "./ExamDetail";
import { defaultImage } from "~~/constants";
import { getExamStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { Button } from "~~/components";
import { Accordion } from "@chakra-ui/react"
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const ExamDetails = ({exam, message, buttonAction, buttonText, showAnswers, showRewards, answers, setAnswers}:
    {
        exam: Exam|undefined,
        message: any,
        buttonAction?: any,
        buttonText?: string,
        showAnswers: boolean,
        showRewards: boolean,
        answers: bigint[],
        setAnswers: any
    }
) => {
    const status: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [exam?.id],
    }).data as any;
    return (
        <VStack>
            <div className="max-w-[400px]">
                {showRewards && 
                <div className="mb-2 text-[12px] font-semibold">
                    <a href={`/rewards/?id=${exam?.id}`} className="underline">{"Go to rewards ->"}</a>
                </div>
                }
                <div className="text-[40px] font-bold mb-4 ">{exam?.name}</div>
                <Image src={exam?.imageUrl || defaultImage} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="6" w={350} h={350} objectFit={"cover"}/>
                <Accordion.Root className="mt-9" collapsible>
                    <Accordion.Item value={"1"}>
                        <Accordion.ItemTrigger>
                        <span className={'mb-4 border bg-base-100 border-primary text-primary rounded-lg p-2 mt-2 text-xl hover:bg-base-200 hover:text-accent hover:border-2 hover:border-accent'}>
                            <div className="flex items-center mr-1">
                            <ArrowDownIcon className="h-4 w-4 mr-2 text-primary hover:text-accent" aria-hidden="true" />
                            Details
                            </div>
                        </span>
                        <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                        <Accordion.ItemBody>
                                <ExamDetail name="Description" value={exam?.description} />
                                <ExamDetail name="End Time" value={exam?(new Date(Number(exam?.endTime)*1000)).toString() : 0} />
                                <ExamDetail name="Status" value={getExamStatusStr(status)} />
                                <ExamDetail name="Price" value={exam?'$'+parseFloat(exam!.price!.toString()) / 1e18 : 0} />
                                <ExamDetail name="Base Score" value={exam?.baseScore.toString()} />
                                <ExamDetail name="Number of Submissions" value={exam?.numberOfSubmissions.toString()} />
                                <ExamDetail name="Max Submissions" value={exam?.maxSubmissions == BigInt(0) ? "Unlimited" : exam?.maxSubmissions.toString()} />
                                <ExamDetail name="User Claims with Password" value={exam?.userClaimsWithPassword.toString()} />
                                <ExamDetail name="Certifier" value={<Address address={exam?.certifier} className={"text-bold"} disableAddressLink={true} />} />
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>
                {
                    <Box>
                    {exam?.questions.map((question, index) => (
                        <Box key={index}>
                            <form
                                onChange={e => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.checked) {
                                        const value = Number(target.value);
                                        if (!isNaN(value))
                                            setAnswers([
                                                ...answers.slice(0, index), BigInt(value), ...answers.slice(index + 1),
                                            ]);
                                    }
                                }}
                            >
                                <label className={"mt-6 mb-1 block"}>Question {index+1}</label>
                                <div className="mb-2 border-2 border-gray-400 p-2 py-1 rounded-md">
                                    <div className="whitespace-pre-wrap">{question}</div>
                                    {showAnswers &&
                                    <div className="mt-4">
                                        <label className="mr-5 mt-4">
                                            <input type="radio" name={`question-${index}`} value="1" />
                                            <span className="ml-1">1</span>
                                        </label>
                                        <label className="mr-5">
                                            <input type="radio" name={`question-${index}`} value="2" />
                                            <span className="ml-1">2</span>
                                        </label>
                                        <label className="mr-5">
                                            <input type="radio" name={`question-${index}`} value="3" />
                                            <span className="ml-1">3</span>
                                        </label>
                                        <label className="mr-5">
                                            <input type="radio" name={`question-${index}`} value="4" />
                                            <span className="ml-1">4</span>
                                        </label>
                                    </div>}
                                </div>
                            </form>
                        </Box>
                    ))}
                    </Box>
                }
                {<Box className="mt-12 mb-8">
                    <div className="whitespace-pre-wrap">{message}</div>
                </Box>}
                {buttonText && <Box><Button className="ml-0 bg-base-100" onClick={buttonAction}>{buttonText}</Button></Box>}
            </div>
        </VStack>
    );
}

export default ExamDetails