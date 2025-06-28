import Link from 'next/link'
import React from 'react'

const AnnouncementBanner = () => {
  return (
    <div className="h-8 w-full text-base-200 bg-neutral flex items-center justify-center">Support us by endorsing our project <Link href="https://gap.karmahq.xyz/project/web3-certifier-1" className="underline ml-[5px]">here</Link>!</div>
  )
}

export default AnnouncementBanner