import React from 'react'

const LinkToExamPage = ({id}: {id: bigint}) => {
  return (
    <div className="mt-4 w-full text-[12px] font-semibold">
        <a href={`/exam_page/?id=${id}`} className="underline">{"<- Return to exam page"}</a>
    </div>
  )
}

export default LinkToExamPage