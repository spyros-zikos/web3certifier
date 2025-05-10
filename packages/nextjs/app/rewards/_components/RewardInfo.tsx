import React from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import SubHeading from './SubHeading';
import { ZERO_ADDRESS } from '~~/constants';


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

    const rewardAmountPerPersonFromContract: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardAmountPerPerson",
    }).data;

    const rewardAmountPerCorrectAnswerFromContract: string = wagmiReadFromContract({
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

    const labelMarginAndPadding = 'ml-2 mt-4 block';
    
    if (rewardAddress === ZERO_ADDRESS)
        return <></>;
            
    return (
        <div>
            <SubHeading>Reward Info</SubHeading>
            <div className={`${labelMarginAndPadding}`}>Available Reward Amount</div>
            <div className={'ml-2'}>{balance?balance.toString():"0"}</div>
            
            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Person</div>
            <div className={'ml-2'}>{rewardAmountPerPersonFromContract?rewardAmountPerPersonFromContract.toString():"0"}</div>

            <div className={`${labelMarginAndPadding}`}>Reward Amount Per Correct Answer</div>
            <div className={'ml-2'}>{rewardAmountPerCorrectAnswerFromContract?rewardAmountPerCorrectAnswerFromContract.toString():"0"}</div>

            <div className={`${labelMarginAndPadding}`}>Token Address</div>
            <div className={'ml-2 max-w-[250px] text-wrap'}>{tokenAddress?tokenAddress:"unknown"}</div>
        </div>
    );
}

export default RewardInfo