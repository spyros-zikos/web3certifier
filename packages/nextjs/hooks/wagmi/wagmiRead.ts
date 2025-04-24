import { wagmiContractConfig } from '~~/hooks/wagmi/wagmiContractConfig'
import { useAccount, useReadContract } from "wagmi";

interface Params {
    functionName: string;
    args?: any[];
}
export function wagmiReadFromContract(params: Params): any {
    const { chain } = useAccount();
    
    const readContractHookRes = useReadContract({
        chainId: chain?.id,
        ...wagmiContractConfig(chain?.id),
        ...params,
        query: {
          enabled: !Array.isArray(params.args) || !params.args.some(arg => arg === undefined),
        },
      });

    return readContractHookRes;
};