import React from 'react'
import LinkToExamPage from './LinkToExamPage'
import { Title } from '~~/components'

const TitleWithLinkToExamPage = ({children, id}: {children: React.ReactNode, id: bigint }) => {
  return (
    <Title>
        <>
            {children}
            <LinkToExamPage id={id} />
        </>
    </Title>
  )
}

export default TitleWithLinkToExamPage