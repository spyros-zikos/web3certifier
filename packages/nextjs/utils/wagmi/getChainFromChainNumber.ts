import { SUPPORTED_NETWORKS } from "~~/constants";
import { sepolia, celo, arbitrum } from 'wagmi/chains';


export const getChainFromChainNumber = (chainNumber: number) => {
    return chainNumber === SUPPORTED_NETWORKS.sepolia
        ? sepolia
        : chainNumber === SUPPORTED_NETWORKS.celo
        ? celo
        : arbitrum
}