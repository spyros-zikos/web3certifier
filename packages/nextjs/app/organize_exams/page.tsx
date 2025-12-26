"use client";

import React, { useEffect } from "react";
import { createRef, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { useDropzone } from "react-dropzone";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite'
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { singleUpload } from "~~/services/ipfs";
import { answersSeparator, defaultImage, emptyQuestionWithAnswers, timePerQuestion } from "~~/constants";
import { Box, Text, Flex, Spacer } from "@chakra-ui/react"
import { Button, Title, ResponsivePageWrapper, ButtonLink, ExamDataForm } from "~~/components";
import { DocsPage } from '~~/types/DocsPage';


const CreateExam = () => {
    const [examData, setExamData] = useState<ExamFormData>({
        name: "",
        examDescription: "",
        examResources: "",
        rewardDescription: "",
        endTime: "",
        questionsWithAnswers: [emptyQuestionWithAnswers],
        baseScore: 1,
        imageUrl: "",
        certifier: "",
        maxSubmissions: 0,
    });

    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [showButtonToViewExam, setShowButtonToViewExam] = useState<boolean>(false);
    const { chain } = useAccount();
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const returnedImageUrl = await singleUpload(file, file.name);
            setExamData({ ...examData, imageUrl: returnedImageUrl });
            console.log("Uploaded image url: ", returnedImageUrl);
        }, []
    );
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [] } });
    const dropZoneRef: React.Ref<HTMLDivElement> | undefined = createRef();

    const description = examData.examDescription
        + (examData.examResources ? "\n\nResources:\n" + examData.examResources : "")
        + (examData.rewardDescription ? "\n\nReward Description:\n" + examData.rewardDescription : "");

    const requiredDetailsAreFilled = () => {
        return examData.name && examData.examDescription && examData.endTime && examData.questionsWithAnswers![0];
    }

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    // Get exam creation fee (in $)
    const examCreationFee = wagmiReadFromContract({
        functionName: 'getExamCreationFee',
    }).data;

    const examCreationFeeInEth = wagmiReadFromContract({
        functionName: 'getUsdToEthRate',
        args: [examCreationFee ? examCreationFee : BigInt(0)],
    }).data;

    const { data: lastExamId } = wagmiReadFromContract({
        functionName: 'getLastExamId',
    });

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: createExam, isMining, success } = wagmiWriteToContract();
    function handleCreateExam() {
        try {
            createExam({
                functionName: 'createExam',
                args: [
                    examData.name,
                    description,
                    BigInt(new Date(examData.endTime!).getTime() / 1000),
                    examData.questionsWithAnswers!.map(
                        (question) => 
                            question.question + answersSeparator +
                            question.answer1 + answersSeparator +
                            question.answer2 + answersSeparator +
                            question.answer3 + answersSeparator +
                            question.answer4
                    ),
                    0n, // price
                    BigInt(examData.baseScore!),
                    examData.imageUrl || defaultImage,
                    BigInt(examData.maxSubmissions!),
                    false,
                ],
                value: examCreationFeeInEth,
                onSuccess: () => {
                    // do nothing
                }
            });
        } 
        catch (error) { console.error("Error creating exam:", error); }
        finally { setShowButtonToViewExam(true); }
    }

    /*//////////////////////////////////////////////////////////////
                              USE EFFECT
    //////////////////////////////////////////////////////////////*/

    useEffect(() => {
        setExamData({ ...examData, baseScore: Math.ceil(examData.questionsWithAnswers!.length / 2) });
    }, [examData.questionsWithAnswers]);

    useEffect(() => {
        // Save timers to MongoDB via API
        if (success) {
            if (!chain || lastExamId === undefined) {
                console.error("Cannot create exam: Wallet not connected or lastExamId is not loaded.");
                return;
            }
            const newExamId = lastExamId;
            console.log("Creating exam with id:", newExamId.toString());
            fetch('/api/create_exam_page/store_timers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: Number(newExamId),
                    chainId: chain.id,
                    questions: examData.questionsWithAnswers!.map(q => ({
                        completionTime: Number(q.completionTime) || timePerQuestion,
                    })),
                }),
            }).then(response => console.log("API response:", response.json()));
            
            console.log("Exam data saved to DB successfully.");
        }
    }, [success]);


    return (
        <ResponsivePageWrapper>
            <Title>
                <Flex>
                    <Box>
                        Create Exams
                    </Box>
                    <Spacer />
                    <ButtonLink href={`/docs?page=${DocsPage.CreatingExams}`} fontSize="sm">
                        Documentation
                    </ButtonLink>
                </Flex>
            </Title>

            <ExamDataForm
                examData={examData}
                setExamData={setExamData}
                questionNumber={questionNumber}
                setQuestionNumber={setQuestionNumber}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                dropZoneRef={dropZoneRef}
            />
            
            <div>

                <Text mt="9" color="grey" display="block">
                    Exam Creation Fee: ${(examCreationFee ? (Math.round(Number(examCreationFee) / 1e16) / 1e2) : 0).toString()} in ({chain?.id === 42220 ? "CELO" : "ETH"})
                </Text>
                {!requiredDetailsAreFilled() && <Text mt="2" color="red" display="block">* Fields are required</Text>}
                <Button disabled={!requiredDetailsAreFilled() || isMining} onClick={handleCreateExam} mt="3">
                    {isMining ? "Creating Exam..." : "Create Exam"}
                </Button>
                <br />
                {showButtonToViewExam && <ButtonLink href={`/exam_page?id=${lastExamId}`}>See the latest exam</ButtonLink>}
                
            </div>
        </ResponsivePageWrapper>
    )
}

export default CreateExam;