import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const RewardDoesNotExist = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            This reward does not exist!
        </PageErrorMessage>
    );
}

export default RewardDoesNotExist