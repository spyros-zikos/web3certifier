//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {RewardFactory} from "../../contracts/RewardFactory.sol";
import "../DeployHelpers.s.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Script} from "forge-std/Script.sol";

contract DeployRewardFactoryProxy is Script, ScaffoldETHDeploy {
    address certifierProxy = block.chainid == 11155111 ? vm.envAddress("SEPOLIA_CERTIFIER_PROXY_ADDRESS")
        : block.chainid == 42161 ? vm.envAddress("ARBITRUM_CERTIFIER_PROXY_ADDRESS")
        : vm.envAddress("CELO_CERTIFIER_PROXY_ADDRESS");

    
    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner returns (address, address) {
        address rewardFactory = address(new RewardFactory());

        ERC1967Proxy proxy = new ERC1967Proxy(rewardFactory, ""); // empty initializer
        RewardFactory(address(proxy)).initialize(certifierProxy);
        console.log("RewardFactory Proxy Contract deployed at: ", address(proxy));
        console.log("RewardFactory Implementation Contract deployed at: ", rewardFactory);
        return (address(proxy), rewardFactory);
    }
}
