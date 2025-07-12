import Link from 'next/link'
import React from 'react'
import { useAccount } from 'wagmi';
import { wagmiWriteToContract } from '~~/hooks/wagmi/wagmiWrite';




const AnnouncementBanner = () => {
    const { chain } = useAccount();

  const { writeContractAsync: vote } = wagmiWriteToContract();
  function handleVote() {
      vote({
          contractName: 'Council',
          functionName: 'allocateBudget',
          args: [
            [
              ["0x637365C8697C63186dC4759bd0F10af9B32D3c1A"],
              [BigInt(10)],
            ]
          ],
      });
  }

  return (
    <div className="h-8 w-full text-base-200 bg-neutral flex items-center justify-center">Support us by voting for our project <div className="underline ml-[5px]" onClick={chain?.id === 42220 ? handleVote : () => window.open("https://flowstate.network/gooddollar")}>here</div>!</div>
  )
}

export default AnnouncementBanner