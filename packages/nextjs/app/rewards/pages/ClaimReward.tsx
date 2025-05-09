import React from 'react'
import { Button, Title, Input, PageWrapper } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { useAccount } from "wagmi";
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';

const ClaimReward = ({id}: {id: bigint}) => {
    const { address } = useAccount();

    /*//////////////////////////////////////////////////////////////
                           READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/
    
    const rewardAddress: string  = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    /// TODO need to check balance to see if contract has enough tokens
    const tokenAddress: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getTokenAddress",
    }).data;

    const getRewardAmountForUser: bigint  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountForUser",
        args: [address],
    }).data;

    const tokenName: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "name",
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: claim } = wagmiWriteToContract();
    function handleClaim() {
        claim({
            contractName: 'Reward',
            contractAddress: rewardAddress,
            functionName: 'claim',
            args: [],
        });
    }

    return (
        <PageWrapper>
            <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
            <div>You can claim {getRewardAmountForUser?getRewardAmountForUser.toString():"0"} {tokenName?tokenName:""}!</div>
            <Button onClick={handleClaim} className="block mt-5 bg-base-100 w-[200px] h-[70px] text-xl font-bold" >
                Claim
            </Button>
        </PageWrapper>
    )
}

export default ClaimReward