import React from 'react'
import PageErrorMessage from '../_components/PageErrorMessage';

const AlreadyClaimed = ({id}: {id: bigint}) => {
    return (<>
        <PageErrorMessage id={id}>
            You already claimed this reward!
        </PageErrorMessage></>
    );
}

export default AlreadyClaimed