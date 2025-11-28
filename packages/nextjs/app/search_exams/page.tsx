"use client";

import { Spinner, Title } from "~~/components";
import React, { useEffect, useState } from "react";
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
    const [featuredExamIds, setFeaturedExamIds] = useState<bigint[]>([]);
    const [apiFetched, setApiFetched] = useState<boolean>(false);
    // parameter
    const examsPerPage = 9;

    useEffect(() => {
        const fetchFeaturedExams = async () => {
            await fetch("api/explore_page/featured_exams?chainId=" + chain?.id)
            .then(response => response.json())
            .then(data => {setFeaturedExamIds(data.length > 0 ? data.split(",").map((id: string) => BigInt(id)) : []); setApiFetched(true);})
            .catch(error => setFeaturedExamIds([]));
        };
        fetchFeaturedExams();
    }, [chain?.id]);

    console.log("featuredExamIds", featuredExamIds);

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

    const getExamIdsOfPage = () => {
        // Get only the exams that are selected in the showList
        // If the showList is empty, show all the exams
        const allExamIds = [];
        for (let i = (lastExamId ? lastExamId - BigInt(1) : -BigInt(1)); i > BigInt(-1); i--) {
            if (featuredExamIds.length && !featuredExamIds.includes(i)) continue
            allExamIds.push(BigInt(i));
        }
        
        // exam ids to show
        const examIdsToShow: bigint[] = showMyExams ? userAndCertifierExamIds || [] : allExamIds;
        
        // last page
        const lastPage = examIdsToShow ? Math.ceil(examIdsToShow.length / examsPerPage) : 0;
        
        // exam ids of the page
        const startIndex = (page - 1) * examsPerPage;
        const endIndex = startIndex + examsPerPage;
        const examIdsOfPage = examIdsToShow?.slice(startIndex, endIndex);
        return {examIdsOfPage, lastPage};
    }
    const {examIdsOfPage, lastPage} = apiFetched ? getExamIdsOfPage() : {examIdsOfPage: [], lastPage: 0};

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
                <Box color="lighterLighterBlack" pb="3px" ml="8" onClick={() => document.location.href = "/exam_page/?id=" + (lastExamId-BigInt(1))}>Go to latest exam</Box>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 space-14">
                {(examIdsOfPage)?.map((id, i) => (
                    <ExamCard key={i}
                        id={BigInt(id)}
                        searchTerm={searchTerm}
                    />
                ))}
                {!apiFetched && <Spinner />}
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