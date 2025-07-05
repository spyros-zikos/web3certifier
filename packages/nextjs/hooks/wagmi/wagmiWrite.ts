import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
// import { wagmiContractConfig } from '~~/hooks/wagmi/wagmiContractConfig'
import { useAccount, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { useState } from "react";
import { chainsToContracts, SUPPORTED_NETWORKS } from '~~/constants';

interface Params {
    contractName?: string;
    contractAddress?: string;
    functionName: string;
    args: any[];
    value?: any;
    onSuccess?: () => void;
}

export function wagmiWriteToContract() {
    const writeTx = useTransactor();
    const wagmiContractWrite = useWriteContract();
    const { chain } = useAccount();
    const { targetNetwork } = useTargetNetwork();
    const [isMining, setIsMining] = useState(false);
    const [success, setSuccess] = useState(false); // might not be needed
    
    async function sendContractWriteAsyncTx(params: Params) {
        if (!chain?.id) {
            notification.error("Please connect your wallet");
            return;
        }
        if (chain?.id !== targetNetwork.id) {
            notification.error("You are on the wrong network");
            return;
        }

        const chainId: number = (chain && SUPPORTED_NETWORKS.includes(chain.id)) ? chain.id : 11155111;
        const contractName: string = params.contractName ? params.contractName : "Certifier";
        const addressAndAbi = chainsToContracts[chainId][contractName];

        try {
            setIsMining(true);
            function writeWithParams() {
                return wagmiContractWrite.writeContractAsync({
                    functionName: params.functionName,
                    args: params.args,
                    value: params.value,
                    address: params.contractAddress ? params.contractAddress: addressAndAbi.address,
                    abi: addressAndAbi.abi,
                });
            }

            const { onBlockConfirmation, blockConfirmations } = {
                onBlockConfirmation: (res: any) => {
                    console.log("block confirm", res);
                },
                blockConfirmations: 1
            }
            const writeTxResult = await writeTx(writeWithParams, { blockConfirmations, onBlockConfirmation });
            
            params.onSuccess ? params.onSuccess() : window.location.reload();
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