//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {Certifier} from "../contracts/Certifier.sol";
import "./DeployHelpers.s.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Script} from "forge-std/Script.sol";

contract DeployProxy is Script, ScaffoldETHDeploy {
    address public priceFeed = address(
        block.chainid == 11155111
        ? 0x694AA1769357215DE4FAC081bf1f309aDC325306  // sepolia
        : (block.chainid == 42161
            ? 0x639Fe6ab55C921f74e7fac1ee960C0B6293ba612 // arbitrum
            : 0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e)  // celo
    );
    uint256 public constant TIME_TO_CORRECT = 2*24*60*60;  // 2 days
    uint256 public constant EXAM_CREATION_FEE = 2 ether;  // $2
    uint256 public constant SUBMISSION_FEE = 0.05 ether; // 5%;

    
    // use `deployer` from `ScaffoldETHDeploy`

    function run() external ScaffoldEthDeployerRunner returns (address, address) {
        address certifier = address(new Certifier());

        ERC1967Proxy proxy = new ERC1967Proxy(certifier, ""); // empty initializer
        Certifier(address(proxy)).initialize(priceFeed, TIME_TO_CORRECT, EXAM_CREATION_FEE, SUBMISSION_FEE);
        console.log("Proxy Contract deployed at: ", address(proxy));
        console.log("Certifier Contract deployed at: ", certifier);
        return (address(proxy), certifier);
    }
}
