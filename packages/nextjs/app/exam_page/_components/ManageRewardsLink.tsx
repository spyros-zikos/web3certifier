import Link from 'next/link'
import React from 'react'
import { Button } from "~~/components";
import { ZERO_ADDRESS } from '~~/constants';

const ManageRewardsLink = ({id, rewardAddress}: {id: bigint, rewardAddress: string}) => {
    return (
        <Link href={`/rewards?id=${id}`}>
            <Button className="bg-base-100" onClick={() => {
                // do nothing
            }}>
                { rewardAddress === ZERO_ADDRESS ? <>Set Up Rewards -&gt;</> : <>Manage Rewards -&gt;</> }
            </Button>
        </Link>
    )
}

export default ManageRewardsLink