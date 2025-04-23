"use client";

import React from "react";
import { createRef, useCallback, useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { Button, Title, Input, Text, TextArea, PageWrapper } from "~~/components";
import { useDropzone } from "react-dropzone";
import { singleUpload } from "~~/services/ipfs";
import { PhotoIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { defaultImage } from "~~/utils/constants/constants";
import { Accordion } from "@chakra-ui/react"


const CreateExam = () => {
    const router = useRouter();
    const [questions, setQuestions] = useState<string[]>([""]);
    const [name, setname] = useState<string>("");
    const [description, setdescription] = useState<string>("");
    const [endTime, setendTime] = useState<string>("");
    const [price, setprice] = useState<number>();
    const [baseScore, setbaseScore] = useState<string>("");
    const [maxSubmissions, setmaxSubmissions] = useState<string>("");
    const [userClaimsWithPassword, setUserClaimsWithPassword] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>("");

    const requiredDetailsAreFilled = () => {
        return name&&description&&endTime&&questions[0];
    }

    // Get exam creation fee (in $)
    const { data: examCreationFee } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExamCreationFee"
    });
    // Get exam creation fee (in ETH)
    const { data: examCreationFeeInEth } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUsdToEthRate",
        args: [examCreationFee ? examCreationFee : BigInt(0)],
    });

    const { writeContractAsync: createExam } = useScaffoldWriteContract("Certifier");
    const handleCreateExam = async () => {
        console.log("Exam creation begun");
        try {
        await createExam(
            {
            functionName: "createExam",
            args: [
                name,
                description,
                BigInt(new Date(endTime.toString()).getTime() / 1000),
                questions,
                price ? BigInt(price * 1e18) : BigInt(0),
                BigInt(baseScore ? baseScore : Math.ceil(questions.length / 2)),
                imageUrl || defaultImage,
                maxSubmissions ? BigInt(maxSubmissions) : BigInt(0),
                userClaimsWithPassword,
            ],
            value: examCreationFeeInEth,
            },
            {
            onBlockConfirmation: res => {
                console.log("block confirm", res);
                // router.push(`/`);
            },
            },
        );
        } catch (error) {
          console.log("create exam error", error);
        }
    };
    
    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            const returnedImageUrl = await singleUpload(file, file.name);
            setImageUrl(returnedImageUrl);
            console.log("Uploaded image url: ", returnedImageUrl);
        }, []
    );

    const { getRootProps } = useDropzone({ onDrop, accept: { "image/*": [] } });
    const dropZoneRef: React.LegacyRef<HTMLDivElement> | undefined = createRef();

    const labelMarginAndPadding = 'm-2 mt-4 block';

    return (
        <PageWrapper>
            <Title>Create Exams</Title>
            <div>
                <label className={`${labelMarginAndPadding}`}>Name *</label>
                <Input
                    value={name}
                    type="text"
                    placeholder="Name"
                    onChange={(e: any) => {
                        setname(e.target.value);
                    }}
                />
                <label className={`${labelMarginAndPadding}`}>Description *</label>
                <Input
                    value={description}
                    type="text"
                    placeholder="Description"
                    onChange={(e: any) => {
                        setdescription(e.target.value);
                    }}
                />
                <label className={`${labelMarginAndPadding}`}>End Time *</label>
                <Input
                    value={endTime}
                    type="datetime-local"
                    onChange={(e: any) => {
                        setendTime(e.target.value);
                    }}
                />
                <label className={`${labelMarginAndPadding}`}>Questions *</label>
                {questions.map((question, indx) => (
                    <TextArea
                    key={indx}
                    value={question}
                    placeholder={`Question ${indx+1}`}
                    onChange={(e: any) => {
                        setQuestions(questions.map((q, n) => n===indx?e.target.value:q));
                    }}
                />
                ))}

                <Button className="bg-base-100" onClick={() => setQuestions([...questions, ""])}>
                    Add Question
                </Button>
                <Button className="bg-base-100" onClick={() => { if (questions.length > 1) setQuestions([...questions.slice(0, -1)]) }}>
                    Remove Question
                </Button>

                <label className={`${labelMarginAndPadding} block`}>Image (optional)</label>
                <div className="ml-2 my-4 w-[350px] border border-accent rounded-lg">
                    <div
                        {...getRootProps()}
                        ref={dropZoneRef}
                        className="m-auto my-6 w-[300px] h-[300px] bg-neutral flex justify-center items-center rounded-lg"
                    >
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
                        <span className={'border bg-base-100 border-primary text-primary rounded-lg p-2 ml-2 mt-2 text-xl hover:bg-base-200 hover:text-accent hover:border-2 hover:border-accent'}>
                            <div className="flex items-center mr-1">
                            <ArrowDownIcon className="h-4 w-4 mr-2 text-primary hover:text-accent" aria-hidden="true" />
                            Advanced Settings
                            </div>
                        </span>
                        <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                        <Accordion.ItemBody>
                            <label className={`${labelMarginAndPadding}`}>Price ($) | Default: $0</label>
                            <Input
                                value={price}
                                type="number"
                                placeholder="Price"
                                onChange={(e: any) => {
                                    if (e.target.value >= 0)
                                    setprice(e.target.value);
                                }}
                            />
                            <label className={`${labelMarginAndPadding}`}>Base Score | Default: 50%</label>
                            <Input
                                value={baseScore}
                                className="mb-4"
                                type="number"
                                placeholder="Base Score"
                                onChange={(e: any) => {
                                    setbaseScore(e.target.value);
                                }}
                            />
                            <label className={`${labelMarginAndPadding}`}>Max Submissions | Default: 0 (unlimited)</label>
                            <Input
                                value={maxSubmissions}
                                className="mb-4"
                                type="number"
                                placeholder="Max Submissions"
                                onChange={(e: any) => {
                                    setmaxSubmissions(e.target.value);
                                }}
                            />
                            <label className={`${labelMarginAndPadding}`} title="Default: User Claims with Cookies">User Claims with Password | Default: false</label>
                            <input
                                className="ml-2 mb-4 w-6 h-6 accent-base-100 cursor-pointer"
                                checked={userClaimsWithPassword}
                                type="checkbox"
                                onChange={(e: any) => { setUserClaimsWithPassword(e.target.checked); }}
                            />
                        </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                </Accordion.Root>

                {!requiredDetailsAreFilled() && <Text mt="10" color="red" display="block">* Fields are required</Text>}
                <Text mt="3" ml="2" color="grey" display="block">
                    Exam Creation Fee: ${(examCreationFee ? (Math.round(Number(examCreationFee) / 1e16) / 1e2) : 0).toString()}
                </Text>
                <Button disabled={!requiredDetailsAreFilled()} onClick={handleCreateExam} className="block mt-3 bg-base-100" >
                    Create Exam
                </Button>
            </div>
        </PageWrapper>
    )
}

export default CreateExam;