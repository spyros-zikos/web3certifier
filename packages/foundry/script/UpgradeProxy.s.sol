//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Certifier} from "../contracts/Certifier.sol";
import "./DeployHelpers.s.sol";

contract UpgradeProxy is ScaffoldETHDeploy {

    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner returns (address) {
        Certifier certifier = new Certifier();
        console.log("Certifier Contract deployed at: ", address(certifier));
        address proxy = vm.envAddress("PROXY_ADDRESS");
        Certifier(proxy).upgradeToAndCall(address(certifier), "");
        return proxy;
    }
}
