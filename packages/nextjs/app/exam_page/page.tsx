"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { SimpleGrid, Box, Text, VStack, HStack, Image } from '@chakra-ui/react';
import { PageWrapper, Button } from "~~/components";
import { useAccount } from "wagmi";
import { Web3 } from 'web3';


const ExamPage = () => {
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);

    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [id],
    }).data;

    const initialAnswers = exam?.questions.map(() => 0);
    const [answers, setAnswers] = useState<Number[]>(initialAnswers!);

    useEffect(() => {
        if (answers === undefined)
            setAnswers(initialAnswers!);
    }, [initialAnswers]);

    function getAnswerAsNumber(answers: any) {
        let result = 0;
        for (let i = 0; i < answers.length; i++) {
            result += answers[i] * (10 ** i);
        }
        return result;
    }

    const PageTitle = () => {
        return (
            <Text fontSize={34} fontWeight="bold" w="100%" m={0} mb={14}>
                Exam Details
            </Text>
        );
    }

    /*//////////////////////////////////////////////////////////////
                           CLAIM CERTIFICATE
    //////////////////////////////////////////////////////////////*/

    // TODO
    const sdfsdf = [BigInt(1), BigInt(2), BigInt(3)];

    const { writeContractAsync: claimCertificate } = useScaffoldWriteContract("Certifier");
    const handleClaimCertificate = async () => {
        console.log("Exam refund begun");
        await claimCertificate(
            {
            functionName: "claimCertificate",
            args: [id, sdfsdf, BigInt(1)],
            },
            {
            onBlockConfirmation: res => {
                console.log("block confirm", res);
                // setData({ ...data, blockNumber: res.blockNumber, transactionHash: res.transactionHash });
                // router.push(`/`);
            },
            },
        );
    };
    
    /*//////////////////////////////////////////////////////////////
                       REFUND UNSUCCESSFUL EXAM
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: refundExam } = useScaffoldWriteContract("Certifier");
    const handleRefundExam = async () => {
        console.log("Exam refund begun");
        await refundExam(
            {
            functionName: "refundExam",
            args: [id],
            },
            {
            onBlockConfirmation: res => {
                console.log("block confirm", res);
                // setData({ ...data, blockNumber: res.blockNumber, transactionHash: res.transactionHash });
                // router.push(`/`);
            },
            },
        );
    };

    /*//////////////////////////////////////////////////////////////
                              SUBMIT EXAM
    //////////////////////////////////////////////////////////////*/

    // Get answers, key, address
    const answersAsNumber = answers ? getAnswerAsNumber(answers) : 0;
    // const key = Math.floor(1e10 * Math.random());
    const [key, _] = useState(Math.floor(1e10 * Math.random()));
    const { address } = useAccount();

    // const { Web3 } = require('web3');
    let web3 = new Web3(window.ethereum);
    const hashedanswer = address ? web3.utils.soliditySha3(answersAsNumber, key, address) : 0;

    const code = String(answersAsNumber) + String(key);

    const { writeContractAsync: submitAnswers } = useScaffoldWriteContract("Certifier");
    const handleSubmitExam = async () => {
        console.log("Exam submission begun");
        await cancelExam(
            {
            functionName: "submitAnswers",
            args: [hashedanswer, id],
            },
            {
            onBlockConfirmation: res => {
                console.log("block confirm", res);
                // setData({ ...data, blockNumber: res.blockNumber, transactionHash: res.transactionHash });
                // router.push(`/`);
            },
            },
        );
    };

    /*//////////////////////////////////////////////////////////////
                              CANCEL EXAM
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: cancelExam } = useScaffoldWriteContract("Certifier");
    const handleCancelExam = async () => {
        console.log("Exam cancelation begun");
        try {
            await cancelExam(
                {
                functionName: "cancelUncorrectedExam",
                args: [id],
                },
                {
                onBlockConfirmation: res => {
                    console.log("block confirm", res);
                    // setData({ ...data, blockNumber: res.blockNumber, transactionHash: res.transactionHash });
                    // router.push(`/`);
                },
                },
            );
        } catch (error) {
            console.log("nft mint error", error);
        }
    };

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
            <PageWrapper>
                <PageTitle/>
                <Text>This exam needs to be cancelled!</Text>
                <Button onClick={handleCancelExam}>Cancel Exam</Button>
            </PageWrapper>
        );
    }

    // exam has been cancelled
    if (exam?.status === 1) { // TODO: fix button
        return (
            <Box>
                <Text>This exam has been cancelled! Claim your refund!</Text>
                <Button onClick={handleRefundExam}>Submit</Button>
            </Box>
        );
    }

    const ExamDetails = ({name, value}: {name: any, value: any}) => {
        return (
            <Box>
                <label className="fontsize-12 mt-4">{name}: </label>
                <Text fontWeight="bold" fontSize="12" p="0" m="0" mb="4">{value}</Text>
            </Box>
        );
    }

    return (
        <PageWrapper>
            <PageTitle/>

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
                                                value,
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
                        <Button onClick={submitAnswers}>Submit</Button>
                    </Box>
                </>) : 
                // certifier submission to correct exam // TODO: fix button
                (<>
                    <Box className="mt-6">
                        <div>Correct the exam by submitting your answers.</div>
                    </Box>
                    <Box>
                        <Button onClick={submitAnswers}>Submit</Button>
                    </Box>
                </>)}
                

                {/* <div> Copy this password and use it to claim your certificate: {code}</div> */}
                </div>
            </VStack>
        </PageWrapper>
    )
}

export default ExamPage