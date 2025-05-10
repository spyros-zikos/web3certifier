import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const CannotClaim = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            <div>In order to claim, you need to pass the exam!</div>
        </PageErrorMessage>
    );
}

export default CannotClaim