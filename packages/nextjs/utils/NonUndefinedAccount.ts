import { celo } from "viem/chains";
import { useAccount } from "wagmi";
import { ONE_ADDRESS } from "~~/constants";

export const useNonUndefinedAccount = () => {
    const { address, chain } = useAccount();
    return { address: address || ONE_ADDRESS, chain: chain || celo, isConnected: address !== undefined };
};