import React, { useEffect, useState } from "react";
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { Button, Input, Text, ResponsivePageWrapper, ButtonLink } from "~~/components";
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { chainsToContracts, DEFAULT_CUSTOM_REWARD, CustomReward, ZERO_ADDRESS } from '~~/constants';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Box, Heading, Menu, Portal } from '@chakra-ui/react';
import BuyGoodDollarTokensMessage from '../_components/BuyGoodDollarTokensMessage';
import { DocsPage } from '~~/types/DocsPage';
import { ActionCard } from '../_components/ActionCard';
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";

const CreateReward = ({id}: {id: bigint}) => {
    const { address, chain } = useNonUndefinedAccount();

    const GOOD_DOLLAR_TOKEN = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A";
    const defaultCustomReward = DEFAULT_CUSTOM_REWARD[chain.id][0];

    const [initialRewardAmount, setInitialRewardAmount] = useState<number>(0);
    const [rewardAmountPerPerson, setRewardAmountPerPerson] = useState<number>(0);
    const [rewardAmountPerCorrectAnswer, setRewardAmountPerCorrectAnswer] = useState<number>(0);
    const [tokenAddress, setTokenAddress] = useState<string>(chain?.id === 42220 ? GOOD_DOLLAR_TOKEN : "");
    const [customReward, setCustomReward] = useState<CustomReward>(defaultCustomReward);  // index 0 has default
    const [availableCustomRewards, setAvailableCustomRewards] = useState<CustomReward[]>([defaultCustomReward]);

    const rewardFactoryAddress = chainsToContracts[chain.id]["RewardFactory"].address;

    // fetch
    useEffect(() => {
        fetch(`/api/reward_page/custom_rewards/?chainId=${chain.id}`)
        .then(response => response.json())
        .then(data => setAvailableCustomRewards([defaultCustomReward, ...data]));
    }, []);

    /*//////////////////////////////////////////////////////////////
                           READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/
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
                tokenAddress,
                customReward?.address || ZERO_ADDRESS
            ],
        });
    }

    const requiredDetailsAreFilled = () => {
        return tokenAddress;
    }

    const labelMarginAndPadding = 'mb-2 mt-8 block';

    return (
        <ResponsivePageWrapper>
            <TitleWithLinkToExamPage id={id}>Create Reward</TitleWithLinkToExamPage>
            <div>
                    <ButtonLink className="mb-8 w-[40%]" href={`/docs?page=${DocsPage.SettingUpRewards}`} isExternal={true} >
                        <BookOpenIcon className="h-5 w-5 mr-2 inline" />
                        Docs 
                        <BookOpenIcon className="h-5 w-5 ml-2 inline" />
                    </ButtonLink>
            
                <ActionCard
                    title="💰 Set Up Reward"
                    description="Set up reward parameters. You can change them later if you want."
                >
                    {chain?.id !== 42220 ? <><label className={`${labelMarginAndPadding}`}>Token Address *</label>
                    <Input
                        value={tokenAddress}
                        type="text"
                        placeholder="Token Address"
                        onChange={(e: any) => {
                            setTokenAddress(e.target.value);
                        }}
                    /></>
                    : <Heading fontSize="lg" fontWeight={"bold"} mb={4}>Reward users with G$ tokens!</Heading>}
                    <label className={`${labelMarginAndPadding}`}>Total Reward Amount</label>
                    <Input
                        value={initialRewardAmount}
                        type="number"
                        placeholder="Reward Amount"
                        onChange={(e: any) => {
                            setInitialRewardAmount(e.target.value);
                        }}
                    />
                    {chain?.id === 42220 && <BuyGoodDollarTokensMessage />}
                    <div className="mt-8 block">{""}</div>
                    <label className={`${labelMarginAndPadding}`}>Reward Amount Per Person</label>
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
                    <label className={`${labelMarginAndPadding}`}>Custom Reward</label>
                    <Menu.Root>
      <Menu.Trigger>
        <Button className="my-0" >
            {customReward.name}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content maxH="120px" minW="10rem" bgColor="lighterBlack">
            <Menu.RadioItemGroup
              value={customReward.name}
              onValueChange={(e) => setCustomReward(availableCustomRewards.filter((reward) => reward.name === e.value)[0])}
            >
              {availableCustomRewards.map((reward) => (
                <Menu.RadioItem key={reward.name} value={reward.name} color="neutral">
                  {reward.name}
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>

                    <Box>{customReward.description}</Box>

                    <div className="mt-12 block">{""}</div>
                    {!requiredDetailsAreFilled() && <Text mt="2" ml="2" color="red" display="block">* Fields are required</Text>}
                    <Button bgColor="green" disabled={!requiredDetailsAreFilled()} onClick={handleCreateReward} className="mt-3" >
                        Create Reward
                    </Button>
                </ActionCard>
            </div>
        </ResponsivePageWrapper>
    );
}

export default CreateReward