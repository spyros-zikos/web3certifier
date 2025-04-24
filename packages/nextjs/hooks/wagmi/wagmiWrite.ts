import { useTargetNetwork, useTransactor } from "~~/hooks/scaffold-eth";
import { wagmiContractConfig } from '~~/hooks/wagmi/wagmiContractConfig'
import { useAccount, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

interface Params {
    functionName: string;
    args: any[];
    value?: any;
}

export function wagmiWriteToContract() {
    const writeTx = useTransactor();
    const wagmiContractWrite = useWriteContract();
    const { chain } = useAccount();
    const { targetNetwork } = useTargetNetwork();
    
    async function sendContractWriteAsyncTx(params: Params) {
        if (!chain?.id) {
            notification.error("Please connect your wallet");
            return;
        }
        if (chain?.id !== targetNetwork.id) {
            notification.error("You are on the wrong network");
            return;
        }
        
        function writeWithParams() {
            return wagmiContractWrite.writeContractAsync({
                ...wagmiContractConfig(chain?.id),
                ...params
            });
        }

        const { onBlockConfirmation, blockConfirmations } = {
            onBlockConfirmation: (res: any) => {
                console.log("block confirm", res);
            },
            blockConfirmations: 3
        }
        try {
            const writeTxResult = await writeTx(writeWithParams, { blockConfirmations, onBlockConfirmation });
            return writeTxResult;
        } catch (error) {
            console.log("user denied transaction");
        }
    };

    return {writeContractAsync: sendContractWriteAsyncTx};
};