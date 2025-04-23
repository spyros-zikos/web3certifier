//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import {UpgradeProxy} from "./UpgradeProxy.s.sol";
import {DeployProxy} from "./DeployProxy.s.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Certifier} from "../contracts/Certifier.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        if (vm.envBool("UPGRADE_CONTRACT")) {
            UpgradeProxy upgradeProxy = new UpgradeProxy();
            upgradeProxy.run();
        } else {
            DeployProxy deployProxy = new DeployProxy();
            deployProxy.run();
            console.log("Store the proxy address in the .env file");
        }


        // deploy more contracts here
        // DeployMyContract deployMyContract = new DeployMyContract();
        // deployMyContract.run();
    }
}
