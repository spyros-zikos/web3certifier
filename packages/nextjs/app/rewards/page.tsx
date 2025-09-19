"use client";

import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { useSearchParams } from "next/navigation";
import { ZERO_ADDRESS } from "~~/constants";
import { CreateReward, ManageReward, ClaimReward } from "./pages"
import ErrorPage from "./pages/ErrorPage";
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";

const Page = () => {
    const { address, chain } = useNonUndefinedAccount();

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
            return <ErrorPage id={id} chain={chain} message="This reward does not exist!" />
        else if (!userHasClaimed && userHasSucceeded && rewardAmount !== BigInt(0) && totalRewardAmount >= rewardAmount)
            return <ClaimReward id={id} />
        else if (!userHasClaimed && userHasSucceeded && rewardAmount === BigInt(0))
            return <ErrorPage id={id} chain={chain} message="Your reward is zero. Either the certifier has not set a reward amount or you dont qualify for this reward." />
        else if (userHasClaimed)
            return <ErrorPage id={id} chain={chain} message="You already claimed this reward!" />
        else if (!userHasSucceeded)
            return <ErrorPage id={id} chain={chain} message="Wait for the exam to end, claim the NFT certificate and claim this reward!" />
        else if (totalRewardAmount < rewardAmount)
            return <ErrorPage id={id} chain={chain} message="The reward pool does not have enough tokens to reward you." />
}

export default Page;
