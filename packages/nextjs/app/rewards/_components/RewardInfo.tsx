import React from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import SubHeading from './SubHeading';
import { CUSTOM_REWARDS, ZERO_ADDRESS } from '~~/constants';
import { Address } from '~~/components/scaffold-eth';
import { Box } from '@chakra-ui/react';
import { custom } from 'viem';


const RewardInfo = ({id, chain}: {id: bigint, chain: any}) => {

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

    const labelMarginAndPadding = 'mt-4 block';
    const labelMarginAndPaddingForOneLiners = 'mt-2 block';
    
    if (rewardAddress === ZERO_ADDRESS)
        return <></>;

    const scaledBalance = Number(balance) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerPerson = Number(rewardAmountPerPerson) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerCorrectAnswer = Number(rewardAmountPerCorrectAnswer) / (Number(10) ** Number(decimals));

    return (
        <div className="max-w-[300px] wrap">
            <SubHeading>Reward Info</SubHeading>
            <div className={`${labelMarginAndPadding}`}>Available Reward Amount</div>
            <div>
                {scaledBalance?scaledBalance.toString():"0"} {}
                {tokenSymbol?tokenSymbol.toString():"unknown"}
            </div>
            
            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Person</div>
            <div>
                {scaledRewardAmountPerPerson?scaledRewardAmountPerPerson.toString():"0"} {}
                {tokenSymbol?tokenSymbol.toString():"unknown"}
            </div>

            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Correct Answer</div>
            <div>
                {scaledRewardAmountPerCorrectAnswer?scaledRewardAmountPerCorrectAnswer.toString():"0"} {}
                {tokenSymbol?tokenSymbol.toString():"unknown"}
            </div>

            <div className={`${labelMarginAndPadding}`}>Token Name: {tokenName?tokenName.toString():"unknown"}</div>

            <div className={`${labelMarginAndPaddingForOneLiners}`}>Token Symbol: {tokenSymbol?tokenSymbol.toString():"unknown"}</div>
            
            <div className={`${labelMarginAndPaddingForOneLiners}`}>Token Address: {
                tokenAddress
                ? <div className="inline-block">
                    <Address address={tokenAddress} className={"text-bold"} disableAddressLink={true} />
                </div>
                : <>unknown</>
            }</div>

            <div className={`${labelMarginAndPaddingForOneLiners}`}>Reward Address: {
                tokenAddress
                ? <div className="inline-block">
                    <Address address={rewardAddress} className={"text-bold inline-block"} disableAddressLink={true} />
                </div>
                :<>unknown</>
            }</div>

            {customRewardAddress && customRewardAddress !== ZERO_ADDRESS && 
            <div className={`${labelMarginAndPaddingForOneLiners}`}>Custom Reward Address: {
                customRewardAddress
                ? <div className="inline-block">
                    <Address address={customRewardAddress} className={"text-bold inline-block"} disableAddressLink={true} />
                </div>
                :<>unknown</>
            }</div>}

        </div>
    );
}

export default RewardInfo