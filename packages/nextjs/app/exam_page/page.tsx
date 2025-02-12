"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { SimpleGrid, Box, Text, VStack, HStack, Image } from '@chakra-ui/react';
import { PageWrapper, Button, Title } from "~~/components";
import { useAccount } from "wagmi";
import { Web3 } from 'web3';
import { handleCancelExam, handleCorrectExam, handleRefundExam, handlesubmitAnswers } from "./helperFunctions/WriteToContract";
import ExamDetails from "./_components/ExamDetails";
import CancelExamPage from "./_components/CancelExamPage";

const ExamPage = () => {
    const searchParams = useSearchParams();
    const { address } = useAccount();
    const id = BigInt(searchParams.get("id")!);

    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [id],
    }).data;

    const userAnswer = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserAnswer",
        args: [address, id],
    }).data;
    const userHasNotParticipated = userAnswer==="0x0000000000000000000000000000000000000000000000000000000000000000";

    const { writeContractAsync: submitAnswers } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: cancelExam } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: refundExam } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: claimCertificate } = useScaffoldWriteContract("Certifier");
    const { writeContractAsync: correctExam } = useScaffoldWriteContract("Certifier");

    const initialAnswers = exam?.questions.map(() => BigInt(0));
    const [answers, setAnswers] = useState<bigint[]>(initialAnswers!);

    useEffect(() => {
        if (answers === undefined)
            setAnswers(initialAnswers!);
    }, [initialAnswers]);

    function getAnswerAsNumber(answers: any) {
        let result = BigInt(0);
        for (let i = 0; i < answers.length; i++) {
            result += answers[i] * BigInt(10 ** i);
        }
        return result;
    }


    /*//////////////////////////////////////////////////////////////
                              SUBMIT EXAM
    //////////////////////////////////////////////////////////////*/

    // Get answers, key, address
    const answersAsNumber: BigInt = answers ? getAnswerAsNumber(answers) : BigInt(0);
    const [key, _] = useState(Math.floor(1e10 * Math.random()));

    const web3 = window.ethereum ? new Web3(window.ethereum) : new Web3();
    const hashedAnswer = address ? web3.utils.soliditySha3(answersAsNumber, key, address) : '0x0';

    const code = String(answersAsNumber) + String(key);



    /*//////////////////////////////////////////////////////////////
                              CANCEL EXAM
    //////////////////////////////////////////////////////////////*/


    const getTimeToCorrectExam: BigInt | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getTimeToCorrectExam",
    }).data;

    const currentTimestamp = BigInt(Math.floor(new Date().getTime() / 1000));
    const needsCorrecting = exam && (exam.status === 0 &&
        (BigInt(exam.endTime.toString()) < currentTimestamp));
    const correctionTimePassed = exam && getTimeToCorrectExam && needsCorrecting &&
        (BigInt(exam.endTime.toString()) + BigInt(getTimeToCorrectExam!.toString()) < currentTimestamp);

    // exam needs to be cancelled
    if (needsCorrecting && correctionTimePassed) {
        return (
            <CancelExamPage onClick={() => handleCancelExam(cancelExam, id)} />
        );
    }

    // exam needs to be corrected
    if (needsCorrecting && !correctionTimePassed) {
        return address !== exam?.certifier ? (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Text>This exam is being corrected! You are not the certifier!</Text>
            </PageWrapper>
        ) : (
            <PageWrapper>
                <Title>Exam Page</Title>
                <Text>You need to correct the exam!</Text>
            </PageWrapper>
        );
    }

    // exam has been cancelled, users can redeem
    if (exam?.status === 1) {
        if (userHasNotParticipated)
            return (
                <Box>
                    <Text>This exam has been cancelled!</Text>
                </Box>
            );
        return (
            <Box>
                <Text>This exam has been cancelled! Claim your refund!</Text>
                <Button onClick={()=>handleRefundExam(refundExam, id)}>Claim Refund</Button>
            </Box>
        );
    }



    return (
        <PageWrapper>
            <Title>Exam Page</Title>

            <VStack>
                <div className="max-w-[400px]">
                <Image src={exam?.imageUrl} alt={"Exam Image"} maxWidth="500px" maxHeight="500px" mb="6" />
                <Box>
                    <ExamDetails name="Name" value={exam?.name} />
                </Box>
                <Box>
                    <ExamDetails name="Description" value={exam?.description} />
                </Box>
                <Box>
                    <ExamDetails name="End Time" value={exam?(new Date(Number(exam?.endTime)*1000)).toString() : 0} />
                </Box>
                <Box>
                    <ExamDetails name="Status" value={exam?.status == 0 ? "Open" : "Ended"} />
                </Box>
                <Box>
                    <ExamDetails name="Price" value={exam?'$'+parseFloat(exam!.price!.toString()) / 1e18 : 0} />
                </Box>
                <Box>
                    <ExamDetails name="Base Score" value={exam?.baseScore.toString()} />
                </Box>
                <Box>
                    <ExamDetails name="Certifier" value={exam?.certifier} />
                </Box>

                <Box>
                    {exam?.questions.map((question, index) => (
                        <Box key={index}>
                            <form
                                onChange={e => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.checked) {
                                        const value = Number(target.value);
                                        if (!isNaN(value)) {
                                            setAnswers([
                                                ...answers.slice(0, index),
                                                BigInt(value),
                                                ...answers.slice(index + 1),
                                            ]);
                                        }
                                    }
                                }}
                            >
                                <div className="mt-6 mb-2">{question}</div>
                                <label className="mr-5">
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
                            </form>
                        </Box>
                    ))}
                </Box>

                {address !== exam?.certifier ?
                // user submission
                (<>
                    <Box className="mt-4">
                        <div>Your code is {code}. You&apos;ll need it to claim your certificate.</div>
                    </Box>
                    <Box>
                        <Button onClick={() => {hashedAnswer ? handlesubmitAnswers(submitAnswers, hashedAnswer, id) : 0}}>Submit</Button>
                    </Box>
                </>) : 
                // certifier submission to correct exam // TODO: certifier can correct only on the 'correct' period
                // In this period, the user has to see an appropriate message
                (<>
                    <Box className="mt-6">
                        <div>Correct the exam by submitting your answers.</div>
                    </Box>
                    <Box>
                        <Button onClick={() => {answers ? handleCorrectExam(correctExam, id, answers) : 0}}>
                            Submit
                        </Button>
                    </Box>
                </>)}
                

                {/* <div> Copy this password and use it to claim your certificate: {code}</div> */}
                </div>
            </VStack>
        </PageWrapper>
    )
}

export default ExamPage