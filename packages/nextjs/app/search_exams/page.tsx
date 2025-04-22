"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { Title } from "~~/components";
import React, { useState } from "react";
import { SearchBar } from "./_components/SearchBar";
import { useAccount } from "wagmi";
import { ExamCard, PageWrapper } from "~~/components";

const SearchExamsPage: React.FC = () => {
    const { address } = useAccount();
    const [searchTerm, setSearchTerm] = useState("");
    const [showMyExams, setShowMyExams] = useState(false);

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

    const examIds = [];
    for (let i = (lastExamId ? lastExamId - BigInt(1) : -1); i > -1; i--) {
        examIds.push(i);
    }

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
                {(showMyExams
                    ? Array.from(new Set([...(userExamIds || []), ...(certifierExamIds || [])]))
                    : examIds
                )?.map((id, i) => (
                    <ExamCard key={i} id={BigInt(id)} searchTerm={searchTerm} />
                ))}
            </div>
        </PageWrapper>
    );
};

export default SearchExamsPage;