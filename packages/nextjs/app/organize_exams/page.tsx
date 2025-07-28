"use client";

import React from "react";
import { createRef, useCallback, useState } from "react";
import { Button, Title, Input, Text, TextArea, PageWrapper } from "~~/components";
import { useDropzone } from "react-dropzone";
import { singleUpload } from "~~/services/ipfs";
import { PhotoIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { answersSeparator, defaultImage } from "~~/constants";
import { Accordion, Box, Flex, Spacer } from "@chakra-ui/react"
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite'
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import InputLabel from "./_components/InputLabel";
import Link from "next/link";

const CreateExam = () => {
    const emptyQuestionWithAnswers = {question: "", answer1: "", answer2: "", answer3: "", answer4: ""};
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswers[]>([emptyQuestionWithAnswers]);

    const [name, setname] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [endTime, setendTime] = useState<string>("");
    const [price, setprice] = useState<number>();
    const [baseScore, setbaseScore] = useState<string>("");
    const [maxSubmissions, setmaxSubmissions] = useState<string>("");
    const [userClaimsWithPassword, setUserClaimsWithPassword] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const requiredDetailsAreFilled = () => {
        return name&&description&&endTime&&questionsWithAnswers[0];
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

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: createExam } = wagmiWriteToContract();
    function handleCreateExam() {
        createExam({
            functionName: 'createExam',
            args: [
                name,
                description,
                BigInt(new Date(endTime.toString()).getTime() / 1000),
                questionsWithAnswers.map(
                    (question) => 
                        question.question + answersSeparator +
                        question.answer1 + answersSeparator +
                        question.answer2 + answersSeparator +
                        question.answer3 + answersSeparator +
                        question.answer4
                ),
                price ? BigInt(price * 1e18) : BigInt(0),
                BigInt(baseScore ? baseScore : Math.ceil(questionsWithAnswers.length / 2)),
                imageUrl || defaultImage,
                maxSubmissions ? BigInt(maxSubmissions) : BigInt(0),
                userClaimsWithPassword,
            ],
            value: examCreationFeeInEth,
        });
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const returnedImageUrl = await singleUpload(file, file.name);
            setImageUrl(returnedImageUrl);
            console.log("Uploaded image url: ", returnedImageUrl);
        }, []
    );

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [] } });
    const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined = createRef();

    return (
        <PageWrapper>
            <Title>
                <Flex>
                    <Box>
                        Create Exams
                    </Box>
                    <Spacer />
                    <Link href="/docs">
                        <Button className="bg-base-100 text-sm" onClick={undefined}>
                            Documentation
                        </Button>
                    </Link>
                </Flex>
            </Title>
            <div>
                <InputLabel>Name *</InputLabel>
                <Input
                    value={name}
                    type="text"
                    placeholder="Name"
                    onChange={(e: any) => {
                        setname(e.target.value);
                    }}
                />
                <InputLabel>Description *</InputLabel>
                <TextArea
                    value={description}
                    placeholder="Description"
                    onChange={(e: any) => {
                        setDescription(e.target.value);
                    }}
                />
                <InputLabel>End Time *</InputLabel>
                <Input
                    value={endTime}
                    type="datetime-local"
                    onChange={(e: any) => {
                        setendTime(e.target.value);
                    }}
                />
                <InputLabel>Questions *</InputLabel>
                {questionsWithAnswers.map((question, indx) => (
                    <>
                    <TextArea
                        key={""+indx}
                        value={question.question}
                        placeholder={`Question ${indx+1}`}
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) =>
                                n===indx ?
                                { ...q, question: e.target.value }
                                : q
                            ));
                        }}
                    />
                    <Input
                        key={"a1"+indx}
                        value={question.answer1}
                        type="text"
                        placeholder="Answer 1"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===indx?{...q, answer1: e.target.value}:q));
                        }}
                    />
                    <Input
                        key={"a2"+indx}
                        value={question.answer2}
                        type="text"
                        placeholder="Answer 2"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===indx?{...q, answer2: e.target.value}:q));
                        }}
                    />
                    <Input
                        key={"a3"+indx}
                        value={question.answer3}
                        type="text"
                        placeholder="Answer 3"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===indx?{...q, answer3: e.target.value}:q));
                        }}
                    />
                    <Input
                        key={"a4"+indx}
                        value={question.answer4}
                        type="text"
                        placeholder="Answer 4"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===indx?{...q, answer4: e.target.value}:q));
                        }}
                    />
                </>
                ))}

                <Button className="bg-base-100" onClick={() => // add empty question
                    setQuestionsWithAnswers([
                        ...questionsWithAnswers, emptyQuestionWithAnswers
                    ])}
                    >
                    Add Question
                </Button>
                <Button className="bg-base-100" onClick={() => {
                    if (questionsWithAnswers.length > 1) setQuestionsWithAnswers([...questionsWithAnswers.slice(0, -1)])
                }}>
                    Remove Question
                </Button>

                <InputLabel>Image (square) | optional</InputLabel>
                <div className="my-4 w-[350px] border border-accent rounded-lg">
                    <div
                        {...getRootProps()}
                        ref={dropZoneRef}
                        className="m-auto my-6 w-[300px] h-[300px] bg-neutral flex justify-center items-center rounded-lg"
                    >
                        <input {...getInputProps()} />
                        <div className={(imageUrl ? "auto" : "cursor-pointer")}>
                        {imageUrl ?
                        (
                            <div className="self-center flex justify-center items-center w-full h-full">
                                <img src={imageUrl} className="max-w-full max-h-full" />
                            </div>
                        ) :
                        (
                            <div className="self-center flex flex-col justify-center ">
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="text-gray-300">Upload Image</div>
                            </div>
                        )}
                        </div>
                    </div>

                    <div className="m-auto divider my-4 max-w-[300px]">OR</div>
                        <Input
                            placeholder="https://ipfs.io/pathToImage.jpg"
                            value={imageUrl}
                            onChange={(e: any) => setImageUrl(e.target.value)}
                            className='m-auto my-4'
                    />
                </div>

                <Accordion.Root className="mt-9" collapsible>
                    <Accordion.Item value={"1"}>
                        <Accordion.ItemTrigger>
                        <span className={'border bg-base-100 border-primary text-primary rounded-lg p-2 mt-2 text-xl hover:bg-base-200 hover:text-accent hover:border-2 hover:border-accent'}>
                            <div className="flex items-center mr-1">
                            <ArrowDownIcon className="h-4 w-4 mr-2 text-primary hover:text-accent" aria-hidden="true" />
                            Advanced Settings
                            </div>
                        </span>
                        <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <InputLabel>Price ($) | Default: $0</InputLabel>
                            <Input
                                value={price}
                                type="number"
                                placeholder="Price"
                                onChange={(e: any) => {
                                    if (e.target.value >= 0)
                                    setprice(e.target.value);
                                }}
                            />
                            <InputLabel>Base Score | Default: 50%</InputLabel>
                            <Input
                                value={baseScore}
                                className="mb-4"
                                type="number"
                                placeholder="Base Score"
                                onChange={(e: any) => {
                                    setbaseScore(e.target.value);
                                }}
                            />
                            <InputLabel>Max Submissions | Default: 0 (unlimited)</InputLabel>
                            <Input
                                value={maxSubmissions}
                                className="mb-4"
                                type="number"
                                placeholder="Max Submissions"
                                onChange={(e: any) => {
                                    setmaxSubmissions(e.target.value);
                                }}
                            />
                            {/* <label className={`${labelMarginAndPadding}`} title="Default: User Claims with Cookies">User Claims with Password | Default: false</label>
                            <input
                                className="ml-2 mb-4 w-6 h-6 accent-base-100 cursor-pointer"
                                checked={userClaimsWithPassword}
                                type="checkbox"
                                onChange={(e: any) => { setUserClaimsWithPassword(e.target.checked); }}
                            /> */}
                        </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>

                <Text mt="9" color="grey" display="block">
                    Exam Creation Fee: ${(examCreationFee ? (Math.round(Number(examCreationFee) / 1e16) / 1e2) : 0).toString()}
                </Text>
                {!requiredDetailsAreFilled() && <Text mt="2" color="red" display="block">* Fields are required</Text>}
                <Button disabled={!requiredDetailsAreFilled()} onClick={handleCreateExam} className="block mt-3 bg-base-100" >
                    Create Exam
                </Button>
            </div>
        </PageWrapper>
    )
}

export default CreateExam;