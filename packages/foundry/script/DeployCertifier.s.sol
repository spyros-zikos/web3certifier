//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Certifier} from "../contracts/Certifier.sol";
import "./DeployHelpers.s.sol";

contract DeployCertifier is ScaffoldETHDeploy {
    address public PRICE_FEED = address(
        block.chainid == 11155111
        ? 0x694AA1769357215DE4FAC081bf1f309aDC325306  // sepolia
        : (block.chainid == 42161
            ? 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612 // arbitrum
            : 0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e)  // celo
    );
    
    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner {
        Certifier certifier = new Certifier(PRICE_FEED);
        console.logString(string.concat("YourContract deployed at: ", vm.toString(address(certifier))));
    }
}
