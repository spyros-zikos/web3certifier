import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';

const AlreadyClaimed = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage>
            <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
            You already claimed this reward!
        </PageErrorMessage>
    );
}

export default AlreadyClaimed