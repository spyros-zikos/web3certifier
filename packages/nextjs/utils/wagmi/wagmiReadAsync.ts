import { SUPPORTED_NETWORKS } from "~~/constants";
import { chainsToContracts } from '~~/constants';
import { readContract, createConfig, http } from '@wagmi/core'
import { sepolia, celo, arbitrum } from 'wagmi/chains'

const { SEPOLIA_RPC_URL, ARBITRUM_RPC_URL, CELO_RPC_URL } = process.env

const config = createConfig({
  chains: [sepolia, arbitrum, celo],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [arbitrum.id]: http(ARBITRUM_RPC_URL),
    [celo.id]: http(CELO_RPC_URL),
  },
})

const getChainIdFromChainNumber = (chainNumber: number) => {
    return chainNumber === SUPPORTED_NETWORKS.sepolia
        ? sepolia.id
        : chainNumber === SUPPORTED_NETWORKS.celo
        ? celo.id
        : arbitrum.id
}

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
        chainId: getChainIdFromChainNumber(params.chainId)
    })
    return result;
};