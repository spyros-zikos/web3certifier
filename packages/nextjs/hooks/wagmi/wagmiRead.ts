import { SUPPORTED_NETWORKS } from "~~/constants";
import { useAccount, useReadContract } from "wagmi";
import { chainsToContracts } from '~~/constants';

interface Params {
    contractName?: string;
    contractAddress?: string;
    functionName: string;
    args?: any[];
}

export function wagmiReadFromContract(params: Params): any {
    const { chain } = useAccount();

    const chainId: number = (chain && SUPPORTED_NETWORKS.includes(chain.id)) ? chain.id : 11155111;
    const contractName: string = params.contractName ? params.contractName : "Certifier";
    const addressAndAbi = chainsToContracts[chainId][contractName];
    
    const readContractHookRes = useReadContract({
        chainId: chain?.id,
        functionName: params.functionName,
        args: params.args,
        address: params.contractAddress ? params.contractAddress: addressAndAbi.address,
        abi: addressAndAbi.abi,
        query: {
          enabled: !Array.isArray(params.args) || !params.args.some(arg => arg === undefined),
        },
      });

    return readContractHookRes;
};