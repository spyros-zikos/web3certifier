"use client";

import { Title } from "~~/components";
import React, { useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { IndexSelector } from "../../components/IndexSelector";
import { ExamCard, PageWrapper } from "~~/components";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { SUPPORTED_NETWORKS } from "~~/constants";
import { Box } from "@chakra-ui/react";
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";


const SearchExamsPage: React.FC = () => {
    const { address, chain } = useNonUndefinedAccount();
    const [searchTerm, setSearchTerm] = useState("");
    const [showMyExams, setShowMyExams] = useState(false);
    const [page, setPage] = useState<number>(1);
    // parameter
    const examsPerPage = 9;
    // hidelists
    const hidePreviousIdsOfId = {
        [SUPPORTED_NETWORKS.sepolia]: 0,
        [SUPPORTED_NETWORKS.arbitrum]: 0,
        [SUPPORTED_NETWORKS.celo]: 21
    };
    const hidelist = {
        [SUPPORTED_NETWORKS.sepolia]: [],
        [SUPPORTED_NETWORKS.arbitrum]: [],
        [SUPPORTED_NETWORKS.celo]: [22n, 23n, 26n, 27n, 29n, 30n, 31n, 32n, 33n]
    };

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const lastExamId = wagmiReadFromContract({
        functionName: "getLastExamId",
    }).data as any;

    const userExamIds = wagmiReadFromContract({
        functionName: "getUserExams",
        args: [address],
    }).data as any;

    const certifierExamIds = wagmiReadFromContract({
        functionName: "getCertifierExams",
        args: [address],
    }).data as any;

    /*//////////////////////////////////////////////////////////////
                           EXAM IDS OF PAGE
    //////////////////////////////////////////////////////////////*/
    
    // union of userExamIds and certifierExamIds
    const userAndCertifierExamIds: bigint[] = Array.from(new Set([...(userExamIds || []), ...(certifierExamIds || [])])).reverse();

    // all exams
    const allExamIds = [];
    for (let i = (lastExamId ? lastExamId - BigInt(1) : -BigInt(1)); i > -1; i--) {
        if (chain && i < BigInt(hidePreviousIdsOfId[chain?.id])) continue
        if (chain && hidelist[chain?.id].includes(i)) continue
        allExamIds.push(BigInt(i));
    }

    // exam ids to show
    const examIdsToShow = showMyExams ? userAndCertifierExamIds || [] : allExamIds;

    // last page
    const lastPage = examIdsToShow ? Math.ceil(examIdsToShow.length / examsPerPage) : 0;

    // exam ids of the page
    const startIndex = (page - 1) * examsPerPage;
    const endIndex = startIndex + examsPerPage;
    const examsIdsOfPage = examIdsToShow?.slice(startIndex, endIndex);

    if (!chain || !chain.id || !Object.values(SUPPORTED_NETWORKS).includes(chain?.id))
        return (
            <PageWrapper>
                <Title>Explore Exams</Title>
            <p className="text-center">Connect your wallet to Arbitrum or Celo.</p>
            </PageWrapper>
        );

    return (
        <PageWrapper>
            <Title>Explore Exams</Title>
            <SearchBar setSearchTerm={setSearchTerm} />
            <div className="mb-16 mt-2 w-full flex items-center justify-start">
                <label className="pb-[3px] mr-2">My Exams</label>
                <input
                    checked={showMyExams}
                    type="checkbox"
                    onChange={(e: any) => { setShowMyExams(e.target.checked); }}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-14">
                {(examsIdsOfPage)?.map((id, i) => (
                    <ExamCard key={i}
                        id={BigInt(id)}
                        searchTerm={searchTerm}
                    />
                ))}
            </div>
            {lastPage > 1 && 
            <>
            <Box color="green" fontSize="xl" mt="16" mb="8">Page {page} of {lastPage}</Box>
            <IndexSelector setIndex={setPage} index={page} firstIndex={1} lastIndex={lastPage} />
            </>}
        </PageWrapper>
    );
};


export default SearchExamsPage;