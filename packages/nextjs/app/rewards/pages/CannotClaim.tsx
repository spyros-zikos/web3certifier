import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const CannotClaim = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            You cannot claim this reward!
        </PageErrorMessage>
    );
}

export default CannotClaim