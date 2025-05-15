import React from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import SubHeading from './SubHeading';
import { ZERO_ADDRESS } from '~~/constants';
import { Address } from '~~/components/scaffold-eth';


const RewardInfo = ({id}: {id: bigint}) => {

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

    const labelMarginAndPadding = 'ml-2 mt-4 block';
    const labelMarginAndPaddingForOneLiners = 'ml-2 mt-2 block';
    
    if (rewardAddress === ZERO_ADDRESS)
        return <></>;

    const scaledBalance = Number(balance) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerPerson = Number(rewardAmountPerPerson) / (Number(10) ** Number(decimals));
    const scaledRewardAmountPerCorrectAnswer = Number(rewardAmountPerCorrectAnswer) / (Number(10) ** Number(decimals));

    return (
        <div className="max-w-[300px] wrap">
            <SubHeading>Reward Info</SubHeading>
            <div className={`${labelMarginAndPadding}`}>Available Reward Amount</div>
            <div className={'ml-2'}>
                {scaledBalance?scaledBalance.toString():"0"} {}
                {tokenSymbol?tokenSymbol.toString():"unknown"}
            </div>
            
            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Person</div>
            <div className={'ml-2'}>
                {scaledRewardAmountPerPerson?scaledRewardAmountPerPerson.toString():"0"} {}
                {tokenSymbol?tokenSymbol.toString():"unknown"}
            </div>

            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Correct Answer</div>
            <div className={'ml-2'}>
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
        </div>
    );
}

export default RewardInfo