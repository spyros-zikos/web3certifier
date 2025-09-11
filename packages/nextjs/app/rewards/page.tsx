"use client";

import { useAccount } from "wagmi";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { useSearchParams } from "next/navigation";
import {ZERO_ADDRESS} from "~~/constants";
import {CreateReward, ManageReward, ClaimReward, RewardDoesNotExist, AlreadyClaimed, CannotClaim, RewardIsZero, RewardBalanceNotEnough} from "./pages"

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

    const rewardAmount: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountForUser",
        args: [address],
    }).data;

    const totalRewardAmount: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getBalance",
    }).data;

    if (exam?.certifier === address)
        if (rewardAddress === ZERO_ADDRESS)
            return <CreateReward id={id} />
        else
            return <ManageReward id={id} />
    else
        if (rewardAddress === ZERO_ADDRESS)
            return <RewardDoesNotExist id={id} />
        else if (!userHasClaimed && userHasSucceeded && rewardAmount !== BigInt(0) && totalRewardAmount >= rewardAmount)
            return <ClaimReward id={id} />
        else if (!userHasClaimed && userHasSucceeded && rewardAmount === BigInt(0))
            return <RewardIsZero id={id} />
        else if (userHasClaimed)
            return <AlreadyClaimed id={id} />
        else if (!userHasSucceeded)
            return <CannotClaim id={id} />
        else if (totalRewardAmount < rewardAmount)
            return <RewardBalanceNotEnough id={id} />

}

export default Page;
