import React, { useEffect, useState } from "react"
import { IndexSelector } from "~~/components/IndexSelector";
import { MessageForUser, Question } from "../_components";
import { Box, Button, Table } from "@chakra-ui/react";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { useAccount } from "wagmi";
import { ZERO_ADDRESS } from "thirdweb";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import { downloadListAsTxt } from "~~/utils/downloadListAsTxt";
import examStageMessageFunction from "../_components/examStageMessage";
import { ExamStage } from "~~/types/ExamStage";

const DownloadButton = ({onClick}: {onClick: any}) => {
    return <Box position="absolute" top="1" right="2">
        <Button
            onClick={onClick}
            size="sm"
            color="black"
        >
            <ArrowDownOnSquareIcon />
        </Button>
    </Box>
}

const TableFromList = ({list, title, download}: {list: readonly string[] | undefined, title: string, download: any}) => {
    if (!list) return <></>
    return <Box w="100%" h="300px" overflowX="auto" mt="8" borderRadius={"2xl"} border="2px solid" borderColor={"black"} position="relative">
                <Table.Root variant="outline" bgColor={"green"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>{title}</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {list.map((item, index) => <Table.Row key={index}>
                            <Table.Cell>{item}</Table.Cell>
                        </Table.Row>)}
                    </Table.Body>
                </Table.Root>


                <DownloadButton onClick={download} />
            </Box>
}

const CertifierCorrected = ({
    exam, id
}: {
    exam: Exam | undefined, id: bigint
}) => {
    const { chain } = useAccount();

    const [questionNumber, setQuestionNumber] = useState<number>(1);
    const [avgScore, setAvgScore] = useState<number>(1);
    const [avgSuccessScore, setAvgSuccessScore] = useState<number>(1);
    const [avgFailScore, setAvgFailScore] = useState<number>(1);

    const rewardAddress = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    const usersThatClaimedReward = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUsersThatClaimed",
    }).data;


    // avg score
    useEffect(() => {
        fetch("api/exam_page/certifier/stats/avgScore/?examId=" + id + "&chainId=" + chain?.id)
        .then(response => response.json())
        .then(data => setAvgScore(data.toFixed(2)));
    }, [id, chain]);

    // avg success score
    useEffect(() => {
        fetch("api/exam_page/certifier/stats/avgSuccessScore/?examId=" + id + "&chainId=" + chain?.id)
        .then(response => response.json())
        .then(data => setAvgSuccessScore(data.toFixed(2)));
    }, [id, chain]);

    // avg fail score
    useEffect(() => {
        fetch("api/exam_page/certifier/stats/avgFailScore/?examId=" + id + "&chainId=" + chain?.id)
        .then(response => response.json())
        .then(data => setAvgFailScore(data.toFixed(2)));
    }, [id, chain]);

    return (
        <>
            {/* Questions */}
            <Question questionNumber={questionNumber} exam={exam} showAnswers={false} />

            <IndexSelector
                setIndex={setQuestionNumber}
                index={questionNumber}
                firstIndex={1}
                lastIndex={exam?.questions ? exam?.questions.length : 1}
            />

            <MessageForUser message={examStageMessageFunction(ExamStage.Certifier_Corrected)()} />

            {/* Stats Table */}
            <Box w="100%" overflowX="auto" mt="8" borderRadius={"2xl"} border="2px solid" borderColor={"black"}>
                <Table.Root variant="outline" bgColor={"green"}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Statistic</Table.ColumnHeader>
                            <Table.ColumnHeader>Value</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Submissions</Table.Cell>
                            <Table.Cell>{exam && exam?.users.length}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Successful submissions</Table.Cell>
                            <Table.Cell>{exam && exam.tokenIds.length}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Failed submissions</Table.Cell>
                            <Table.Cell>
                                {exam && exam.users.map(user => wagmiReadFromContract({
                                    functionName: "getUserStatus",
                                    args: [user, id],
                                }).data).filter(status => status === 3).length}
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Average score of submissions</Table.Cell>
                            <Table.Cell>{avgScore}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Average score of successful submissions</Table.Cell>
                            <Table.Cell>{avgSuccessScore}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Average score of failed submissions</Table.Cell>
                            <Table.Cell>{avgFailScore}</Table.Cell>
                        </Table.Row>
                        {exam?.price && <Table.Row>
                            <Table.Cell>Revenue (in $)</Table.Cell>
                            <Table.Cell>{exam ? Number(exam.price) * exam.users.length / 1e18 : 0}</Table.Cell>
                        </Table.Row>}
                        {rewardAddress !== ZERO_ADDRESS && <Table.Row>
                            <Table.Cell>Number of users that claimed the reward</Table.Cell>
                            <Table.Cell>{usersThatClaimedReward ? usersThatClaimedReward.length : 0}</Table.Cell>
                        </Table.Row>}
                    </Table.Body>
                </Table.Root>
            </Box>

            {/* Submitters Table */}
            <TableFromList 
                list={exam?.users}
                title={"Users that submitted"}
                download={() => downloadListAsTxt(exam?.users, `exam-${id}-submitters`)}
            />

            {/* Users that claimed the reward Table */}
            <TableFromList 
                list={usersThatClaimedReward}
                title={"Users that claimed the reward"}
                download={() => downloadListAsTxt(usersThatClaimedReward, `exam-${id}-reward-claimers`)}
            />
        </>
    );
}

export default CertifierCorrected