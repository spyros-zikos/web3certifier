import { wagmiContractConfig } from '~~/hooks/wagmi/wagmiContractConfig'
import { useAccount, useReadContract } from "wagmi";
import { Address } from 'abitype';

interface Params {
    functionName: string;
    args?: any[];
    contractAddress?: Address;
    abi?: any;
}

export function wagmiReadFromContract(params: Params): any {
    const { chain } = useAccount();

    const config = params.contractAddress
                ? {address: params.contractAddress, abi: params.abi}
                : wagmiContractConfig(chain?.id);
    const readContractHookRes = useReadContract({
        chainId: chain?.id,
        functionName: params.functionName,
        args: params.args,
        ...config,
        query: {
          enabled: !Array.isArray(params.args) || !params.args.some(arg => arg === undefined),
        },
      });

    return readContractHookRes;
};