import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const NotCustomEligible = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage id={id}>
            <div>
                <div>You do not satisfy the custom eligibility criteria!</div>
            </div>
        </PageErrorMessage>
    );
}

export default NotCustomEligible