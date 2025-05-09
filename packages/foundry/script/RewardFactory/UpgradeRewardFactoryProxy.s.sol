//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {RewardFactory} from "../../contracts/RewardFactory.sol";
import "../DeployHelpers.s.sol";

contract UpgradeRewardFactoryProxy is ScaffoldETHDeploy {
    address proxy = block.chainid == 11155111 ? vm.envAddress("SEPOLIA_REWARD_FACTORY_PROXY_ADDRESS")
        : block.chainid == 42161 ? vm.envAddress("ARBITRUM_REWARD_FACTORY_PROXY_ADDRESS")
        : vm.envAddress("CELO_REWARD_FACTORY_PROXY_ADDRESS");

    // use `deployer` from `ScaffoldETHDeploy`
    function run() external ScaffoldEthDeployerRunner returns (address) {
        RewardFactory rewardFactory = new RewardFactory();
        console.log("RewardFactory Implementation Contract deployed at: ", address(rewardFactory));
        RewardFactory(proxy).upgradeToAndCall(address(rewardFactory), "");
        return proxy;
    }
}
