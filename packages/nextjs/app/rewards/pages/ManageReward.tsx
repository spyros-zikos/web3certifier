'use client';

import React from 'react'
import { useState } from "react";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { useNonUndefinedAccount } from '~~/utils/NonUndefinedAccount';
import { Input, ResponsivePageWrapper } from "~~/components";
import { TitleWithLinkToExamPage, BuyGoodDollarTokensMessage, ActionCard, LoadingButton } from '../components';
import { distributionParameterName, DistributionType } from '~~/types/RewardTypes';
import { RewardInfoDropDown } from '~~/app/exam_page/_components';
import { Box } from '@chakra-ui/react';
import getTimeLeft from '~~/utils/GetTimeLeft';
import { winnerHasBeenDrawn } from '~~/utils/winnerHasBeenDrawn';

const ManageReward = ({id}: {id: bigint}) => {
    const { address, chain } = useNonUndefinedAccount();

    const [fundAmount, setFundAmount] = useState<bigint>(BigInt(0));
    const [distributionParameter, setDistributionParameter] = useState<bigint>(BigInt(0));
    const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

    /*//////////////////////////////////////////////////////////////
                           READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const rewardAddress: string  = wagmiReadFromContract({
        contractName: "RewardFactory",
        functionName: "getRewardByExamId",
        args: [id],
    }).data;

    const rewardToken: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getRewardToken",
    }).data;

    const distributionTypeNumber: number  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionType",
    }).data;

    const usersThatClaimed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUsersThatClaimed",
    }).data;

    const contractDistributionType = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionType",
    }).data;
    const distributionType: DistributionType = Object.values(DistributionType)[contractDistributionType];
    
    const contractDistributionParameter = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionParameter",
    }).data;

    const timeToExecuteDrawPassed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "timeToExecuteDrawPassed",
    }).data;

    const winnerHasClaimed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUserHasClaimed",
        args: [usersThatClaimed ? usersThatClaimed[usersThatClaimed.length-1] : false],
    }).data;

    const allowance: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
        functionName: "allowance",
        args: [address, rewardAddress],
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
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

    // Pick Draw Winner
    const { writeContractAsync: pickDrawWinner } = wagmiWriteToContract();
    async function handlePickDrawWinner() {
        try {
            setLoadingState('drawWinner', true);
            const seed = BigInt((Math.random() * Number.MAX_SAFE_INTEGER + 1).toFixed(0)); // +1 to avoid zero seed
            console.log("seed", seed);
            await pickDrawWinner({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'pickDrawWinner',
                args: [seed],
            });
        } finally {
            setLoadingState('drawWinner', false);
        }
    }

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
                    contractAddress: rewardToken,
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

    // Set distribution parameter
    const { writeContractAsync: setDistributionParameterHook } = wagmiWriteToContract();
    async function handleSetDistributionParameter() {
        try {
            setLoadingState('distributionParameter', true);
            const scaledDistributionParameter = Number(distributionParameter) * (Number(10) ** Number(decimals));
            await setDistributionParameterHook({
                contractName: 'Reward',
                contractAddress: rewardAddress,
                functionName: 'setDistributionParameter',
                args: [
                    BigInt(scaledDistributionParameter)
                ],
            });
            setDistributionParameter(BigInt(0));  // reset input
        } finally {
            setLoadingState('distributionParameter', false);
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
    // 3. set distribution parameter - 1 input
    // 4. withdraw
    // 5. delete (factory contract)
    return (
        <ResponsivePageWrapper>
            <TitleWithLinkToExamPage id={id}>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <span>Manage Reward</span>
                </div>
            </TitleWithLinkToExamPage>

            {/* REWARD INFO */}
            <RewardInfoDropDown id={id} />
            <div className="mb-16"></div>

            {/* Pick Draw Winner */}
            {distributionType === DistributionType.DRAW && (timeToExecuteDrawPassed ? <ActionCard
                title="🏆 Pick Draw Winner"
                description="Pick a winner for the draw"
            >
                <Box mb="4">
                    {winnerHasBeenDrawn(usersThatClaimed) ? `Winner:  ${usersThatClaimed[usersThatClaimed.length - 1]}` : `There are ${usersThatClaimed?.length} participants in the draw.`}
                </Box>
                <LoadingButton
                    onClick={handlePickDrawWinner}
                    loading={isLoading.distributionParameter}
                    bgColor="green"
                >
                    <span className="flex items-center gap-2">
                        🎁 Pick Random Winner
                    </span>
                </LoadingButton>
            </ActionCard>
            :
            <ActionCard
                title="🏆 Pick Draw Winner"
                description="Pick a winner for the draw"
            >
                <Box mb="4">There are {usersThatClaimed?.length} participants in the draw.</Box>
                <Box mb="4">
                    Draw will be executed in {getTimeLeft(Date.now(), contractDistributionParameter)}.
                </Box>
                <LoadingButton
                    onClick={() => {}}
                    loading={isLoading.distributionParameter}
                    bgColor="green"
                    disabled={true}
                >
                    <span className="flex items-center gap-2">
                        🎁 Pick Random Winner
                    </span>
                </LoadingButton>
            </ActionCard>
            )}

            {/* Fund Reward */}
            <ActionCard
                title="💰 Fund Reward"
                description="Add tokens to the reward pool for exam participants"
            >
                <label>
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
                    bgColor="green"
                >
                    <span className="flex items-center gap-2">
                        💎 Fund Reward Pool
                    </span>
                </LoadingButton>
                {chain?.id === 42220 && <BuyGoodDollarTokensMessage />}
            </ActionCard>

            {/* Set Distribution Parameter */}
            {distributionType !== DistributionType.DRAW &&
            <ActionCard
                title="⚙️ Distribution Parameter"
                description="Set the value of the distribution parameter"
            >
                <label className="label">
                    <span className="label-text font-medium">{distributionParameterName(Object.values(DistributionType)[distributionTypeNumber])}</span>
                </label>
                <Input
                    value={distributionParameter}
                    type="number"
                    placeholder="Enter amount..."
                    onChange={(e: any) => setDistributionParameter(e.target.value)}
                />
                <LoadingButton
                    onClick={handleSetDistributionParameter}
                    disabled={!distributionParameter}
                    loading={isLoading.distributionParameter}
                    bgColor="green"
                >
                    <span className="flex items-center gap-2">
                        ⚙️ Set Amount
                    </span>
                </LoadingButton>
            </ActionCard>}

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
                    bgColor="black"
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
                    bgColor="black"
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