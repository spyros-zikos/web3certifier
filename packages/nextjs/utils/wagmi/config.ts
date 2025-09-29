import { sepolia, celo, arbitrum } from 'wagmi/chains'
import { createConfig, http } from '@wagmi/core'

const { SEPOLIA_RPC_URL, ARBITRUM_RPC_URL, CELO_RPC_URL } = process.env

export const transports = {
    [sepolia.id]: http(SEPOLIA_RPC_URL),
    [arbitrum.id]: http(ARBITRUM_RPC_URL),
    [celo.id]: http(CELO_RPC_URL),
}

export const config = createConfig({
    chains: [sepolia, arbitrum, celo],
    transports
})