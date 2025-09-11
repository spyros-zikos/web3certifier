import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const RewardIsZero = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            <div>
                <div>Your reward is zero. Either the certifier has not set a reward amount or you dont qualify for this reward.</div>
            </div>
        </PageErrorMessage>
    );
}

export default RewardIsZero