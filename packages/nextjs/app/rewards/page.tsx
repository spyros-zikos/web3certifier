"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { Button, PageWrapper, Title } from "~~/components";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";
import { useSearchParams } from "next/navigation";
import {ZERO_ADDRESS} from "~~/constants";
import {CreateReward, ManageReward, ClaimReward, RewardDoesNotExist, AlreadyClaimed, CannotClaim} from "./pages"

const Page = () => {
    const { address } = useAccount();
    const [ username, setTheUsername ] = useState<string>('')

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

    if (exam?.certifier === address)
        if (rewardAddress === ZERO_ADDRESS)
            return <CreateReward id={id} />
        else
            return <ManageReward id={id} />
    else
        if (rewardAddress === ZERO_ADDRESS)
            return <RewardDoesNotExist id={id} />
        else if (!userHasClaimed && userHasSucceeded)
            return <ClaimReward id={id} />
        else if (userHasClaimed)
            return <AlreadyClaimed id={id} />
        else if (!userHasSucceeded)
            return <CannotClaim id={id} />


    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    // const { writeContractAsync: setUsername } = wagmiWriteToContract();

    // return (
    //     <PageWrapper>
    //         <Title>Claim Your G$ Reward</Title>

    //         {/* <Box>
    //             <div className="mt-6 mb-3">Set new Discord username:</div>
    //             <input
    //                 className="mb-2 border-2 border-accent bg-base-200 placeholder-base-300 p-2 mr-2 rounded-md hover:border-neutral focus:outline-none focus:border-2 focus:border-neutral"
    //                 type="text"
    //                 onChange={e => {
    //                     setTheUsername(e.target.value);
    //                 }
    //             }/>
    //         </Box> */}
    //         <Button
    //             className="bg-base-100 mt-[100px] text-7xl font-bold"
    //             onClick={() => setUsername({
    //                 functionName: "setUsername",
    //                 args: [username, BigInt(0), "0x"]
    //             })
    //         }>Claim G$</Button>
    //     </PageWrapper>
    // );
}

export default Page;
