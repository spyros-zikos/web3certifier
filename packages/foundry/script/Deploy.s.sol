//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./DeployHelpers.s.sol";
import {UpgradeCertifierProxy} from "./Certifier/UpgradeCertifierProxy.s.sol";
import {DeployCertifierProxy} from "./Certifier/DeployCertifierProxy.s.sol";
import {UpgradeRewardFactoryProxy} from "./RewardFactory/UpgradeRewardFactoryProxy.s.sol";
import {DeployRewardFactoryProxy} from "./RewardFactory/DeployRewardFactoryProxy.s.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Certifier} from "../contracts/Certifier.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        if (keccak256(abi.encode(vm.envString("DEPLOY_CONTRACT"))) == keccak256(abi.encode("Certifier"))) {
            if (vm.envBool("UPGRADE_CERTIFIER_CONTRACT")) {
                UpgradeCertifierProxy upgradeProxy = new UpgradeCertifierProxy();
                upgradeProxy.run();
            } else {
                DeployCertifierProxy deployCertifierProxy = new DeployCertifierProxy();
                deployCertifierProxy.run();
                console.log("Store the proxy address in the .env file");
            }
        } else {
            if (vm.envBool("UPGRADE_REWARD_FACTORY_CONTRACT")) {
                UpgradeRewardFactoryProxy upgradeProxy = new UpgradeRewardFactoryProxy();
                upgradeProxy.run();
            } else {
                DeployRewardFactoryProxy deployRewardFactoryProxy = new DeployRewardFactoryProxy();
                deployRewardFactoryProxy.run();
                console.log("Store the proxy address in the .env file");
            }
        }


        // deploy more contracts here
        // DeployMyContract deployMyContract = new DeployMyContract();
        // deployMyContract.run();
    }
}
