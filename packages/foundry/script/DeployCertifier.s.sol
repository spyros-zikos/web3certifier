//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Certifier} from "../contracts/Certifier.sol";
import "./DeployHelpers.s.sol";

contract DeployCertifier is ScaffoldETHDeploy {
    uint256 private constant TIME_TO_CORRECT_EXAM = 5*60; // 5 minutes
    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner {
        Certifier certifier = new Certifier(TIME_TO_CORRECT_EXAM);
        console.logString(string.concat("YourContract deployed at: ", vm.toString(address(certifier))));
    }
}
