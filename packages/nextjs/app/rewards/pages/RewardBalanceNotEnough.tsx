import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const RewardBalanceNotEnough = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            <div>
                <div>The reward pool does not have enough tokens to reward you.</div>
            </div>
        </PageErrorMessage>
    );
}

export default RewardBalanceNotEnough