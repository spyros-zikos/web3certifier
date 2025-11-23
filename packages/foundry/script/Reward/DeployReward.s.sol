//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Reward} from "../../contracts/Reward.sol";
import { RewardFactory } from "../../contracts/RewardFactory.sol";
import {Script, console} from "forge-std/Script.sol";

contract DeployReward is Script {
    address certifierProxy = block.chainid == 11155111 ? vm.envAddress("SEPOLIA_CERTIFIER_PROXY_ADDRESS")
        : block.chainid == 42161 ? vm.envAddress("ARBITRUM_CERTIFIER_PROXY_ADDRESS")
        : vm.envAddress("CELO_CERTIFIER_PROXY_ADDRESS");

    
    // use `deployer` from `ScaffoldETHDeploy`

    /// @notice Needs a certifier proxy DEPLOYED
    function run() external returns (address) {
        vm.startBroadcast();
        
        address reward = address(new Reward(
            certifierProxy, // address certifier,
            1, // uint256 examId,
            0xC2e13e7E6255d84f3D517Fc4995f44C69E7abA62, // address rewardToken,
            0xC2e13e7E6255d84f3D517Fc4995f44C69E7abA62, // address owner,
            RewardFactory.DistributionType.CONSTANT, // RewardFactory.DistributionType distributionType,
            1, // uint256 distributionParameter,
            RewardFactory.EligibilityType.NONE, // RewardFactory.EligibilityType eligibilityType,
            address(1) // address eligibilityParameter
        ));
        vm.stopBroadcast();
        console.log("Reward Contract deployed at: ", reward);
        return (reward);
    }
}
