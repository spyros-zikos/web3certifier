'use client';

import React from 'react'
import { useState } from "react";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { Button, Input, PageWrapper } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { useAccount } from "wagmi";
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';
import RewardInfo from '../_components/RewardInfo';
import SubHeading from '../_components/SubHeading';

const ManageReward = ({id}: {id: bigint}) => {
    const { address } = useAccount();

    const [fundAmount, setFundAmount] = useState<bigint>(BigInt(0));
    const [rewardAmountPerPerson, setRewardAmountPerPerson] = useState<bigint>(BigInt(0));
    const [rewardAmountPerCorrectAnswer, setRewardAmountPerCorrectAnswer] = useState<bigint>(BigInt(0));

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

    const allowance: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "allowance",
        args: [address, rewardAddress],
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    // Approve
    const { writeContractAsync: approve } = wagmiWriteToContract();
    // Fund
    const { writeContractAsync: fundExam } = wagmiWriteToContract();
    async function handleFundExam() {
        const scaledFundAmount = Number(fundAmount) * (Number(10) ** Number(decimals));
        if (allowance < scaledFundAmount)
            await approve({
                contractName: 'ERC20',
                contractAddress: tokenAddress,
                functionName: 'approve',
                args: [
                    rewardAddress,
                    scaledFundAmount,
                ],
                onSuccess: () => {
                    // do nothing
                }
            });
        
        fundExam({
            contractName: 'Reward',
            contractAddress: rewardAddress,
            functionName: 'fund',
            args: [
                scaledFundAmount
            ],
        });
    }

    // Set reward amount per person
    const { writeContractAsync: setRewardAmountPerPersonHook } = wagmiWriteToContract();
    function handleSetRewardAmountPerPerson() {
        const scaledRewardAmountPerPerson = Number(rewardAmountPerPerson) * (Number(10) ** Number(decimals));
        setRewardAmountPerPersonHook({
            contractName: 'Reward',
            contractAddress: rewardAddress,
            functionName: 'setRewardAmountPerPerson',
            args: [
                scaledRewardAmountPerPerson
            ],
        });
    }

    // Set reward amount per correct answer
    const { writeContractAsync: setRewardAmountPerCorrectAnswerHook } = wagmiWriteToContract();
    function handleSetRewardAmountPerCorrectAnswer() {
        const scaledRewardAmountPerCorrectAnswer = Number(rewardAmountPerCorrectAnswer) * (Number(10) ** Number(decimals));
        setRewardAmountPerCorrectAnswerHook({
            contractName: 'Reward',
            contractAddress: rewardAddress,
            functionName: 'setRewardAmountPerCorrectAnswer',
            args: [
                scaledRewardAmountPerCorrectAnswer
            ],
        });
    }

    // Withdraw
    const { writeContractAsync: withdraw } = wagmiWriteToContract();
    function handleWithdraw() {
        withdraw({
            contractName: 'Reward',
            contractAddress: rewardAddress,
            functionName: 'withdraw',
            args: [],
        });
    }

    // Delete
    const { writeContractAsync: removeReward } = wagmiWriteToContract();
    function handleRemoveReward() {
        removeReward({
            contractName: 'RewardFactory',
            functionName: 'removeReward',
            args: [
                id,
            ],
        });
    }

    const labelMarginAndPadding = 'ml-2 mt-4 block';

    // should:
    // 1. show reward details
    // 2. fund - 1 input
    // 3. set reward amount per person - 1 input
    // 4. set reward amount per correct answer - 1 input
    // 5. withdraw
    // 6. delete (factory contract)
    return (
        <PageWrapper>
            <TitleWithLinkToExamPage id={id}>Manage Reward</TitleWithLinkToExamPage>
            <div>
                {/* REWARD INFO */}
                <RewardInfo id={id}/>

                {/* FUND */}
                <SubHeading>Fund</SubHeading>
                <label className={`${labelMarginAndPadding}`}>Fund Amount</label>
                <Input
                    value={fundAmount}
                    type="number"
                    placeholder="Fund Amount"
                    onChange={(e: any) => setFundAmount(e.target.value)}
                />
                <Button disabled={!fundAmount} onClick={handleFundExam} className="block mt-5 bg-base-100" >
                    Fund Reward
                </Button>

                {/* SET REWARD AMOUNT PER PERSON */}
                <SubHeading><><div>Set Reward Amount</div><div>{"\n"}Per Person</div></></SubHeading>
                <label className={`${labelMarginAndPadding}`}>Reward Amount Per Person</label>
                <Input
                    value={rewardAmountPerPerson}
                    type="number"
                    placeholder="Reward Amount Per Person"
                    onChange={(e: any) => setRewardAmountPerPerson(e.target.value)}
                />
                <Button disabled={!rewardAmountPerPerson} onClick={handleSetRewardAmountPerPerson} className="block mt-5 bg-base-100" >
                    Set Amount
                </Button>

                {/* SET REWARD AMOUNT PER CORRECT ANSWER */}
                <SubHeading><><div>Set Reward Amount</div><div>{"\n"}Per Correct Answer</div></></SubHeading>
                <label className={`${labelMarginAndPadding}`}>Reward Amount Per Correct Answer</label>
                <Input
                    value={rewardAmountPerCorrectAnswer}
                    type="number"
                    placeholder="Reward Amount Per Correct Answer"
                    onChange={(e: any) => setRewardAmountPerCorrectAnswer(e.target.value)}
                />
                <Button disabled={!rewardAmountPerCorrectAnswer} onClick={handleSetRewardAmountPerCorrectAnswer} className="block mt-5 bg-base-100" >
                    Set Amount
                </Button>

                {/* WITHDRAW */}
                <SubHeading>Withdraw</SubHeading>
                <Button onClick={handleWithdraw} className="block mt-5 bg-base-100" >
                    Withdraw
                </Button>
                
                {/* DELETE */}
                <SubHeading>Delete Reward</SubHeading>
                <Button onClick={handleRemoveReward} className="block mt-5 bg-base-100" >
                    Delete Reward
                </Button> 

            </div>
        </PageWrapper>
    );
}

export default ManageReward