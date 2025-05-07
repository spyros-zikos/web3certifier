import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
import { wagmiContractConfig } from '~~/hooks/wagmi/wagmiContractConfig'
import { useAccount, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { useState } from "react";
import { Address } from "abitype";

interface Params {
    functionName: string;
    args: any[];
    value?: any;
    contractAddress?: Address;
    abi?: any;
}

export function wagmiWriteToContract() {
    const writeTx = useTransactor();
    const wagmiContractWrite = useWriteContract();
    const { chain } = useAccount();
    const { targetNetwork } = useTargetNetwork();
    const [isMining, setIsMining] = useState(false);
    const [success, setSuccess] = useState(false);
    
    async function sendContractWriteAsyncTx(params: Params) {
        if (!chain?.id) {
            notification.error("Please connect your wallet");
            return;
        }
        if (chain?.id !== targetNetwork.id) {
            notification.error("You are on the wrong network");
            return;
        }

        try {
            setIsMining(true);
            function writeWithParams() {
                const config = params.contractAddress
                ? {address: params.contractAddress, abi: params.abi}
                : wagmiContractConfig(chain?.id);
                return wagmiContractWrite.writeContractAsync({
                    functionName: params.functionName,
                    args: params.args,
                    value: params.value,
                    ...config,
                });
            }

            const { onBlockConfirmation, blockConfirmations } = {
                onBlockConfirmation: (res: any) => {
                    console.log("block confirm", res);
                },
                blockConfirmations: 1
            }
            const writeTxResult = await writeTx(writeWithParams, { blockConfirmations, onBlockConfirmation });
            window.location.reload();
            setSuccess(true);
            return writeTxResult;
        } catch (error) {
            console.log("user denied transaction");
        } finally {
            setIsMining(false);
        }
    };

    return {writeContractAsync: sendContractWriteAsyncTx, isMining, success};
};