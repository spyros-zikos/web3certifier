import React from 'react'
import { useState } from "react";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { Button, Input, Text, PageWrapper } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { useAccount } from "wagmi";
import { chainsToContracts } from '~~/constants';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';

const CreateReward = ({id}: {id: bigint}) => {
    const { address, chain } = useAccount();

    const [initialRewardAmount, setInitialRewardAmount] = useState<number>(0);
    const [rewardAmountPerPerson, setRewardAmountPerPerson] = useState<number>(0);
    const [rewardAmountPerCorrectAnswer, setRewardAmountPerCorrectAnswer] = useState<number>(0);
    const goodDollarToken = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A";
    const [tokenAddress, setTokenAddress] = useState<string>(chain?.id === 42220 ? goodDollarToken : "");
    const rewardFactoryAddress = chainsToContracts[chain?chain?.id:11155111]["RewardFactory"].address;

    const allowance: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "allowance",
        args: [address, rewardFactoryAddress],
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: approve } = wagmiWriteToContract();
    const { writeContractAsync: createReward } = wagmiWriteToContract();
    async function handleCreateReward() {
        const scaledInitialRewardAmount = initialRewardAmount * (Number(10) ** Number(decimals));
        const scaledRewardAmountPerPerson = rewardAmountPerPerson * (Number(10) ** Number(decimals));
        const scaledRewardAmountPerCorrectAnswer = rewardAmountPerCorrectAnswer * (Number(10) ** Number(decimals));

        if (allowance < scaledInitialRewardAmount)
            await approve({
                contractName: 'ERC20',
                contractAddress: tokenAddress,
                functionName: 'approve',
                args: [
                    rewardFactoryAddress,
                    BigInt(scaledInitialRewardAmount),
                ],
                onSuccess: () => {
                    // do nothing
                }
            });

        createReward({
            contractName: 'RewardFactory',
            functionName: 'createReward',
            args: [
                id,
                BigInt(scaledInitialRewardAmount),
                BigInt(scaledRewardAmountPerPerson),
                BigInt(scaledRewardAmountPerCorrectAnswer),
                tokenAddress
            ],
        });
    }

    const requiredDetailsAreFilled = () => {
        return tokenAddress && rewardAmountPerPerson;
    }

    const labelMarginAndPadding = 'm-2 mt-4 block';

    return (
        <PageWrapper>
            <TitleWithLinkToExamPage id={id}>Create Reward</TitleWithLinkToExamPage>
            <div>
                {chain?.id !== 42220 ? <><label className={`${labelMarginAndPadding}`}>Token Address *</label>
                <Input
                    value={tokenAddress}
                    type="text"
                    placeholder="Token Address"
                    onChange={(e: any) => {
                        setTokenAddress(e.target.value);
                    }}
                /></>
            : <>Reward users with G$ tokens!</>}
                <label className={`${labelMarginAndPadding}`}>Reward Amount</label>
                <Input
                    value={initialRewardAmount}
                    type="number"
                    placeholder="Reward Amount"
                    onChange={(e: any) => {
                        setInitialRewardAmount(e.target.value);
                    }}
                />
                <label className={`${labelMarginAndPadding}`}>Reward Amount Per Person *</label>
                <Input
                    value={rewardAmountPerPerson}
                    type="number"
                    placeholder="Reward Amount Per Person"
                    onChange={(e: any) => {
                        setRewardAmountPerPerson(e.target.value);
                    }}
                />
                <label className={`${labelMarginAndPadding}`}>Reward Amount Per Correct Answer</label>
                <Input
                    title="bonus for every correct answer above the base"
                    value={rewardAmountPerCorrectAnswer}
                    type="number"
                    placeholder="Reward Amount Per Correct Answer"
                    onChange={(e: any) => {
                        setRewardAmountPerCorrectAnswer(e.target.value);
                    }}
                />
                <div className="mt-8 block">{""}</div>
                {!requiredDetailsAreFilled() && <Text mt="2" ml="2" color="red" display="block">* Fields are required</Text>}
                <Button disabled={!requiredDetailsAreFilled()} onClick={handleCreateReward} className="block mt-3 bg-base-100" >
                    Create Reward
                </Button>

            </div>
        </PageWrapper>
    );
}

export default CreateReward