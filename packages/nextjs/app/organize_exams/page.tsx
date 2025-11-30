"use client";

import React, { useEffect } from "react";
import { createRef, useCallback, useState } from "react";
import { Button, Title, Input, ResponsivePageWrapper, ButtonLink } from "~~/components";
import { useDropzone } from "react-dropzone";
import { singleUpload } from "~~/services/ipfs";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { answersSeparator, defaultImage, timePerQuestion } from "~~/constants";
import { Accordion, Box, Text, Flex, Spacer, Slider, useSlider, HStack } from "@chakra-ui/react"
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite'
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import InputLabel from "./_components/InputLabel";
import TextArea from "./_components/TextArea";
import { useAccount } from "wagmi";
import { ProgressBar, IndexSelector } from '~~/components';
import { FileUpload } from "@chakra-ui/react"
import { HiUpload } from "react-icons/hi"
import { DocsPage } from '~~/types/DocsPage';
import { downloadQuestionsTemplate, handleFileAccept } from "./helpers";
import { getExamsStringFromGraph } from "./helpers";


const CreateExam = () => {
    const emptyQuestionWithAnswers = {question: "", answer1: "", answer2: "", answer3: "", answer4: ""};
    const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswers[]>([emptyQuestionWithAnswers]);

    const [name, setname] = useState<string>("");
    const [examDescription, setExamDescription] = useState<string>("");
    const [rewardDescription, setRewardDescription] = useState<string>("");
    const [eligibilityCriteria, setEligibilityCriteria] = useState<string>("");
    const [examResources, setExamResources] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [price, setPrice] = useState<number>();
    const [baseScore, setBaseScore] = useState<number>(1);
    const [maxSubmissions, setMaxSubmissions] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [showButtonToViewExam, setShowButtonToViewExam] = useState<boolean>(false);
    const { chain } = useAccount();
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const returnedImageUrl = await singleUpload(file, file.name);
            setImageUrl(returnedImageUrl);
            console.log("Uploaded image url: ", returnedImageUrl);
        }, []
    );
    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { "image/*": [] } });
    const dropZoneRef: React.Ref<HTMLDivElement> | undefined = createRef();

    const description = examDescription
        + (rewardDescription ? "\n\nReward Description:\n" + rewardDescription : "")
        + (eligibilityCriteria ? "\n\nEligibility Criteria:\n" + eligibilityCriteria : "")
        + (examResources ? "\n\nResources:\n" + examResources : "");

    const requiredDetailsAreFilled = () => {
        return name&&examDescription&&endTime&&questionsWithAnswers[0];
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
                    BigInt(baseScore),
                    imageUrl || defaultImage,
                    maxSubmissions ? BigInt(maxSubmissions) : BigInt(0),
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
        setBaseScore(Math.ceil(questionsWithAnswers.length / 2));
    }, [questionsWithAnswers]);

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
                    questions: questionsWithAnswers.map(q => ({
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

            <div>
                <InputLabel>Image (square)</InputLabel>
                <div className="my-4 w-[350px] border border-neutral rounded-lg">
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

                <InputLabel>Name *</InputLabel>
                <Input
                    value={name}
                    type="text"
                    placeholder="Name"
                    onChange={(e: any) => {
                        setname(e.target.value);
                    }}
                />
                <InputLabel>Exam Description *</InputLabel>
                <TextArea
                    value={examDescription}
                    placeholder="Exam Description"
                    onChange={(e: any) => {
                        setExamDescription(e.target.value);
                    }}
                />
                <InputLabel>Reward Description</InputLabel>
                <TextArea
                    value={rewardDescription}
                    placeholder="Reward Description"
                    onChange={(e: any) => {
                        setRewardDescription(e.target.value);
                    }}
                />
                <InputLabel>Eligibility Criteria</InputLabel>
                <TextArea
                    value={eligibilityCriteria}
                    placeholder="Eligibility Criteria"
                    onChange={(e: any) => {
                        setEligibilityCriteria(e.target.value);
                    }}
                />
                <InputLabel>Exam resources</InputLabel>
                <TextArea
                    value={examResources}
                    placeholder="Exam Resources"
                    onChange={(e: any) => {
                        setExamResources(e.target.value);
                    }}
                />
                <InputLabel>End Time *</InputLabel>
                <Input
                    value={endTime}
                    type="datetime-local"
                    onChange={(e: any) => {
                        setEndTime(e.target.value);
                    }}
                />

                <Accordion.Root  borderY="1px solid" borderColor="lighterLighterBlack" mt="12" mb="0" py="2" collapsible>
                    <Accordion.Item value={"1"}>
                        <Accordion.ItemTrigger>
                        <Text fontWeight="semibold" fontSize={"lg"}>
                            Advanced Settings
                        </Text>
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
                                    setPrice(e.target.value);
                                }}
                            />
                            <InputLabel>Base Score</InputLabel>
                            <HStack ml="3">
                                <Slider.Root value={[baseScore]} onValueChange={(v: any) => setBaseScore(v.value)} width="200px" max={questionsWithAnswers.length}>
                                    <Slider.Control>
                                        <Slider.Track>
                                            <Slider.Range />
                                        </Slider.Track>
                                        <Slider.Thumbs />
                                    </Slider.Control>
                                </Slider.Root>
                                <Box ml="2">{baseScore}</Box>
                            </HStack>

                            <InputLabel>Max Submissions | Default: 0 (unlimited)</InputLabel>
                            <Input
                                value={maxSubmissions}
                                className="mb-4"
                                type="number"
                                placeholder="Max Submissions"
                                onChange={(e: any) => {
                                    setMaxSubmissions(e.target.value);
                                }}
                            />
                        </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>

                <Box mt="8">Questions *</Box>
                {questionsWithAnswers && questionsWithAnswers.length > 1 &&
                    <ProgressBar questions={questionsWithAnswers.map(q => q.question)} questionNumber={questionNumber} />
                }
                <Box mt="6">
                    <Text color="green" m="0" p="0">Question {questionNumber}</Text>
                    
                    <TextArea
                        className="mb-8"
                        key={""+questionNumber}
                        value={questionsWithAnswers[questionNumber-1].question}
                        placeholder={`Question ${questionNumber}`}
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) =>
                                n===questionNumber-1 ?
                                { ...q, question: e.target.value }
                                : q
                            ));
                        }}
                    />
                    <Input
                        className="w-[90%]"
                        key={"a1"+questionNumber}
                        value={questionsWithAnswers[questionNumber-1].answer1}
                        type="text"
                        placeholder="Answer 1"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===questionNumber-1?{...q, answer1: e.target.value}:q));
                        }}
                    />
                    <Input
                        className="w-[90%]"
                        key={"a2"+questionNumber}
                        value={questionsWithAnswers[questionNumber-1].answer2}
                        type="text"
                        placeholder="Answer 2"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===questionNumber-1?{...q, answer2: e.target.value}:q));
                        }}
                    />
                    <Input
                        className="w-[90%]"
                        key={"a3"+questionNumber}
                        value={questionsWithAnswers[questionNumber-1].answer3}
                        type="text"
                        placeholder="Answer 3"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===questionNumber-1?{...q, answer3: e.target.value}:q));
                        }}
                    />
                    <Input
                        className="w-[90%]"
                        key={"a4"+questionNumber}
                        value={questionsWithAnswers[questionNumber-1].answer4}
                        type="text"
                        placeholder="Answer 4"
                        onChange={(e: any) => {
                            setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n===questionNumber-1?{...q, answer4: e.target.value}:q));
                        }}
                    />
                    
                    {/* <div className="my-4">
                        <Input
                            value={questionsWithAnswers[questionNumber-1].completionTime}
                            type="number"
                            placeholder={`Timer (default: ${timePerQuestion} sec)`}
                            onChange={(e: any) => {
                                const time = parseInt(e.target.value, 10);
                                setQuestionsWithAnswers(questionsWithAnswers.map((q, n) => n === questionNumber-1 ? {...q, completionTime: isNaN(time) ? undefined : time } : q));
                            }}
                        />
                        {questionsWithAnswers[questionNumber-1].completionTime !== undefined && questionsWithAnswers[questionNumber-1].completionTime <= 0 && (
                            <Text color="red" display="block" mt="1">Time must be greater than 0.</Text>
                        )}
                    </div> */}
                </Box>

                <IndexSelector
                    setIndex={setQuestionNumber}
                    index={questionNumber}
                    firstIndex={1}
                    lastIndex={questionsWithAnswers.length}
                />

                <Box mt="4"></Box>

                <Button onClick={() => {
                    setQuestionNumber(questionsWithAnswers.length + 1);
                    // add empty question
                    setQuestionsWithAnswers([ ...questionsWithAnswers, emptyQuestionWithAnswers ]);
                }}>
                    Add Question
                </Button>
                <Button onClick={() => {
                    if (questionsWithAnswers.length > 1) {
                        if (questionNumber === questionsWithAnswers.length)
                            setQuestionNumber(questionsWithAnswers.length - 1)
                        setQuestionsWithAnswers([...questionsWithAnswers.slice(0, questionNumber-1), ...questionsWithAnswers.slice(questionNumber)])
                    }
                }}>
                    Remove Question
                </Button>

                {/* Upload txt file with questions */}
                <Box mt="8">
                    Alternatively, you can upload a text file with the questions. It should follow <Box display="inline" textDecoration="underline" cursor="pointer" onClick={downloadQuestionsTemplate}>this</Box> template.
                </Box>
                <FileUpload.Root accept={["text/plain"]} onFileAccept={(details) => handleFileAccept(details, setQuestionNumber, setQuestionsWithAnswers)} mt="2">
                    <FileUpload.HiddenInput />
                    <FileUpload.Trigger asChild>
                        <Box display="flex" alignItems="center" gap="2" border="1px solid" borderColor="lighterLighterBlack" px="4" py="2" mt="2" cursor="pointer">
                            <HiUpload />
                            Upload file
                        </Box>
                    </FileUpload.Trigger>
                    {/* <FileUpload.List /> */}
                </FileUpload.Root>
                
                <Text borderTop="1px solid" mt="8" borderColor="lighterLighterBlack"></Text>

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