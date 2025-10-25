import React, { useEffect, useState } from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import SubHeading from './SubHeading';
import { CustomReward, DEFAULT_CUSTOM_REWARD, ZERO_ADDRESS } from '~~/constants';
import { Address } from '~~/components/scaffold-eth';
import { Box } from '@chakra-ui/react';

const RewardInfo = ({id, chain}: {id: bigint, chain: any}) => {
    const defaultCustomReward = DEFAULT_CUSTOM_REWARD[chain.id][0];
    const [availableCustomRewards, setAvailableCustomRewards] = useState<CustomReward[]>([defaultCustomReward]);

    // fetch
    useEffect(() => {
        fetch(`/api/reward_page/custom_rewards/?chainId=${chain.id}`)
        .then(response => response.json())
        .then(data => setAvailableCustomRewards([defaultCustomReward, ...data]));
    }, []);
    
    /*//////////////////////////////////////////////////////////////
                           READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const rewardAddress: string  = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    const tokenAddress: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getTokenAddress",
    }).data;

    const rewardAmountPerPerson: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountPerPerson",
    }).data;

    const rewardAmountPerCorrectAnswer: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountPerCorrectAnswer",
    }).data;

    const balance: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "balanceOf",
        args: [rewardAddress],
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
    }).data;

    const tokenName: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "name",
    }).data;

    const tokenSymbol: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "symbol",
    }).data;

    const customRewardAddress = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getCustomReward",
    }).data;

    if (rewardAddress === ZERO_ADDRESS)
        return <></>;

    const scaledBalance = Number(balance) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerPerson = Number(rewardAmountPerPerson) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerCorrectAnswer = Number(rewardAmountPerCorrectAnswer) / (Number(10) ** Number(decimals));
    const customReward = availableCustomRewards.filter((customReward: any) => customReward.address === (customRewardAddress||ZERO_ADDRESS))[0];

    const RewardDetail = ({label, value}: {label: string, value: any}) => {
        return (
            <div className="m-0 py-2 flex justify-between border-b-2 border-base-100">
                <div className="inline-block pr-2">
                    {label}
                </div>
                <div className="inline-block">
                    <div>
                        {value}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-[1000px] wrap">
            <SubHeading>Reward Info</SubHeading>
            <div className="mt-12"></div>
            
            {((scaledBalance !== undefined) && 
            (scaledRewardAmountPerPerson !== undefined) && 
            (scaledRewardAmountPerCorrectAnswer !== undefined) && 
            tokenSymbol) ? 
                <>
                <RewardDetail label="Available Reward Amount"
                    value={<div>{scaledBalance.toString()} {}
                        {tokenSymbol.toString()}</div>} 
                />
                <RewardDetail label="Reward Amount Per Person"
                    value={<div>{scaledRewardAmountPerPerson.toString()} {}
                    {tokenSymbol.toString()}</div>} 
                />
                <RewardDetail label="Reward Amount Per Correct Answer"
                    value={<div>{scaledRewardAmountPerCorrectAnswer.toString()} {}
                    {tokenSymbol.toString()}</div>} 
                />
                </>
                : <></>
            }

            {tokenName && tokenSymbol && <RewardDetail label="Token"
                value={tokenName.toString() + " (" + tokenSymbol.toString() + ")"} 
            />}
            {tokenAddress && <RewardDetail label="Token Address"
                value={<Address address={tokenAddress} className={"text-bold"} disableAddressLink={true} />}
            />}
            {tokenAddress && <RewardDetail label="Reward Address"
                value={<Address address={rewardAddress} className={"text-bold inline-block"} disableAddressLink={true} />} 
            />}
            {customRewardAddress && <RewardDetail label="Custom Reward Address"
                value={<Address address={customRewardAddress} className={"text-bold inline-block"} disableAddressLink={true} />} 
            />}
            <RewardDetail label="Reward Name" value={customReward?.name} />

            {/* Reward Description */}
            <Box className="pt-2 mb-16">
                { chain && <>Reward Description:<br />{customReward?.description}</> }
            </Box>
        </div>
    );
}

export default RewardInfo