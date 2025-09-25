import { celo } from "viem/chains";
import { useAccount } from "wagmi";
import { DEFAULT_USER_ADDRESS } from "~~/constants";

export const useNonUndefinedAccount = () => {
    const { address, chain } = useAccount();
    return { address: address || DEFAULT_USER_ADDRESS, chain: chain || celo, isConnected: address !== undefined };
};