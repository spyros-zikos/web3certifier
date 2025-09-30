import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
import { useAccount, useSendTransaction } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";
import { useState } from "react";
import { chainsToContracts, grantReceiverAddress, SUPPORTED_NETWORKS } from '~~/constants';
import { getReferralTag, submitReferral } from '@divvi/referral-sdk'
import { encodeFunctionData } from 'viem'
import { estimateGas } from '@wagmi/core'
import { config } from "~~/utils/wagmi/config";
import { getChainFromChainNumber } from "~~/utils/wagmi/getChainFromChainNumber";

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
    const wagmiSendTransaction = useSendTransaction();
    const { chain, address } = useAccount();
    const { targetNetwork } = useTargetNetwork();
    const [isMining, setIsMining] = useState(false);
    const [success, setSuccess] = useState(false);

    const actionsAfterTx = (onSuccess?: () => void) => {
        setSuccess(true);
        new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
        onSuccess ? onSuccess() : window.location.reload();
    };
    
    async function sendContractWriteAsyncTx(params: Params) {
        if (!chain?.id) {
            notification.error("Please connect your wallet");
            return;
        }
        if (chain?.id !== targetNetwork.id) {
            notification.error("You are on the wrong network");
            return;
        }

        const chainId: number = (chain && Object.values(SUPPORTED_NETWORKS).includes(chain.id)) ? chain.id : 11155111;
        const contractName: string = params.contractName ? params.contractName : "Certifier";
        const addressAndAbi = chainsToContracts[chainId][contractName];

        // Generate referral tag
        const referralTag = getReferralTag({
            user: address as any,
            consumer: grantReceiverAddress,
        })

        try {
            setIsMining(true);
            
            // Encode the function call data
            const encodedData = encodeFunctionData({
                abi: addressAndAbi.abi,
                functionName: params.functionName,
                args: params.args,
            });

            // Append referral tag to the encoded data
            const dataWithReferral = `${encodedData}${referralTag}`;

            const { onBlockConfirmation, blockConfirmations } = {
                onBlockConfirmation: (res: any) => {
                    console.log("block confirm", res);
                },
                blockConfirmations: 1
            }

            async function writeWithParams() {
                try {
                    // First estimate the gas needed
                    const estimatedGas = await estimateGas(config, {
                        to: params.contractAddress ? params.contractAddress : addressAndAbi.address,
                        data: dataWithReferral as `0x${string}`,
                        value: params.value,
                        // blockTag: 'latest',
                        chainId: getChainFromChainNumber(chainId).id
                    })
                    
                    // Add 25% buffer to the estimated gas
                    const gasWithBuffer = BigInt(Math.ceil(Number(estimatedGas) * 1.25));
                    
                    // Use sendTransaction for full control over transaction data
                    return wagmiSendTransaction.sendTransactionAsync({
                        to: params.contractAddress ? params.contractAddress : addressAndAbi.address,
                        data: dataWithReferral as `0x${string}`,
                        value: params.value,
                        gas: gasWithBuffer,
                        // chainId: getChainFromChainNumber(chainId).id
                    });
                } catch (error) {
                    // If gas estimation fails, fallback to default behavior
                    // this error pops up and needs to be handled externally
                    return wagmiSendTransaction.sendTransactionAsync({
                        to: params.contractAddress ? params.contractAddress : addressAndAbi.address,
                        data: dataWithReferral as `0x${string}`,
                        value: params.value,
                        // chainId: getChainFromChainNumber(chainId).id,
                        gas: BigInt(1000000) // needs testing
                    });
                }
            }

            const writeTxHash = await writeTx(writeWithParams, { blockConfirmations, onBlockConfirmation });

            if (chainId === 42220) {
                // Report to Divvi
                await submitReferral({ txHash: writeTxHash!, chainId })
            }
            
            actionsAfterTx(params.onSuccess);

        } catch (error: any) {
            if (error.toString().includes('-32019')) {
                console.log("Block range error during gas estimation, but transaction may have succeeded");
                actionsAfterTx(params.onSuccess);
            }
            else {
                console.log("user denied transaction", error);
            }
        } finally {
            setIsMining(false);
        }
    };

    return {writeContractAsync: sendContractWriteAsyncTx, isMining, success};
};