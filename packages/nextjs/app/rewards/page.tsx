"use client";

import { useAccount } from "wagmi";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { useSearchParams } from "next/navigation";
import {ZERO_ADDRESS} from "~~/constants";
import {CreateReward, ManageReward, ClaimReward, RewardDoesNotExist, AlreadyClaimed, CannotClaim, NotCustomEligible} from "./pages"

const Page = () => {
    const { address } = useAccount();

    const searchParams = useSearchParams();
    const id = BigInt(searchParams.get("id")!);

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

    const userHasClaimed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUserHasClaimed",
        args: [address],
    }).data;

    const userHasSucceeded = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUserHasSucceeded",
        args: [address],
    }).data;

    const userSatisfiesCustomEligibilityCriteria = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "userSatisfiesCustomEligibilityCriteria",
        args: [address],
    }).data;

    if (exam?.certifier === address)
        if (rewardAddress === ZERO_ADDRESS)
            return <CreateReward id={id} />
        else
            return <ManageReward id={id} />
    else
        if (rewardAddress === ZERO_ADDRESS)
            return <RewardDoesNotExist id={id} />
        else if (!userHasClaimed && userHasSucceeded && userSatisfiesCustomEligibilityCriteria)
            return <ClaimReward id={id} />
        else if (!userHasClaimed && userHasSucceeded && !userSatisfiesCustomEligibilityCriteria)
            return <NotCustomEligible id={id} />
        else if (userHasClaimed)
            return <AlreadyClaimed id={id} />
        else if (!userHasSucceeded)
            return <CannotClaim id={id} />

}

export default Page;
