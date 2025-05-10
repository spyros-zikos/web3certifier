import React from 'react'
import { PageWrapper } from '~~/components'
import TitleWithLinkToExamPage from './TitleWithLinkToExamPage'
import RewardInfo from './RewardInfo'

const PageErrorMessage = ({ children, id }: { children: React.ReactNode, id: bigint }) => {
  return (
    <PageWrapper>
        <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
        <div className="text-3xl font-bold my-4 mx-auto text-base-100">
            {children}
        </div>
        <RewardInfo id={id}/>
    </PageWrapper>
  )
}

export default PageErrorMessage