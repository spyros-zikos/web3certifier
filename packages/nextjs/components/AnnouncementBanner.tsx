import React from 'react'

const AnnouncementBanner = () => {
  return (
    <div className="h-8 w-full text-base-200 bg-neutral flex items-center justify-center">Support us by voting for our project <div className="underline ml-[5px]" onClick={() => window.open("https://flowstate.network/gooddollar")}>here</div>!</div>
  )
}

export default AnnouncementBanner