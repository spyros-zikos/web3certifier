"use client";

import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { Button, PageWrapper, Title } from "~~/components";
import { wagmiReadFromContract } from "~~/hooks/wagmi/wagmiRead";
import { wagmiWriteToContract } from "~~/hooks/wagmi/wagmiWrite";

const Page = () => {
    const { address } = useAccount();
    const [ username, setTheUsername ] = useState<string>('')

    /*//////////////////////////////////////////////////////////////
                          READ FROM CONTRACT
    //////////////////////////////////////////////////////////////*/
    
    const storedUsername = wagmiReadFromContract({
        functionName: 'getUsername',
        args: [address],
    }).data as any;

    /*//////////////////////////////////////////////////////////////
                           WRITE TO CONTRACT
    //////////////////////////////////////////////////////////////*/

    const { writeContractAsync: setUsername } = wagmiWriteToContract();

    return (
        <PageWrapper>
            <Title>Connect Your Discord Account</Title>

            {storedUsername && `Your Discord Username: ${storedUsername}`}

            <Box>
                <div className="mt-6 mb-3">Set new Discord username:</div>
                <input
                    className="mb-2 border-2 border-accent bg-base-200 placeholder-base-300 p-2 mr-2 rounded-md hover:border-neutral focus:outline-none focus:border-2 focus:border-neutral"
                    type="text"
                    onChange={e => {
                        setTheUsername(e.target.value);
                    }
                }/>
            </Box>
            <Button 
            className="bg-base-100"
            onClick={() => setUsername({
                    functionName: "setUsername",
                    args: [username, BigInt(0), "0x"]
                })
            }>Submit</Button>

            <p className="mt-6">Join the Discord server to communicate with the AI Agent <a href="https://discord.gg/4rXWFNGmDJ" target="_blank"><u>here</u></a>.</p>
        </PageWrapper>
    );
}

export default Page;
