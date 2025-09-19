import React from 'react'
import { PageWrapper } from '~~/components'
import TitleWithLinkToExamPage from '../_components/TitleWithLinkToExamPage'
import RewardInfo from '../_components/RewardInfo'

const ErrorPage = ({ message, chain, id }: { message: string, chain: any, id: bigint }) => {
  return (
    <PageWrapper>
        <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
        <div className="text-3xl font-bold my-4 mx-auto text-base-100">
            {message}
        </div>
        <RewardInfo id={id} chain={chain}/>
    </PageWrapper>
  )
}

export default ErrorPage