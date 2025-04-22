"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Title } from "~~/components";
import React, { use, useEffect, useMemo, useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { PageSelector } from "./_components/PageSelector";
import { useAccount } from "wagmi";
import { ExamCard, PageWrapper } from "~~/components";
import { getStatusStr } from "~~/utils/StatusStr";
import { rootCertificates } from "node:tls";

const SearchExamsPage: React.FC = () => {
    const { address } = useAccount();
    const [searchTerm, setSearchTerm] = useState("");
    const [showMyExams, setShowMyExams] = useState(false);
    const [page, setPage] = useState<number>(1);
    const examsPerPage = 9;

    const { data: lastExamId } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getLastExamId",
    });

    const { data: userExamIds } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getUserExams",
        args: [address],
    });

    const { data: certifierExamIds } = useScaffoldReadContract({
        contractName: "Certifier",
        functionName: "getCertifierExams",
        args: [address],
    });

    // union of userExamIds and certifierExamIds
    const userAndCertifierExamIds: bigint[] = Array.from(new Set([...(userExamIds || []), ...(certifierExamIds || [])])).reverse();

    // all exams
    const allExamIds = [];
    for (let i = (lastExamId ? lastExamId - BigInt(1) : -1); i > -1; i--) {
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

    return (
        <PageWrapper>
            <Title>Explore Exams</Title>
            <SearchBar setSearchTerm={setSearchTerm} /> {/*To fix border colors*/}
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
            <PageSelector setPage={setPage} page={page} lastPage={lastPage} />
        </PageWrapper>
    );
};


export default SearchExamsPage;