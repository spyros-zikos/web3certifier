import React from 'react'
import { Accordion, Box, Text, Slider, HStack, FileUpload } from "@chakra-ui/react"
import { Button, Input, ProgressBar, IndexSelector } from "~~/components";
import { InputLabel, TextArea } from './components';
import { downloadQuestionsTemplate, handleFileAccept } from "./helpers";
import { HiUpload } from "react-icons/hi"
import { PhotoIcon } from "@heroicons/react/24/outline";
import { emptyQuestionWithAnswers } from "~~/constants";


const ExamDataForm = ({
    examData,
    setExamData,
    questionNumber,
    setQuestionNumber,
    getRootProps,
    getInputProps,
    dropZoneRef,
}: {
    examData: ExamFormData;
    setExamData: React.Dispatch<React.SetStateAction<ExamFormData>>;
    questionNumber: number;
    setQuestionNumber: React.Dispatch<React.SetStateAction<number>>;
    getRootProps: any;
    getInputProps: any;
    dropZoneRef: React.Ref<HTMLDivElement> | undefined;
}) => {
    return (
        <div>
            <InputLabel>Image (square)</InputLabel>
            <div className="my-4 w-[350px] border border-neutral rounded-lg">
                <div
                    {...getRootProps()}
                    ref={dropZoneRef}
                    className="m-auto my-6 w-[300px] h-[300px] bg-neutral flex justify-center items-center rounded-lg"
                >
                    <input {...getInputProps()} />
                    <div className={(examData.imageUrl ? "auto" : "cursor-pointer")}>
                    {examData.imageUrl ?
                    (
                        <div className="self-center flex justify-center items-center w-full h-full">
                            <img src={examData.imageUrl} className="max-w-full max-h-full" />
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
                    value={examData.imageUrl}
                    onChange={(e: any) => setExamData({ ...examData, imageUrl: e.target.value })}
                    className='m-auto my-4'
                />
            </div>

            <InputLabel>Name *</InputLabel>
            <Input
                value={examData.name}
                type="text"
                placeholder="Name"
                onChange={(e: any) => {
                    setExamData({ ...examData, name: e.target.value });
                }}
            />
            <InputLabel>Exam Description *</InputLabel>
            <TextArea
                value={examData.examDescription}
                placeholder="Exam Description"
                onChange={(e: any) => {
                    setExamData({ ...examData, examDescription: e.target.value });
                }}
            />
            <InputLabel>Exam Resources</InputLabel>
            <TextArea
                value={examData.examResources}
                placeholder="Exam Resources"
                onChange={(e: any) => {
                    setExamData({ ...examData, examResources: e.target.value });
                }}
            />
            <InputLabel>Reward Description</InputLabel>
            <TextArea
                value={examData.rewardDescription}
                placeholder="Reward Description"
                onChange={(e: any) => {
                    setExamData({ ...examData, rewardDescription: e.target.value });
                }}
            />

            <InputLabel>End Time *</InputLabel>
            <Input
                value={examData.endTime}
                type="datetime-local"
                onChange={(e: any) => {
                    setExamData({ ...examData, endTime: e.target.value });
                }}
            />

            <Text borderTop="1px solid" mt="12" borderColor="lighterLighterBlack"></Text>

            {/* EXAM QUESTIONS */}
            <Box mt="8">Questions *</Box>
            {examData.questionsWithAnswers && examData.questionsWithAnswers.length > 1 &&
                <ProgressBar questions={examData.questionsWithAnswers.map((q: any) => q.question)} questionNumber={questionNumber} />
            }
            <Box mt="6">
                <Text color="green" m="0" p="0">Question {questionNumber}</Text>
                
                <TextArea
                    className="mb-8"
                    key={""+questionNumber}
                    value={examData.questionsWithAnswers![questionNumber-1].question}
                    placeholder={`Question ${questionNumber}`}
                    onChange={(e: any) => {
                        setExamData({ ...examData, questionsWithAnswers: examData.questionsWithAnswers!.map((q:any, n: any) =>
                            n===questionNumber-1 ?
                            { ...q, question: e.target.value }
                            : q
                        ) });
                    }}
                />
                <Input
                    className="w-[90%]"
                    key={"a1"+questionNumber}
                    value={examData.questionsWithAnswers![questionNumber-1].answer1}
                    type="text"
                    placeholder="Answer 1"
                    onChange={(e: any) => {
                        setExamData({ ...examData, questionsWithAnswers: examData.questionsWithAnswers!.map((q: any, n: any) => n===questionNumber-1?{...q, answer1: e.target.value}:q) });
                    }}
                />
                <Input
                    className="w-[90%]"
                    key={"a2"+questionNumber}
                    value={examData.questionsWithAnswers![questionNumber-1].answer2}
                    type="text"
                    placeholder="Answer 2"
                    onChange={(e: any) => {
                        setExamData({ ...examData, questionsWithAnswers: examData.questionsWithAnswers!.map((q: any, n: any) => n===questionNumber-1?{...q, answer2: e.target.value}:q) });
                    }}
                />
                <Input
                    className="w-[90%]"
                    key={"a3"+questionNumber}
                    value={examData.questionsWithAnswers![questionNumber-1].answer3}
                    type="text"
                    placeholder="Answer 3"
                    onChange={(e: any) => {
                        setExamData({ ...examData, questionsWithAnswers: examData.questionsWithAnswers!.map((q: any, n: any) => n===questionNumber-1?{...q, answer3: e.target.value}:q) });
                    }}
                />
                <Input
                    className="w-[90%]"
                    key={"a4"+questionNumber}
                    value={examData.questionsWithAnswers![questionNumber-1].answer4}
                    type="text"
                    placeholder="Answer 4"
                    onChange={(e: any) => {
                        setExamData({ ...examData, questionsWithAnswers: examData.questionsWithAnswers!.map((q: any, n: any) => n===questionNumber-1?{...q, answer4: e.target.value}:q) });
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
                lastIndex={examData.questionsWithAnswers!.length}
            />

            <Box mt="4"></Box>

            <Button onClick={() => {
                setQuestionNumber(examData.questionsWithAnswers!.length + 1);
                // add empty question
                setExamData({ ...examData, questionsWithAnswers: [ ...examData.questionsWithAnswers!, emptyQuestionWithAnswers ] });
            }}>
                Add Question
            </Button>
            <Button onClick={() => {
                if (examData.questionsWithAnswers!.length > 1) {
                    if (questionNumber === examData.questionsWithAnswers!.length)
                        setQuestionNumber(examData.questionsWithAnswers!.length - 1)
                    setExamData({ ...examData, questionsWithAnswers: [...examData.questionsWithAnswers!.slice(0, questionNumber-1), ...examData.questionsWithAnswers!.slice(questionNumber)] } );
                }
            }}>
                Remove Question
            </Button>

            {/* Upload txt file with questions */}
            <Box mt="8">
                Alternatively, you can upload a text file with the questions. It should follow <Box display="inline" textDecoration="underline" cursor="pointer" onClick={downloadQuestionsTemplate}>this</Box> template.
            </Box>
            <FileUpload.Root accept={["text/plain"]} onFileAccept={(details) => handleFileAccept(details, setQuestionNumber, examData, setExamData)} mt="2">
                <FileUpload.HiddenInput />
                <FileUpload.Trigger asChild>
                    <Box display="flex" alignItems="center" gap="2" border="1px solid" borderColor="lighterLighterBlack" px="4" py="2" mt="2" cursor="pointer">
                        <HiUpload />
                        Upload file
                    </Box>
                </FileUpload.Trigger>
            </FileUpload.Root>

            {/* ADVANCED SETTINGS */}
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
                        <InputLabel>Base Score</InputLabel>
                        <HStack ml="3">
                            <Slider.Root value={[examData.baseScore!]} onValueChange={(v: any) => setExamData({...examData, baseScore: v.value})} width="200px" max={examData.questionsWithAnswers!.length}>
                                <Slider.Control>
                                    <Slider.Track>
                                        <Slider.Range />
                                    </Slider.Track>
                                    <Slider.Thumbs />
                                </Slider.Control>
                            </Slider.Root>
                            <Box ml="2">{examData.baseScore}</Box>
                        </HStack>

                        <InputLabel>Max Submissions | Default: 0 (unlimited)</InputLabel>
                        <Input
                            value={examData.maxSubmissions}
                            className="mb-4"
                            type="number"
                            placeholder="Max Submissions"
                            onChange={(e: any) => {
                                setExamData({ ...examData, maxSubmissions: Number(e.target.value) });
                            }}
                        />
                    </Accordion.ItemBody>
                    </Accordion.ItemContent>
                </Accordion.Item>
            </Accordion.Root>
        </div>
    )
}

export default ExamDataForm