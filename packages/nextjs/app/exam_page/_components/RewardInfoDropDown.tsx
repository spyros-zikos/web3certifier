import React from 'react'
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { ZERO_ADDRESS } from '~~/constants';
import { Address } from '~~/components/scaffold-eth';
import { Accordion, Text, Spacer } from '@chakra-ui/react';
import ExamDetail from './ExamDetail';
import { distributionParameterName, DistributionType, eligibilityParameterName, EligibilityType } from '~~/types/RewardTypes';


const RewardInfoDropDown = ({id}: {id: bigint}) => {

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

    const distributionParameter: number = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getDistributionParameter",
    }).data;

    const eligibilityTypeNumber: number  = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getEligibilityType",
    }).data;

    const eligibilityParameter: string = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getEligibilityParameter",
    }).data;

    const balance: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
        functionName: "balanceOf",
        args: [rewardAddress],
    }).data;

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
        functionName: "decimals",
    }).data;

    const tokenName: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
        functionName: "name",
    }).data;

    const tokenSymbol: string  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: rewardToken,
        functionName: "symbol",
    }).data;

    const customRewardName = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "customRewardName",
    }).data;

    const customEligibilityDescription = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "customEligibilityDescription",
    }).data;

    const customDistributionDescription = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "customDistributionDescription",
    }).data;

    const usersThatClaimed = wagmiReadFromContract({
        contractName: "Reward",
        contractAddress: rewardAddress,
        functionName: "getUsersThatClaimed",
    }).data;

    if (rewardAddress === ZERO_ADDRESS)
        return <></>;

    const scaledBalance = Number(balance) / (Number(10) ** Number(decimals));
    const scaledDistributionParameter = Number(distributionParameter) / (Number(10) ** Number(decimals));
    const distributionType = Object.values(DistributionType)[distributionTypeNumber];
    const eligibilityType = Object.values(EligibilityType)[eligibilityTypeNumber];
    
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
                        {((scaledBalance !== undefined) && tokenSymbol) &&
                        <ExamDetail name="Available Reward Amount"
                            value={<div>{scaledBalance.toString()} {} {tokenSymbol.toString()}</div>} 
                        />}

                        {/* Distribution Type */}
                        {distributionType && <ExamDetail name="Distribution Type" value={distributionType} />}

                        {/* Distribution Parameter */}
                        {scaledDistributionParameter!==undefined && !Number.isNaN(scaledDistributionParameter) && 
                            Object.values(DistributionType)[distributionTypeNumber] !== DistributionType.DRAW &&
                        <ExamDetail name={distributionParameterName(distributionType)}
                            value={scaledDistributionParameter.toString()} 
                        />}

                        {Object.values(DistributionType)[distributionTypeNumber] === DistributionType.DRAW &&
                            distributionParameter !== 0 &&
                        <ExamDetail name={"Draw Winner"}
                            value={<Address address={usersThatClaimed?.[Number(distributionParameter) % usersThatClaimed?.length]} className={"text-bold inline-block"} disableAddressLink={true} />}
                        />}

                        {/* Eligibility Type */}
                        {eligibilityType && <ExamDetail name="Eligibility Type" value={eligibilityType} />}

                        {/* Eligibility Parameter */}
                        {eligibilityParameter && (eligibilityParameter != ZERO_ADDRESS) && 
                        <ExamDetail name={eligibilityParameterName(eligibilityType)}
                            value={<Address address={eligibilityParameter} className={"text-bold"} disableAddressLink={true} />} 
                        />}

                        {/* Reward Token */}
                        {tokenName && tokenSymbol && <ExamDetail name="Reward Token"
                            value={tokenName.toString() + " (" + tokenSymbol.toString() + ")"} 
                        />}
                        {rewardToken && <ExamDetail name="Reward Token Address"
                            value={<Address address={rewardToken} className={"text-bold"} disableAddressLink={true} />}
                        />}
                        {rewardToken && <ExamDetail name="Reward Address"
                            value={<Address address={rewardAddress} className={"text-bold inline-block"} disableAddressLink={true} />} 
                        />}

                        {/* Custom Reward Name */}
                        {eligibilityType === EligibilityType.CUSTOM && customRewardName && <ExamDetail name="Custom Reward Name" value={customRewardName} />}

                        {/* Custom Eligibility Description */}
                        {eligibilityType === EligibilityType.CUSTOM && customEligibilityDescription && <div className="mb-4">
                            {<><div className="text-base-100">Custom Eligibility Description:</div>{customEligibilityDescription}</>}
                        </div>}

                        {/* Custom Distribution Description */}
                        {distributionType === DistributionType.CUSTOM && customDistributionDescription && <div>
                            {<><div className="text-base-100">Custom Distribution Description:</div>{customDistributionDescription}</>}
                        </div>}
                    </Accordion.ItemBody>
                </Accordion.ItemContent>
            </Accordion.Item>
        </Accordion.Root>
    );
}

export default RewardInfoDropDown