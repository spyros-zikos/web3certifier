import React from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { ZERO_ADDRESS } from '~~/constants';
import { Address } from '~~/components/scaffold-eth';
import { Accordion, Text, Spacer } from '@chakra-ui/react';
import ExamDetail from './ExamDetail';


const RewardInfoDropDown = ({id}: {id: bigint}) => {

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

    return (
        <Accordion.Root borderBottom="1px solid" borderColor="lighterLighterBlack" my="0" py="2" collapsible>
            <Accordion.Item value={"1"}>
                <Accordion.ItemTrigger>
                <Text fontWeight="semibold" fontSize={"lg"}>
                    Reward Information
                </Text>
                <Spacer />
                <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                <Accordion.ItemBody>
                        <ExamDetail
                            name="Available Reward Amount"
                            value={(scaledBalance?scaledBalance.toFixed(2).toString():"0") + " " + (tokenSymbol?tokenSymbol.toString():"unknown")}
                        />
                        <ExamDetail
                            name="Reward Amount Per Person"
                            value={(scaledRewardAmountPerPerson?scaledRewardAmountPerPerson.toFixed(2).toString():"0") + " " + (tokenSymbol?tokenSymbol.toString():"unknown")}
                        />
                        {scaledRewardAmountPerCorrectAnswer ? 
                        <ExamDetail
                            name="Reward Amount Per Correct Answer"
                            value={(scaledRewardAmountPerCorrectAnswer?scaledRewardAmountPerCorrectAnswer.toFixed(2).toString():"0") + " " + (tokenSymbol?tokenSymbol.toString():"unknown")}
                        /> 
                        : <></>}
                        <ExamDetail name="Token Name" value={tokenName?tokenName.toString():"unknown"} />
                        <ExamDetail name="Token Symbol" value={tokenSymbol?tokenSymbol.toString():"unknown"} />
                        <ExamDetail
                            name="Token Address"
                            value={tokenAddress ?
                            <div className="inline-block">
                                <Address address={tokenAddress} className={"text-bold"} disableAddressLink={false} />
                            </div>
                            : <>unknown</>}
                        />
                        <ExamDetail
                            name="Reward Address"
                            value={tokenAddress ?
                            <div className="inline-block">
                                <Address address={rewardAddress} className={"text-bold inline-block"} disableAddressLink={false} />
                            </div>
                            :<>unknown</>}
                        />
                        {customRewardAddress !== ZERO_ADDRESS ?
                        <ExamDetail
                            name="Custom Reward Logic"
                            value={customRewardAddress ?
                            <div className="inline-block">
                                <Address address={customRewardAddress} className={"text-bold inline-block"} disableAddressLink={false} />
                            </div>
                            :<>unknown</>}
                        />
                    : <></>}
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    );
}

export default RewardInfoDropDown