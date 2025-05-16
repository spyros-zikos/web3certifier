import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const CannotClaim = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            <div>
                <div>Wait for the exam to end,</div>
                <div>claim the NFT certificate</div>
                <div>and claim this reward!</div>
            </div>
        </PageErrorMessage>
    );
}

export default CannotClaim