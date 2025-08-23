import { chainsToContracts } from '~~/constants';
import { readContract } from '@wagmi/core';
import { config } from '~~/utils/wagmi/config';
import { getChainFromChainNumber } from '~~/utils/wagmi/getChainFromChainNumber';

interface Params {
    contractName?: string;
    contractAddress?: string;
    functionName: string;
    args?: any[];
    chainId: number
}

export async function wagmiReadFromContractAsync(params: Params) {

    const contractName: string = params.contractName ? params.contractName : "Certifier";
    const addressAndAbi = chainsToContracts[params.chainId][contractName];

    const result = await readContract(config, {
        abi: addressAndAbi.abi,
        address: params.contractAddress ? params.contractAddress: addressAndAbi.address,
        functionName: params.functionName,
        args: params.args ? params.args : [],
        chainId: getChainFromChainNumber(params.chainId).id
    })
    return result;
};