import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';

const CannotClaim = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage>
            <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
            You cannot claim this reward!
        </PageErrorMessage>
    );
}

export default CannotClaim