import React, { useState } from "react";
import { Box, Heading } from '@chakra-ui/react';
import { wagmiReadFromContract } from '~~/hooks/wagmi/wagmiRead';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';
import { useNonUndefinedAccount } from "~~/utils/NonUndefinedAccount";
import { ZERO_ADDRESS } from '~~/constants';
import { DocsPage } from '~~/types/DocsPage';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { Button, Input, Text, ResponsivePageWrapper, ButtonLink } from "~~/components";
import { TitleWithLinkToExamPage, MyMenu } from '../components';
import { distributionParameterName, DistributionType, eligibilityParameterName, EligibilityType } from "~~/types/RewardTypes";


const distributionTypesList: DistributionType[] = [DistributionType.CONSTANT, DistributionType.UNIFORM, DistributionType.CUSTOM];
const eligibilityTypesList: EligibilityType[] = [EligibilityType.NONE, EligibilityType.HOLDS_TOKEN, EligibilityType.HOLDS_NFT, EligibilityType.CUSTOM];

const CreateReward = ({id}: {id: bigint}) => {
    const { chain } = useNonUndefinedAccount();

    const GOOD_DOLLAR_TOKEN = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A";

    const [distributionType, setDistributionType] = useState<DistributionType>(DistributionType.CONSTANT);
    const [distributionParameter, setDistributionParameter] = useState<number>(0);
    const [eligibilityType, setEligibilityType] = useState<EligibilityType>(EligibilityType.NONE);
    const [eligibilityParameter, setEligibilityParameter] = useState<string>("");
    const [tokenAddress, setTokenAddress] = useState<string>(chain?.id === 42220 ? GOOD_DOLLAR_TOKEN : "");

    // // fetch
    // useEffect(() => {
    //     fetch(`/api/reward_page/custom_rewards/?chainId=${chain.id}`)
    //     .then(response => response.json())
    //     .then(data => setAvailableCustomRewards([defaultCustomReward, ...data]));
    // }, []);

    /*//////////////////////////////////////////////////////////////
                           READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/

    const decimals: bigint  = wagmiReadFromContract({
        contractName: "ERC20",
        contractAddress: tokenAddress,
        functionName: "decimals",
    }).data;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: createReward } = wagmiWriteToContract();
    async function handleCreateReward() {
        const scaledDistributionParameter = distributionParameter * (Number(10) ** Number(decimals));

        createReward({
            contractName: 'RewardFactory',
            functionName: 'createReward',
            args: [
                id,
                tokenAddress,
                Object.values(DistributionType).indexOf(distributionType),
                BigInt(scaledDistributionParameter),
                Object.values(EligibilityType).indexOf(eligibilityType),
                eligibilityParameter || ZERO_ADDRESS
            ],
        });
    }

    const requiredDetailsAreFilled = () => {
        return tokenAddress;
    }

    const labelMarginAndPadding = 'mb-2 mt-6 block';

    return (
        <ResponsivePageWrapper>
            <TitleWithLinkToExamPage id={id}>Create Reward</TitleWithLinkToExamPage>
                <ButtonLink className="mb-8 w-[40%]" href={`/docs?page=${DocsPage.SettingUpRewards}`} isExternal={true} >
                    <BookOpenIcon className="h-5 w-5 mr-2 inline" />
                    Docs 
                    <BookOpenIcon className="h-5 w-5 ml-2 inline" />
                </ButtonLink>
            
                <Box mt="6" fontSize="xl" fontWeight="bold">💰 Set Up Reward</Box>
                <Box mt="2" fontSize="md">Set up reward parameters.</Box>

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
                
                {/* Distribution Type */}
                <label className={`${labelMarginAndPadding}`}>Distribution Type</label>
                <MyMenu 
                    list={distributionTypesList}
                    listItem={distributionType}
                    setListItem={
                        (type: DistributionType) => {
                            setDistributionType(type);
                            if (type === DistributionType.CUSTOM)
                                setEligibilityType(EligibilityType.CUSTOM);
                        }
                    }
                />
                
                <label className={`${labelMarginAndPadding}`}>
                    {distributionParameterName(distributionType)}
                </label>
                <Input
                    value={distributionParameter}
                    type="number"
                    onChange={(e: any) => {
                        setDistributionParameter(e.target.value);
                    }}
                />
                
                {/* Eligibility Type */}
                <label className={`${labelMarginAndPadding}`}>Eligibility Type</label>
                <MyMenu 
                    list={distributionType === DistributionType.CUSTOM ? [EligibilityType.CUSTOM] : eligibilityTypesList}
                    listItem={eligibilityType}
                        setListItem={(type: EligibilityType) => {setEligibilityType(type); 
                            if (type === EligibilityType.NONE) setEligibilityParameter(ZERO_ADDRESS); else setEligibilityParameter("");
                        }
                    }
                />

                {/* Eligibility Parameter */}
                {eligibilityType !== EligibilityType.NONE && 
                <>
                    <label className={`${labelMarginAndPadding}`}>
                        {eligibilityParameterName(eligibilityType)}
                    </label>
                    <Input  // TODO check that this is a valid address
                        value={eligibilityParameter}
                        type="text"
                        placeholder="Address"
                        onChange={(e: any) => {
                            setEligibilityParameter(e.target.value);
                        }}
                    />
                </>}

                <div className="mt-12 block">{""}</div>
                {!requiredDetailsAreFilled() && <Text mt="2" ml="2" color="red" display="block">* Fields are required</Text>}
                <Button bgColor="green" disabled={!requiredDetailsAreFilled()} onClick={handleCreateReward} className="mt-3" >
                    Create Reward
                </Button>
        </ResponsivePageWrapper>
    );
}

export default CreateReward