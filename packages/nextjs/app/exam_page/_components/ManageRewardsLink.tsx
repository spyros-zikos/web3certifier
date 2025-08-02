import Link from 'next/link'
import React from 'react'
import { Button } from "~~/components";

const ManageRewardsLink = ({id}: {id: bigint}) => {
    return (
        <Link href={`/rewards/?id=${id}`}>
            <Button className="bg-base-100" onClick={() => window.history.back()}>
                Manage Rewards -&gt;
            </Button>
        </Link>
    )
}

export default ManageRewardsLink