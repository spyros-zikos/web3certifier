import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage';

const RewardDoesNotExist = ({id}: {id: bigint}) => {
    return (
        <PageErrorMessage>
            <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
            This reward does not exist!
        </PageErrorMessage>
    );
}

export default RewardDoesNotExist