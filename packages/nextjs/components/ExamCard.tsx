import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { Button, Card, EtherInput } from "~~/components";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";

interface CardProps {
    className?: string;
    id: bigint;
    searchTerm: string;
}

const ExamCard: React.FC<CardProps> = ({ className, id, searchTerm = "" }) => {
    const router = useRouter();
    
    const exam: Exam | undefined = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getExam",
        args: [BigInt(id)],
    }).data;

    const endDate = exam && new Date(Number(exam.endTime.toString()) * 1000);
    
    let dataString = "";
    if (exam)
        for (const [_, value] of Object.entries(exam!)) {
            dataString += `${value}`;
        }

    const needsCorrecting = exam && (exam.status === 0 &&
        (BigInt(exam.endTime.toString()) < BigInt(Math.floor(new Date().getTime() / 1000))));

    return (
        exam?.name &&
        dataString.includes(searchTerm) && (
        <Card
            title={exam?.name}
            className={`${className || ""}`}
            imageUrl={exam?.imageUrl}
            footer={
                <Button className="w-full" onClick={()=>{router.push(`/exam_page?id=${id}`);}}>
                    Explore
                </Button>
            }
            compact={true}
        >
            {exam.description}
            <SimpleGrid columns={2} gap={2}>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="4">Price</Text>
                </Box>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="4">Status</Text>
                </Box>

                <Box fontWeight="bold">
                    {/* <div className="w-[150px]">{// TODO: fix the etherInput to show the dollar amount
                    }
                    <EtherInput usdMode={true} value={(parseFloat(exam.price.toString())/1e18).toString()} onChange={() => {}} />
                    </div> */}
                    ${parseFloat(exam.price.toString())/1e18}
                </Box>
                <Box fontWeight="bold" w="120px">
                    {
                    needsCorrecting ? "Needs Correcting" :
                        exam.status === 0 ? "Started" :
                        exam.status === 1 ? "Cancelled" :
                        "Ended"
                    }
                </Box>

                <Box>
                    <Text fontSize="12" p="0" m="0" mt="4">End Time</Text>
                </Box>
                <Box>
                    <Text fontSize="12" p="0" m="0" mt="4">Certifier</Text>
                </Box>

                {/* <Box fontWeight="bold">{exam.endTime.toString()}</Box> */}
                {/* <Box fontWeight="bold">{new Date(Number(exam.endTime)).toString()}</Box> */}

                <Box fontWeight="bold">
                    {
                        endDate?.toLocaleString().split(",")[0]+"\n"+
                        (endDate?.toLocaleString().slice(-2)==="AM" ?
                            (
                                Number(endDate?.toLocaleString().split(",")[1].slice(0, -9)) === 12 ?
                                    ("00" + endDate?.toLocaleString().split(",")[1].slice(3, -3)) :
                                    endDate?.toLocaleString().split(",")[1].slice(0, -3)
                            )
                            :
                            (
                                Number(endDate?.toLocaleString().split(",")[1].slice(0, -9)) === 12 ?
                                endDate?.toLocaleString().split(",")[1].slice(0, -3)
                                :
                                ((Number(endDate?.toLocaleString().split(",")[1].slice(0, -9)) + 12).toString()
                                + endDate?.toLocaleString().split(",")[1].slice(-9, -3))
                            )
                        )
                    }
                </Box>
                <Box fontWeight="bold">
                    <Address address={exam.certifier.toString()} />
                </Box>
            </SimpleGrid>
        </Card>
        )
    );
};

export default ExamCard;