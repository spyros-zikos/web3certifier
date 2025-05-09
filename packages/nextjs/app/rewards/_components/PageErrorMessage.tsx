import React from 'react'
import { PageWrapper } from '~~/components'
import TitleWithLinkToExamPage from './TitleWithLinkToExamPage'

const PageErrorMessage = ({ children, id }: { children: React.ReactNode, id: bigint }) => {
  return (
    <PageWrapper>
        <TitleWithLinkToExamPage id={id}>Claim Reward</TitleWithLinkToExamPage>
        <div className="text-3xl font-bold mt-24 mx-auto">
            {children}
        </div>
    </PageWrapper>
  )
}

export default PageErrorMessage