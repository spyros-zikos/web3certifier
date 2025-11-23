import React from 'react'
import { PageWrapper } from '~~/components'
import { TitleWithLinkToExamPage } from '../components'

const ErrorPage = ({ message, chain, id }: { message: string, chain: any, id: bigint }) => {
  return (
    <PageWrapper>
        <TitleWithLinkToExamPage id={id}>Error</TitleWithLinkToExamPage>
        <div className="text-3xl font-bold my-4 mx-auto text-base-100">
            {message}
        </div>
    </PageWrapper>
  )
}

export default ErrorPage