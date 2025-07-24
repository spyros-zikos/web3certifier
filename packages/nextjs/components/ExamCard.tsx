import React from "react";
import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import { Button, Card } from "~~/components";
import { useRouter } from "next/navigation";
import { Address } from "~~/components/scaffold-eth";
import { defaultImage } from "~~/constants";
import { getExamStatusStr } from "~~/utils/StatusStr";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import Link from "next/link";

interface CardProps {
    className?: string;
    id: bigint;
    searchTerm: string;
}

const ExamCard: React.FC<CardProps> = ({ className, id, searchTerm = "" }) => {
    const router = useRouter();
    
    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const exam: Exam | undefined = wagmiReadFromContract({
        functionName: "getExam",
        args: [BigInt(id)],
    }).data as any;

    const status: number | undefined = wagmiReadFromContract({
        functionName: "getExamStatus",
        args: [exam?.id],
    }).data as any;

    // make a string with the nft meta-data
    let dataString = "";
    if (exam)
        for (const [_, value] of Object.entries(exam))
            dataString += `${value}`;
    dataString += getExamStatusStr(status);

    const endDate = exam && new Date(Number(exam.endTime.toString()) * 1000);

    const getFormattedDate = () => {
        const longDate = endDate?.toLocaleString();
        const splittedDate = longDate ? longDate?.split(",") : "";
        const date = splittedDate[0].slice(0,-4) + splittedDate[0].slice(-2);
        const time = (endDate?.toLocaleString().slice(-2)==="AM"
            ? (Number(splittedDate[1].slice(0, -9)) === 12
                ? ("00" + splittedDate[1].slice(3, -3))
                : splittedDate[1].slice(0, -3)
            ) : (Number(splittedDate[1].slice(0, -9)) === 12
                ? splittedDate[1].slice(0, -3)
                : ((Number(splittedDate[1].slice(0, -9)) + 12).toString()
                    + splittedDate[1].slice(-9, -3))
            )
        ).slice(0,-3);
        return date+'\n'+time;
    }

    return (
        exam?.name && dataString.includes(searchTerm) &&
        <Card
            title={exam?.name}
            className={`${className || ""}`}
            imageUrl={exam?.imageUrl || defaultImage}
            footer={
                <Link className="w-full" href={`/exam_page?id=${id}`}>
                    <Button className="w-full" onClick={undefined}>
                        Explore
                    </Button>
                </Link>
            }
            compact={true}
        >
            {/* {exam.description} */}
            <SimpleGrid columns={2} gap={0}>
                <Box>
                    <Text color="black" fontSize="12" p="0" m="0" mt="3">Price</Text>
                </Box>
                <Box>
                    <Text color="black" fontSize="12" p="0" m="0" mt="3">Status</Text>
                </Box>

                <Box fontWeight="bold">
                    ${parseFloat(exam.price.toString())/1e18}
                </Box>
                <Box fontWeight="bold" w="120px">
                    {getExamStatusStr(status)}
                </Box>

                <Box>
                    <Text color="black" fontSize="12" p="0" m="0" mt="3">End Time</Text>
                </Box>
                <Box>
                    <Text color="black" fontSize="12" p="0" m="0" mt="3">Certifier</Text>
                </Box>

                <Box fontWeight="bold">
                    { getFormattedDate() }
                </Box>
                <Box fontWeight="bold">
                    <Address address={exam.certifier.toString()} className={"text-bold"} disableAddressLink={true} />
                </Box>
            </SimpleGrid>
        </Card>
    );
};

export default ExamCard;