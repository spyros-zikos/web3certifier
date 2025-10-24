import React from 'react'
import { Button, PageWrapper } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';
import RewardInfo from '../_components/RewardInfo';
import SubHeading from '../_components/SubHeading';
import { useNonUndefinedAccount } from '~~/utils/NonUndefinedAccount';

const ClaimReward = ({id}: {id: bigint}) => {
    const { address, chain } = useNonUndefinedAccount();

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

    const tokenSymbol: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "symbol",
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
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

    const scaledRewardAmountForUser = Number(getRewardAmountForUser) / (Number(10) ** Number(decimals));

    return (
        <PageWrapper>
            <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
            <div>
            <SubHeading>Claim</SubHeading>
            <div className="mt-4 ml-2 max-w-[250px] wrap">
                You can claim {scaledRewardAmountForUser?scaledRewardAmountForUser.toString():"0"} {tokenSymbol?tokenSymbol:""}!
            </div>
            <Button onClick={handleClaim} className="mt-5 w-full h-[70px] text-xl font-bold" >
                Claim
            </Button>
            <RewardInfo id={id} chain={chain}/>
            </div>
            
        </PageWrapper>
    )
}

export default ClaimReward