//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Certifier} from "../../contracts/Certifier.sol";
import "../DeployHelpers.s.sol";

contract UpgradeCertifierProxy is ScaffoldETHDeploy {
    address proxy = block.chainid == 11155111 ? vm.envAddress("SEPOLIA_CERTIFIER_PROXY_ADDRESS")
        : block.chainid == 42161 ? vm.envAddress("ARBITRUM_CERTIFIER_PROXY_ADDRESS")
        : vm.envAddress("CELO_CERTIFIER_PROXY_ADDRESS");

    // use `deployer` from `ScaffoldETHDeploy`
    function run() external ScaffoldEthDeployerRunner returns (address) {
        Certifier certifier = new Certifier();
        console.log("Certifier Implementation Contract deployed at: ", address(certifier));
        Certifier(proxy).upgradeToAndCall(address(certifier), "");
        return proxy;
    }
}
