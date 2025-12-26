'use client';

import { useSearchParams } from 'next/navigation';
import React, { createRef, useCallback, useEffect, useState } from 'react'
import { Button, ButtonLink, ExamDataForm, ResponsivePageWrapper, Spinner, Title } from '~~/components'
import { answersSeparator, emptyQuestionWithAnswers } from '~~/constants';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { useDropzone } from "react-dropzone";
import { singleUpload } from '~~/services/ipfs';

const Edit = () => {
    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);

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

    const exam: Exam | undefined = wagmiReadFromContract({
        functionName: "getExam",
        args: [id],
    }).data;

    const { writeContractAsync: setExamDataContractFunction } = wagmiWriteToContract();
    const handleSetExamData = async () => {
        await setExamDataContractFunction({
            functionName: 'setExamData',
            args: [
                id,
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
                examData.baseScore,
                examData.imageUrl,
                examData.certifier,
                examData.maxSubmissions
            ],
        });
    };

    useEffect(() => {
        if (!exam) return;
        const endTimeStr = new Date(Number(exam.endTime) * 1000)
        const year = endTimeStr.getFullYear().toString();
        const month = (endTimeStr.getMonth() + 1).toString().padStart(2, '0');
        const day = endTimeStr.getDate().toString().padStart(2, '0');
        const date = year + "-" + month + "-" + day + "T";
        const hours = endTimeStr.getHours().toString().padStart(2, '0') + ":";
        const minutes = endTimeStr.getMinutes().toString().padStart(2, '0');
        const endTime = date + hours + minutes;

        setExamData({
            name: exam.name,
            examDescription: exam.description.split("\n\nResources:\n")[0],
            examResources: exam.description.includes("\n\nResources:\n") ?
                (exam.description.includes("\n\nReward Description:\n") ?
                    exam.description.split("\n\nResources:\n")[1].split("\n\nReward Description:\n")[0]
                    : exam.description.split("\n\nResources:\n")[1]
                )
                : "",
            rewardDescription: exam.description.includes("\n\nReward Description:\n") ?
                exam.description.split("\n\nReward Description:\n")[1]
                : "",
            endTime: endTime,
            questionsWithAnswers: exam.questions.map((q) => {
                const [question, answer1, answer2, answer3, answer4] = q.split(answersSeparator);
                return {
                    question,
                    answer1,
                    answer2,
                    answer3,
                    answer4,
                }
            }),
            baseScore: Number(exam.baseScore),
            imageUrl: exam.imageUrl,
            certifier: exam.certifier,
            maxSubmissions: Number(exam.maxSubmissions),
        });
    }, [exam]);

    if (!exam) return <Spinner />

    return (
        <ResponsivePageWrapper>
            
            <Title>Edit Exam Page</Title>
            
            <ExamDataForm
                examData={examData}
                setExamData={setExamData}
                questionNumber={questionNumber}
                setQuestionNumber={setQuestionNumber}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                dropZoneRef={dropZoneRef}
            />
            <Button onClick={handleSetExamData} mt={16}>
                Save Changes
            </Button>
            <ButtonLink href={`/exam_page?id=${id}`} mt={16}>
                Back to Exam Page
            </ButtonLink>
        </ResponsivePageWrapper>
    )
}

export default Edit