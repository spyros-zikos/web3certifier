"use client";

import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { useSearchParams } from "next/navigation";
import { ZERO_ADDRESS } from "~~/constants";
import { CreateReward, ManageReward, ErrorPage } from "./pages"
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";
import { Spinner } from "~~/components";

const Page = () => {
    const { address } = useNonUndefinedAccount();

    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);

    const NotOrganizerMessage = () => (
        <div className="text-red-500 mx-auto mt-8">You are not the organizer!!!</div>
    );

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/
    
    const exam: Exam | undefined  = wagmiReadFromContract({
        functionName: "getExam",
        args: [id],
    }).data;

    const rewardAddress = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    if (!exam) return <Spinner />
    
    if (exam?.certifier === address)
        if (rewardAddress === ZERO_ADDRESS)
            return <CreateReward id={id} />
        else
            return <ManageReward id={id} />
    else
        if (rewardAddress === ZERO_ADDRESS)
            return <><NotOrganizerMessage /><CreateReward id={id} /></>
        else
            return <><NotOrganizerMessage /><ManageReward id={id} /></>
    // else
    //     return <ErrorPage id={id} chain={chain} message="You are not the organizer!" />
}

export default Page;
