import React from 'react'
import { ButtonLink } from "~~/components";
import { ZERO_ADDRESS } from '~~/constants';

const ManageRewardsLink = ({id, rewardAddress}: {id: bigint, rewardAddress: string}) => {
    return (
        <ButtonLink href={`/rewards?id=${id}`}>
            { rewardAddress === ZERO_ADDRESS ? <>Set Up Rewards -&gt;</> : <>Manage Rewards -&gt;</> }
        </ButtonLink>
    )
}

export default ManageRewardsLink