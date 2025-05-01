"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button, PageWrapper, Title } from "~~/components";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";

const Page = () => {
    const { address } = useAccount();
    const [ username, _ ] = useState<string>('')

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/
    
    const storedUsername = wagmiReadFromContract({
        functionName: 'getUsername',
        args: [address],
        contractAddress: "0x0", // TODO
        abi: [] // TODO
    }).data as any;

    console.log(storedUsername);

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: setUsername } = wagmiWriteToContract();

    return (
        <PageWrapper>
            <Title>Claim Your Reward</Title>
            <div className="text-5xl">Set this up!</div>
            {/* <Box>
                <div className="mt-6 mb-3">Set new Discord username:</div>
                <input
                    className="mb-2 border-2 border-accent bg-base-200 placeholder-base-300 p-2 mr-2 rounded-md hover:border-neutral focus:outline-none focus:border-2 focus:border-neutral"
                    type="text"
                    onChange={e => {
                        setTheUsername(e.target.value);
                    }
                }/>
            </Box> */}
            <Button
                className="bg-base-100 mt-[100px] text-9xl font-bold"
                onClick={() => setUsername({
                    functionName: "setUsername",
                    args: [username, BigInt(0), "0x"],
                    contractAddress: "0x0", // TODO
                    abi: [] // TODO
                })
            }>Claim Reward</Button>
        </PageWrapper>
    );
}

export default Page;
