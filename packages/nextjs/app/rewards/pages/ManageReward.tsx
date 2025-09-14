'use client';

import React from 'react'
import { useState } from "react";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { Button, Input, PageWrapper, ResponsivePageWrapper } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { useAccount } from "wagmi";
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';
import RewardInfo from '../_components/RewardInfo';
import SubHeading from '../_components/SubHeading';
import BuyGoodDollarTokensMessage from '../_components/BuyGoodDollarTokensMessage';
import { Box } from '@chakra-ui/react';
import { ActionCard } from '../_components/ActionCard';
import { LoadingButton } from '../_components/LoadingButton';

const ManageReward = ({id}: {id: bigint}) => {
    const { address, chain } = useAccount();

    const [fundAmount, setFundAmount] = useState<bigint>(BigInt(0));
    const [rewardAmountPerPerson, setRewardAmountPerPerson] = useState<bigint>(BigInt(0));
    const [rewardAmountPerCorrectAnswer, setRewardAmountPerCorrectAnswer] = useState<bigint>(BigInt(0));
    const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

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
                           HELPER FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    const setLoadingState = (action: string, loading: boolean) => {
        setIsLoading(prev => ({ ...prev, [action]: loading }));
    };

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    // Approve
    const { writeContractAsync: approve } = wagmiWriteToContract();
    // Fund
    const { writeContractAsync: fundExam } = wagmiWriteToContract();
    async function handleFundExam() {
        try {
            setLoadingState('fund', true);
            const scaledFundAmount = Number(fundAmount) * (Number(10) ** Number(decimals));
            if (allowance < scaledFundAmount)
                await approve({
                    contractName: 'ERC20',
                    contractAddress: tokenAddress,
                    functionName: 'approve',
                    args: [
                        rewardAddress,
                        BigInt(scaledFundAmount),
                    ],
                    onSuccess: () => {
                        // do nothing
                    }
                });
            
            await fundExam({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'fund',
                args: [
                    BigInt(scaledFundAmount)
                ],
            });
            setFundAmount(BigInt(0));
        } finally {
            setLoadingState('fund', false);
        }
    }

    // Set reward amount per person
    const { writeContractAsync: setRewardAmountPerPersonHook } = wagmiWriteToContract();
    async function handleSetRewardAmountPerPerson() {
        try {
            setLoadingState('rewardPerPerson', true);
            const scaledRewardAmountPerPerson = Number(rewardAmountPerPerson) * (Number(10) ** Number(decimals));
            await setRewardAmountPerPersonHook({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'setRewardAmountPerPerson',
                args: [
                    BigInt(scaledRewardAmountPerPerson)
                ],
            });
            setRewardAmountPerPerson(BigInt(0));
        } finally {
            setLoadingState('rewardPerPerson', false);
        }
    }

    // Set reward amount per correct answer
    const { writeContractAsync: setRewardAmountPerCorrectAnswerHook } = wagmiWriteToContract();
    async function handleSetRewardAmountPerCorrectAnswer() {
                try {
            setLoadingState('rewardPerAnswer', true);
            const scaledRewardAmountPerCorrectAnswer = Number(rewardAmountPerCorrectAnswer) * (Number(10) ** Number(decimals));
            await setRewardAmountPerCorrectAnswerHook({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'setRewardAmountPerCorrectAnswer',
                args: [
                    BigInt(scaledRewardAmountPerCorrectAnswer)
                ],
            });
            setRewardAmountPerCorrectAnswer(BigInt(0));
        } finally {
            setLoadingState('rewardPerAnswer', false);
        }
    }

    // Withdraw
    const { writeContractAsync: withdraw } = wagmiWriteToContract();
    async function handleWithdraw() {
        try {
            setLoadingState('withdraw', true);
            await withdraw({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'withdraw',
                args: [],
            });
        } finally {
            setLoadingState('withdraw', false);
        }
    }

    // Delete
    const { writeContractAsync: removeReward } = wagmiWriteToContract();
    async function handleRemoveReward() {
        try {
            setLoadingState('delete', true);
            await removeReward({
                contractName: 'RewardFactory',
                functionName: 'removeReward',
                args: [
                    id,
                ],
            });
        } finally {
            setLoadingState('delete', false);
        }
    }

    // should:
    // 1. show reward details
    // 2. fund - 1 input
    // 3. set reward amount per person - 1 input
    // 4. set reward amount per correct answer - 1 input
    // 5. withdraw
    // 6. delete (factory contract)
    return (
        <ResponsivePageWrapper>
            <TitleWithLinkToExamPage id={id}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <span>Manage Reward</span>
                </div>
            </TitleWithLinkToExamPage>
            {/* REWARD INFO */}
            <Box className="mb-8">
                <RewardInfo id={id}/>
            </Box>

            {/* Fund Reward */}
            <ActionCard
                title="💰 Fund Reward"
                description="Add tokens to the reward pool for exam participants"
            >
                    <label className="label">
                        <span className="label-text font-medium">Amount to Fund</span>
                    </label>
                    <Input
                        value={fundAmount}
                        type="number"
                        placeholder="Enter amount..."
                        onChange={(e: any) => setFundAmount(e.target.value)}
                    />
                <LoadingButton
                    onClick={handleFundExam}
                    disabled={!fundAmount}
                    loading={isLoading.fund}
                    variant="primary"
                >
                    <span className="flex items-center gap-2">
                        💎 Fund Reward Pool
                    </span>
                </LoadingButton>
                {chain?.id === 42220 && (
                    <Box mt="4" bg="darkGreen" border="2px" borderColor="lightGreen" p="4" rounded="md">
                        <BuyGoodDollarTokensMessage />
                    </Box>
                )}
            </ActionCard>

            {/* Set Reward Per Person */}
            <ActionCard
                title="👤 Reward Per Person"
                description="Set the base reward amount each participant receives"
            >
                    <label className="label">
                        <span className="label-text font-medium">Amount Per Person</span>
                    </label>
                    <Input
                        value={rewardAmountPerPerson}
                        type="number"
                        placeholder="Enter amount..."
                        onChange={(e: any) => setRewardAmountPerPerson(e.target.value)}
                    />
                <LoadingButton
                    onClick={handleSetRewardAmountPerPerson}
                    disabled={!rewardAmountPerPerson}
                    loading={isLoading.rewardPerPerson}
                    variant="primary"
                >
                    <span className="flex items-center gap-2">
                        ⚙️ Set Amount
                    </span>
                </LoadingButton>
            </ActionCard>

            {/* Set Reward Per Correct Answer */}
            <ActionCard
                title="✅ Reward Per Correct Answer"
                description="Set bonus reward for each correct answer given"
            >
                    <label className="label">
                        <span className="label-text font-medium">Amount Per Correct Answer</span>
                    </label>
                    <Input
                        value={rewardAmountPerCorrectAnswer}
                        type="number"
                        placeholder="Enter amount..."
                        onChange={(e: any) => setRewardAmountPerCorrectAnswer(e.target.value)}
                    />
                <LoadingButton
                    onClick={handleSetRewardAmountPerCorrectAnswer}
                    disabled={!rewardAmountPerCorrectAnswer}
                    loading={isLoading.rewardPerAnswer}
                    variant="primary"
                >
                    <span className="flex items-center gap-2">
                        ⚙️ Set Amount
                    </span>
                </LoadingButton>
            </ActionCard>

            {/* Withdraw */}
            <ActionCard
                title="💸 Withdraw Funds"
                description="Withdraw remaining tokens from the reward pool"
                variant="warning"
            >
                <div className="alert alert-warning mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-sm">This will withdraw all available funds from the reward contract</span>
                </div>
                <LoadingButton
                    onClick={handleWithdraw}
                    loading={isLoading.withdraw}
                    variant="warning"
                >
                    <span className="flex items-center gap-2">
                        🏦 Withdraw All Funds
                    </span>
                </LoadingButton>
            </ActionCard>

            {/* Danger Zone */}
            <ActionCard
                title="⚠️ Danger Zone"
                description="Permanently delete this reward contract. This action cannot be undone."
                variant="danger"
            >
                <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">
                        <strong>Warning:</strong> Deleting the reward will permanently remove it from the system. 
                        Make sure to withdraw any remaining funds first.
                    </span>
                </div>
                <LoadingButton
                    onClick={handleRemoveReward}
                    loading={isLoading.delete}
                    variant="error"
                >
                    <span className="flex items-center gap-2">
                        🗑️ Delete Reward Contract
                    </span>
                </LoadingButton>
            </ActionCard>
        </ResponsivePageWrapper>
    );
}

export default ManageReward